const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://ayushmsingh2004-constructguard-backend.hf.space';

export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || `Health check failed: ${response.status}`);
    }

    return {
      success: true,
      status: 'success',
      message: 'Backend connection successful',
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      message: error.message || 'Backend connection failed',
    };
  }
};

export const analyzeDefectWithBackend = async (imageFile, apiKey) => {
  try {
    if (!imageFile) {
      throw new Error('No image selected');
    }

    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('api_key', apiKey);

    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data.detail ||
        data.message ||
        `Analysis request failed: ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Backend analysis failed');
  }
};