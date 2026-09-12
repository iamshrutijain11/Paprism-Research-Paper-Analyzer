const express = require('express');
const router = express.Router();
const {
  queryChat,
  generateSummary,
  generateQuiz,
  generateFlashcards,
} = require('../controllers/aiController');

// Grounded RAG Chat endpoint
router.post('/chat', queryChat);

// Summary generation / refresh endpoint
router.post('/summary', generateSummary);

// Quiz generation / refresh endpoint
router.post('/quiz', generateQuiz);

// Flashcards generation / refresh endpoint
router.post('/flashcards', generateFlashcards);

module.exports = router;

