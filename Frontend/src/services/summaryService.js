import apiClient from './apiClient';

export const summaryService = {
  /**
   * Request multi-level summary generation / refresh for a paper
   */
  async generateSummary(paperId, level = 'all') {
    const res = await apiClient.post('/ai/summary', {
      paperId,
      level,
    });
    return res.data;
  },
};

export default summaryService;
