const express = require('express');
const router = express.Router();
const {
  getPapers,
  getPaperById,
  uploadPaper,
  deletePaper,
} = require('../controllers/paperController');
const { optionalAuthMiddleware, authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all papers (authenticated user gets their papers + public papers; guests get public papers)
router.get('/', optionalAuthMiddleware, getPapers);

// Get single paper by ID or customId
router.get('/:id', getPaperById);

// Upload a new paper via multipart/form-data (field 'paper') or json/url (field 'url')
router.post('/upload', optionalAuthMiddleware, upload.single('paper'), uploadPaper);

// Delete paper
router.delete('/:id', optionalAuthMiddleware, deletePaper);

module.exports = router;
