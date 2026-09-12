const fs = require('fs');
const path = require('path');
const Paper = require('../models/Paper');
const User = require('../models/User');
const aiService = require('../services/aiService');

/**
 * @route   GET /api/papers
 * @desc    Get all papers belonging to current user and public demo papers
 * @access  Private / Optional Public
 */
const getPapers = async (req, res, next) => {
  try {
    let query = {};
    if (req.user) {
      // Return user's uploaded papers and public demo papers
      query = {
        $or: [{ ownerId: req.user._id }, { ownerId: null }],
      };
    } else {
      // Unauthenticated fallback returns public papers
      query = { ownerId: null };
    }

    const papers = await Paper.find(query).sort({ createdAt: -1 });
    return res.json(papers.map((p) => p.toJSON()));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/papers/:id
 * @desc    Get a single paper by ID or customId
 * @access  Public
 */
const getPaperById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paper = await Paper.findByIdOrCustomId(id);

    if (!paper) {
      return res.status(404).json({ message: `Paper with ID "${id}" not found` });
    }

    return res.json(paper.toJSON());
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/papers/upload
 * @desc    Upload a new research paper (PDF or URL)
 * @access  Public / Private
 */
const uploadPaper = async (req, res, next) => {
  try {
    const file = req.file;
    const url = req.body.url;

    if (!file && !url) {
      return res.status(400).json({ message: 'Please provide either a PDF file (field "paper") or a valid URL (field "url")' });
    }

    let filePath = '';
    let title = 'Uploaded Research Document';
    let fileSize = '1.0 MB';

    if (file) {
      filePath = file.path;
      const originalName = file.originalname || 'document.pdf';
      title = originalName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    } else if (url) {
      title = url.split('/').pop().replace(/\.pdf$/i, '') || 'URL Research Document';
      filePath = url;
    }

    const customId = `paper-${Date.now()}`;

    // 1. Create Paper doc with status: "UPLOADING"
    const newPaper = new Paper({
      customId,
      ownerId: req.user ? req.user._id : null,
      title,
      authors: 'Pending Analysis...',
      institution: '',
      year: new Date().getFullYear().toString(),
      venue: 'Uploaded Paper',
      pages: 1,
      fileSize,
      citations: '0',
      doi: '',
      category: 'General Science',
      readingTime: 'Analyzing...',
      aiScore: 90,
      status: 'UPLOADING',
      uploadedAt: new Date(),
      abstract: 'Document uploaded. AI microservice is currently analyzing and processing the paper...',
      summaries: {
        tldr: 'Processing document...',
        beginner: 'Processing document...',
        intermediate: 'Processing document...',
        technical: 'Processing document...',
      },
      structuredSummary: {
        problem: 'Analyzing...',
        approach: 'Analyzing...',
        findings: 'Analyzing...',
        limitations: 'Analyzing...',
      },
      keywords: [],
      sections: [],
      flashcards: [],
      quizzes: [],
      sampleChat: [],
      filePath,
    });

    await newPaper.save();

    // Increment user simplified papers count if user is authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { papersSimplified: 1 },
      });
    }

    // 2. Kick off async AI processing in the background (does not block response)
    aiService
      .processPaperAsync(newPaper._id.toString(), filePath, {
        title,
        fileSize,
      })
      .catch((err) => {
        console.error(`[Background Processing Error] Paper ${newPaper._id}:`, err);
      });

    // 3. Return created paper immediately with id & status
    return res.status(201).json(newPaper.toJSON());
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/papers/:id
 * @desc    Delete a paper and remove its local file
 * @access  Private / Public
 */
const deletePaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paper = await Paper.findByIdOrCustomId(id);

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // If paper has a local file on disk, remove it safely
    if (paper.filePath && fs.existsSync(paper.filePath)) {
      try {
        fs.unlinkSync(paper.filePath);
      } catch (fileErr) {
        console.warn(`[File Delete Warning] Could not remove file ${paper.filePath}:`, fileErr.message);
      }
    }

    await Paper.deleteOne({ _id: paper._id });

    return res.json({ message: 'Paper deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPapers,
  getPaperById,
  uploadPaper,
  deletePaper,
};
