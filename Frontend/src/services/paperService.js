import apiClient from './apiClient';

export const paperService = {
  /**
   * Fetch all papers available to the current user (own papers + public papers)
   */
  async getPapers() {
    const res = await apiClient.get('/papers');
    return res.data;
  },

  /**
   * Fetch a single paper by id or customId
   */
  async getPaperById(id) {
    const res = await apiClient.get(`/papers/${id}`);
    return res.data;
  },

  /**
   * Upload a new research paper via PDF file or URL
   */
  async uploadPaper(fileOrUrl, onProgress) {
    const formData = new FormData();
    if (fileOrUrl instanceof File) {
      formData.append('paper', fileOrUrl);
    } else {
      const urlValue = typeof fileOrUrl === 'string' ? fileOrUrl : fileOrUrl.name || '';
      formData.append('url', urlValue);
    }

    const res = await apiClient.post('/papers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },

  /**
   * Delete a paper by id
   */
  async deletePaper(id) {
    const res = await apiClient.delete(`/papers/${id}`);
    return res.data;
  },

  /**
   * Helper to poll paper status until PROCESSING completes to READY or FAILED
   */
  async pollPaperStatus(id, onUpdate, maxAttempts = 25, intervalMs = 2000) {
    let attempts = 0;
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        attempts++;
        try {
          const paper = await this.getPaperById(id);
          if (onUpdate) onUpdate(paper);

          if (paper.status === 'READY' || paper.status === 'FAILED' || attempts >= maxAttempts) {
            clearInterval(interval);
            resolve(paper);
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, intervalMs);
    });
  },
};

export default paperService;
