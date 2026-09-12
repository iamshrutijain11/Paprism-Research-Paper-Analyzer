const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema(
  {
    term: { type: String, default: '' },
    tag: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    page: { type: Number, default: 1 },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { _id: false }
);

const flashcardSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    q: { type: String, default: '' },
    a: { type: String, default: '' },
    ref: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Technical'],
      default: 'Medium',
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    question: { type: String, default: '' },
    options: { type: [String], default: [] },
    correct: { type: Number, default: 0 },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'ai'], default: 'user' },
    text: { type: String, default: '' },
    source: { type: String, default: '' },
    sourceId: { type: String, default: '' },
    time: { type: String, default: '' },
  },
  { _id: false }
);

const paperSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Paper title is required'],
      trim: true,
    },
    authors: {
      type: String,
      default: 'Unknown Authors',
      trim: true,
    },
    institution: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    venue: {
      type: String,
      default: '',
    },
    pages: {
      type: Number,
      default: 1,
    },
    fileSize: {
      type: String,
      default: '0 MB',
    },
    citations: {
      type: String,
      default: '0',
    },
    doi: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Computer Science',
    },
    readingTime: {
      type: String,
      default: '5 min simplified',
    },
    aiScore: {
      type: Number,
      default: 95,
    },
    status: {
      type: String,
      enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'],
      default: 'UPLOADING',
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    abstract: {
      type: String,
      default: '',
    },
    summaries: {
      tldr: { type: String, default: '' },
      beginner: { type: String, default: '' },
      intermediate: { type: String, default: '' },
      technical: { type: String, default: '' },
    },
    structuredSummary: {
      problem: { type: String, default: '' },
      approach: { type: String, default: '' },
      findings: { type: String, default: '' },
      limitations: { type: String, default: '' },
    },
    keywords: {
      type: [keywordSchema],
      default: [],
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    flashcards: {
      type: [flashcardSchema],
      default: [],
    },
    quizzes: {
      type: [quizSchema],
      default: [],
    },
    sampleChat: {
      type: [chatMessageSchema],
      default: [],
    },
    filePath: {
      type: String,
      default: '',
    },
    chromaCollectionId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || ret._id.toString();
        ret.uploadedAt = ret.uploadedAt ? new Date(ret.uploadedAt).toISOString() : new Date().toISOString();
        delete ret._id;
        delete ret.__v;
        delete ret.customId;
        delete ret.filePath;
        delete ret.chromaCollectionId;
        return ret;
      },
    },
  }
);

// Helper to query paper by customId or Mongo _id
paperSchema.statics.findByIdOrCustomId = async function (identifier) {
  if (!identifier) return null;
  if (mongoose.connection.readyState !== 1) {
    return null;
  }
  try {
    if (mongoose.isValidObjectId(identifier)) {
      const doc = await this.findOne({
        $or: [{ _id: identifier }, { customId: identifier }],
      });
      if (doc) return doc;
    }
    return await this.findOne({ customId: identifier });
  } catch (err) {
    console.warn('[Paper Query Warning]:', err.message);
    return null;
  }
};

const Paper = mongoose.model('Paper', paperSchema);

module.exports = Paper;
