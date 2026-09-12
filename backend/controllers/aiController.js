const mongoose = require('mongoose');
const Paper = require('../models/Paper');
const aiService = require('../services/aiService');

/**
 * @route   POST /api/ai/chat
 * @desc    RAG grounded chat endpoint for a specific paper
 * @access  Public
 */
const queryChat = async (req, res, next) => {
  try {
    const { paperId, query } = req.body;

    if (!paperId || !query) {
      return res.status(400).json({ message: 'Both paperId and query are required' });
    }

    // Retrieve paper to provide grounding context to AI service or fallback
    const paper = await Paper.findByIdOrCustomId(paperId);

    const aiResponse = await aiService.queryRAG(paperId, query, paper);

    // Optionally save chat history to paper document if DB is connected
    if (paper && mongoose.connection.readyState === 1) {
      const currentTime = aiResponse.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      paper.sampleChat.push(
        { sender: 'user', text: query, time: currentTime },
        {
          sender: 'ai',
          text: aiResponse.text,
          source: aiResponse.source,
          sourceId: aiResponse.sourceId,
          time: currentTime,
        }
      );
      await paper.save().catch((err) => {
        console.warn('[Chat History Warning] Could not persist message:', err.message);
      });
    }

    return res.json(aiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/summary
 * @desc    Generate or refresh paper summary
 * @access  Public
 */
const generateSummary = async (req, res, next) => {
  try {
    const { paperId, level } = req.body;
    if (!paperId) {
      return res.status(400).json({ message: 'paperId is required' });
    }

    const paper = await Paper.findByIdOrCustomId(paperId);
    const summaryData = await aiService.generateSummary(paperId, level, paper);

    return res.json(summaryData);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/quiz
 * @desc    Generate or refresh comprehension quiz questions
 * @access  Public
 */
const generateQuiz = async (req, res, next) => {
  try {
    const { paperId } = req.body;
    if (!paperId) {
      return res.status(400).json({ message: 'paperId is required' });
    }

    const paper = await Paper.findByIdOrCustomId(paperId);
    const quizzes = await aiService.generateQuiz(paperId, paper);

    return res.json({ quizzes });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/flashcards
 * @desc    Generate or refresh active recall flashcards
 * @access  Public
 */
const generateFlashcards = async (req, res, next) => {
  try {
    const { paperId } = req.body;
    if (!paperId) {
      return res.status(400).json({ message: 'paperId is required' });
    }

    const paper = await Paper.findByIdOrCustomId(paperId);
    const flashcards = await aiService.generateFlashcards(paperId, paper);

    return res.json({ flashcards });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  queryChat,
  generateSummary,
  generateQuiz,
  generateFlashcards,
};

