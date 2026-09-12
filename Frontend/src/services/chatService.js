import apiClient from './apiClient';

export const chatService = {
  /**
   * Submit grounded RAG question to the backend for a specific paper
   */
  async queryPaperRAG(paperId, query) {
    const res = await apiClient.post('/ai/chat', {
      paperId,
      query,
    });
    return res.data;
  },
};

export default chatService;
