import os
import io
import base64
import numpy as np
import tensorflow as tf
import cv2
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from google import genai
import json

# ==========================================
# 1. CONFIGURATION
# ==========================================
GEMINI_MODEL = "gemini-2.5-flash"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 2. LOCAL MODEL LOADING (Unchanged)
# ==========================================
ROUTER_PATH = 'cg_router.keras'
MOISTURE_PATH = 'cg_moisture_specialist.keras'
STRUCTURAL_PATH = 'cg_structural_specialist.keras'

router_model = None
moisture_specialist = None
structural_specialist = None

try:
    router_model = tf.keras.models.load_model(ROUTER_PATH, compile=False)
    moisture_specialist = tf.keras.models.load_model(MOISTURE_PATH, compile=False)
    structural_specialist = tf.keras.models.load_model(STRUCTURAL_PATH, compile=False)
    print("✅ All models loaded successfully.")
except Exception as e:
    print(f"⚠️ Model loading error: {e}")

ROUTER_CLASSES = ['Healthy', 'Moisture', 'Structural', 'Surface']
MOISTURE_CLASSES = ['algae', 'mold', 'stain', 'water_seepage']
STRUCTURAL_CLASSES = ['major_crack', 'minor_crack', 'spalling']
ALL_DEFECTS = ['algae', 'major_crack', 'minor_crack', 'mold', 'peeling', 'plain', 'spalling', 'stain', 'water_seepage']

# ==========================================
# 3. GRAD-CAM & VISUALIZATION (Unchanged)
# ==========================================
def get_gradcam_heatmap(img_array, model):
    try:
        # 1. Identify nested base model (like VGG16) if it exists
        base_model = model
        for layer in model.layers:
            if isinstance(layer, tf.keras.Model):
                base_model = layer
                break

        # 2. Find the last Conv2D layer in the base model
        last_conv_layer_name = None
        for layer in reversed(base_model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                last_conv_layer_name = layer.name
                break

        if not last_conv_layer_name:
            return None

        # 3. Create Half 1: Image Input -> Last Conv Layer
        conv_model = tf.keras.Model(base_model.inputs, base_model.get_layer(last_conv_layer_name).output)

        # 4. Create Half 2: Last Conv Layer -> Final Prediction
        classifier_input = tf.keras.Input(shape=conv_model.output.shape[1:])
        x = classifier_input

        # Re-attach the remaining layers of the inner base_model
        layer_found = False
        for layer in base_model.layers:
            if layer_found:
                x = layer(x)
            elif layer.name == last_conv_layer_name:
                layer_found = True

        # Re-attach the remaining classification layers of the outer model
        if base_model != model:
            for layer in model.layers:
                if layer != base_model:
                    x = layer(x)

        classifier_model = tf.keras.Model(classifier_input, x)

        # 5. Compute the gradient of the TOP predicted class
        with tf.GradientTape() as tape:
            inputs = tf.cast(img_array, tf.float32)
            conv_outputs = conv_model(inputs)
            tape.watch(conv_outputs)
            preds = classifier_model(conv_outputs)
            top_pred_index = tf.argmax(preds[0])
            target_class_loss = preds[:, top_pred_index]

        # 6. Calculate the gradients backwards
        grads = tape.gradient(target_class_loss, conv_outputs)

        # 7. Pool gradients and generate the localized heatmap
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        heatmap = conv_outputs[0] @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # Normalize
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
        return heatmap.numpy()

    except Exception as e:
        print(f"⚠️ Grad-CAM Warning: {e}")
        return None


def create_overlay(img_array, heatmap):
    original_rgb = np.uint8(img_array[0] * 255)

    if heatmap is None:
        return Image.fromarray(original_rgb)

    heatmap_resized = cv2.resize(heatmap, (224, 224))
    heatmap_resized = np.uint8(255 * heatmap_resized)

    heatmap_bgr = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
    original_bgr = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2BGR)
    overlay_bgr = cv2.addWeighted(original_bgr, 0.6, heatmap_bgr, 0.4, 0)
    overlay_rgb = cv2.cvtColor(overlay_bgr, cv2.COLOR_BGR2RGB)

    return Image.fromarray(overlay_rgb)

# ==========================================
# 4. ENDPOINTS
# ==========================================

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1>ConstructGuard API is Running</h1>
        </body>
    </html>
    """

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models_loaded": all([
            router_model is not None,
            moisture_specialist is not None,
            structural_specialist is not None,
        ])
    }

@app.post("/predict")
async def predict(
    file: UploadFile = File(...), 
    api_key: str = Form(...)  # NEW: Accept API Key from frontend Form data
):
    if router_model is None or moisture_specialist is None or structural_specialist is None:
        raise HTTPException(status_code=503, detail="Models are not loaded. Check server logs.")

    # NEW: Initialize the client dynamically per request
    try:
        client = genai.Client(api_key=api_key, http_options={'api_version': 'v1'})
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Gemini API Key provided. Error: {str(e)}")

    try:
        data = await file.read()
        try:
            pil_img = Image.open(io.BytesIO(data)).convert('RGB')
        except Exception:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

        # STEP 1: Improved Gemini Validation
        v_prompt = (
            "Analyze this image. If it shows any building material (like concrete, brick, drywall), "
            "a wall surface, or construction-related defects (including close-ups of algae, mold, cracks, stains, or peeling paint), "
            "respond strictly with 'VALID'. If it is completely unrelated to buildings or surfaces "
            "(e.g., a picture of a dog, a car, or a sandwich), respond with 'INVALID: [Reason]'."
        )
        validation = client.models.generate_content(model=GEMINI_MODEL, contents=[v_prompt, pil_img])

        if "INVALID" in validation.text.upper():
            return {"status": "failed", "message": validation.text, "is_valid": False}

        # STEP 2: Local Keras Prediction
        img_prep = pil_img.resize((224, 224))
        img_arr = tf.keras.utils.img_to_array(img_prep) / 255.0
        batch = np.expand_dims(img_arr, axis=0)

        r_preds = router_model.predict(batch, verbose=0)[0]
        r_label = ROUTER_CLASSES[np.argmax(r_preds)]
        r_conf = float(r_preds[np.argmax(r_preds)])

        final_label = ""
        active_model = None
        probs = {defect: 0.0 for defect in ALL_DEFECTS}

        if r_label == 'Moisture':
            m_preds = moisture_specialist.predict(batch, verbose=0)[0]
            final_label = MOISTURE_CLASSES[np.argmax(m_preds)]
            active_model = moisture_specialist
            for i, cls in enumerate(MOISTURE_CLASSES):
                probs[cls] = float(m_preds[i] * r_conf)
        elif r_label == 'Structural':
            s_preds = structural_specialist.predict(batch, verbose=0)[0]
            final_label = STRUCTURAL_CLASSES[np.argmax(s_preds)]
            active_model = structural_specialist
            for i, cls in enumerate(STRUCTURAL_CLASSES):
                probs[cls] = float(s_preds[i] * r_conf)
        else:
            final_label = 'plain' if r_label == 'Healthy' else 'peeling'
            probs[final_label] = r_conf
            active_model = router_model

        # NEW: Normalize probabilities so they sum to 1.0
        total_prob = sum(probs.values())
        if total_prob > 0:
            probs = {k: v / total_prob for k, v in probs.items()}

        # STEP 3: Grad-CAM
        heatmap = get_gradcam_heatmap(batch, active_model)
        viz_pil = create_overlay(batch, heatmap)
        buf = io.BytesIO()
        viz_pil.save(buf, format="JPEG")
        b64_image = base64.b64encode(buf.getvalue()).decode()

        # STEP 4: Diagnostic Report
        top_probs = {k: f"{v*100:.1f}%" for k, v in probs.items() if v > 0.01}
        
        # ... Keep your existing report_prompt and generation here ...
        report_prompt = f"""
        You are ConstructGuard AI, an expert structural inspection assistant.
        Analyze the following AI classification result and generate a professional inspection report.
        
        Detected Defect:
        {final_label.replace('_', ' ').title()}
        
        Confidence Metrics:
        {top_probs}
        
        IMPORTANT RULES:
        
        Return ONLY valid JSON.
        Do not include markdown.
        Do not include explanations outside JSON.
        Do not wrap JSON in code blocks.
        Return exactly this structure:
        {{
          "executive_summary": "",
          "detected_condition": "",
          "risk_assessment": {{
            "risk_level": "",
            "summary": "",
            "consequences": []
          }},
          "probable_causes": [],
          "recommended_treatment": [],
          "preventive_maintenance": [],
          "professional_recommendation": ""
        }}
        
        CONTENT REQUIREMENTS:
        
        executive_summary:
        2-3 concise sentences.
        
        detected_condition:
        Explain the defect in simple engineering language.
        
        risk_assessment:
        Provide risk level:
        Low / Medium / High / Critical
        
        probable_causes:
        Return 3-5 causes.
        
        recommended_treatment:
        Return 4-6 repair steps.
        
        preventive_maintenance:
        Return 4-6 prevention tips.
        
        professional_recommendation:
        One concise concluding recommendation.
        """
        report_response = client.models.generate_content(model=GEMINI_MODEL,contents=report_prompt)

        try:
            report_json = json.loads(report_response.text)
        except Exception:
            report_json = {
                "executive_summary": "Report generation unavailable.",
                "detected_condition": "",
                "risk_assessment": {
                    "risk_level": "Unknown",
                    "summary": "",
                    "consequences": []
                },
                "probable_causes": [],
                "recommended_treatment": [],
                "preventive_maintenance": [],
                "professional_recommendation": ""
            }
        
        # STEP 5: Return complete response
        return {
            "status": "success",
            "is_valid": True,
            "defect": final_label,
            "router_label": r_label,
            "router_confidence": round(r_conf, 4),
            "probabilities": {k: round(v, 4) for k, v in probs.items()},
            "gradcam_image": b64_image,
            "report": report_json,
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print("\n" + "="*40)
        print("🚨 CRASH REPORT:")
        traceback.print_exc()
        print("="*40 + "\n")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)