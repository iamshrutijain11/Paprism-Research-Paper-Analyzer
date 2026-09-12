import apiClient from './apiClient';

export const quizService = {
  /**
   * Request quiz generation / refresh for a paper
   */
  async generateQuiz(paperId) {
    const res = await apiClient.post('/ai/quiz', { paperId });
    return res.data?.quizzes || [];
  },

  /**
   * Request flashcards generation / refresh for a paper
   */
  async generateFlashcards(paperId) {
    const res = await apiClient.post('/ai/flashcards', { paperId });
    return res.data?.flashcards || [];
  },
};

export default quizService;
