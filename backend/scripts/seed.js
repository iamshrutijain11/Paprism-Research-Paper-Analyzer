require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Paper = require('../models/Paper');

const SEED_PAPERS = [
  {
    customId: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    institution: 'Google Brain & Google Research',
    year: '2017',
    venue: 'NeurIPS 2017',
    pages: 15,
    fileSize: '2.4 MB',
    citations: '138,420+',
    doi: '10.48550/arXiv.1706.03762',
    category: 'Machine Learning',
    readingTime: '6 min simplified',
    aiScore: 99,
    status: 'READY',
    uploadedAt: new Date('2024-03-10T10:30:00Z'),
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    summaries: {
      tldr: 'Traditional AI read sentences word-by-word, which was slow and forgot context. The Transformer looks at all words at once using "Self-Attention", computing relationships simultaneously. It powers all modern LLMs.',
      beginner: 'Think of traditional language AI like someone reading a book through a tiny keyhole—only one word at a time. It easily forgets what happened at the start of a long sentence. This paper created the "Transformer". Instead of a keyhole, it takes a high-resolution photo of the whole page at once. It connects every word to every other word simultaneously using "Self-Attention", enabling lightning-fast processing and deep comprehension.',
      intermediate: 'Recurrent Neural Networks (RNNs and LSTMs) suffer from sequential computation bottlenecks where step t depends on hidden state h_{t-1}, making GPU parallelization impossible. The Transformer discards recurrence entirely. By leveraging Multi-Head Scaled Dot-Product Attention, it maps queries, keys, and values across multiple representation subspaces in parallel, slashing training time from weeks to hours.',
      technical: 'The Transformer adheres to an auto-regressive encoder-decoder paradigm constructed from stacked Multi-Head Attention and point-wise Feed-Forward Networks. Scaled Dot-Product Attention is formulated as Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V, where the sqrt(d_k) factor counteracts vanishing softmax gradients at high dimensions. Positional sinusoids inject sequence ordering without recurrence.',
    },
    structuredSummary: {
      problem: 'Recurrent sequence models (RNNs/LSTMs) enforce sequential computation along token positions, preventing parallelization during training and degrading long-range temporal dependencies.',
      approach: 'A pure attention-based feed-forward architecture comprising a 6-layer encoder and 6-layer decoder with 8 parallel attention heads and sinusoidal positional encodings.',
      findings: 'Achieved state-of-the-art 28.4 BLEU on WMT 2014 English-to-German and 41.0 BLEU on English-to-French translation with significantly lower training FLOPS.',
      limitations: 'Quadratic computational and memory complexity O(n^2) with respect to input sequence length n, requiring specialized sparse attention for very long contexts.',
    },
    keywords: [
      { term: 'Self-Attention', tag: 'Core Mechanism', desc: 'Relates different positions of a single sequence to compute representation.' },
      { term: 'Multi-Head Attention', tag: 'Architecture', desc: 'Runs attention across h projected subspaces concurrently.' },
      { term: 'Positional Encoding', tag: 'Data Pipeline', desc: 'Sinusoidal frequencies injecting positional order into embeddings.' },
      { term: 'Feed-Forward Network', tag: 'Layer', desc: 'Point-wise fully connected transformations applied identically across positions.' },
      { term: 'BLEU Score', tag: 'Metric', desc: 'Bilingual Evaluation Understudy metric assessing machine translation quality.' },
    ],
    sections: [
      {
        id: 'sec-abstract',
        page: 1,
        title: 'Abstract',
        content: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.`,
      },
      {
        id: 'sec-intro',
        page: 1,
        title: '1. Introduction',
        content: `Recurrent neural networks, particularly Long Short-Term Memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state-of-the-art approaches in sequence modeling and transduction problems such as language modeling and machine translation.

Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths.`,
      },
      {
        id: 'sec-model',
        page: 3,
        title: '3. Model Architecture',
        content: `Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.`,
      },
      {
        id: 'sec-attention',
        page: 3,
        title: '3.2 Attention & Multi-Head Mechanism',
        content: `An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values:
Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V

Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different learned linear projections to d_k, d_k and d_v dimensions. On each of these projected versions we perform the attention function in parallel, yielding d_v-dimensional output values.`,
      },
      {
        id: 'sec-results',
        page: 5,
        title: '5. Results & Benchmark Evaluation',
        content: `On the WMT 2014 English-to-German translation task, the big transformer model achieves a state-of-the-art BLEU score of 28.4, outperforming the best existing models and ensembles by over 2.0 BLEU. On the WMT 2014 English-to-French task, our big model achieves a BLEU score of 41.0, outperforming all previously published single models.`,
      },
    ],
    flashcards: [
      {
        id: 'fc-1',
        q: 'What is the primary computational bottleneck of RNNs solved by Transformers?',
        a: 'Sequential token processing where hidden state h_t depends on h_{t-1}, preventing GPU parallelization during training.',
        ref: 'Page 1, Section 1',
        difficulty: 'Medium',
      },
      {
        id: 'fc-2',
        q: 'What is the mathematical formulation of Scaled Dot-Product Attention?',
        a: 'Attention(Q, K, V) = softmax( (Q · Kᵀ) / √d_k ) · V',
        ref: 'Page 3, Section 3.2',
        difficulty: 'Technical',
      },
      {
        id: 'fc-3',
        q: 'Why are queries and keys scaled by 1/√d_k?',
        a: 'To prevent large dot products from pushing the softmax function into regions with extremely small gradients.',
        ref: 'Page 4, Equation 1',
        difficulty: 'Hard',
      },
      {
        id: 'fc-4',
        q: 'How does the Transformer represent word order without recurrence?',
        a: 'Using Positional Encodings (sinusoidal frequencies) added directly to the input embeddings.',
        ref: 'Page 6, Section 3.5',
        difficulty: 'Easy',
      },
    ],
    quizzes: [
      {
        id: 'qz-1',
        question: 'Why did the authors replace recurrence with self-attention in the Transformer?',
        options: [
          'To reduce floating-point parameter precision',
          'To eliminate sequential computation and enable full parallelization across GPUs',
          'To eliminate the need for matrix multiplications',
          'To make the network purely convolutional',
        ],
        correct: 1,
        explanation: 'Recurrent models cannot parallelize training because step t requires step t-1. Self-attention computes all pairs simultaneously.',
      },
      {
        id: 'qz-2',
        question: 'In Scaled Dot-Product Attention, what role does the scaling factor 1/√d_k play?',
        options: [
          'Reduces vector dimensions to save GPU VRAM',
          'Stabilizes softmax gradients by preventing extremely large dot products',
          'Converts discrete tokens into continuous logits',
          'Enforces causality in the encoder',
        ],
        correct: 1,
        explanation: 'At large dimensions d_k, dot products grow large in magnitude, pushing softmax into flat gradient regions.',
      },
      {
        id: 'qz-3',
        question: 'What benchmark score did the Transformer achieve on English-to-German translation?',
        options: [
          '18.2 BLEU',
          '28.4 BLEU (New SOTA)',
          '54.0 BLEU',
          '89.1 Accuracy',
        ],
        correct: 1,
        explanation: 'The big Transformer established a new state-of-the-art BLEU score of 28.4 on the WMT 2014 English-to-German task.',
      },
    ],
    sampleChat: [
      {
        sender: 'user',
        text: 'Can you explain why Multi-Head Attention is better than single attention?',
        time: '10:42 AM',
      },
      {
        sender: 'ai',
        text: 'Multi-Head Attention linearly projects queries, keys, and values into **h different subspaces** (8 in the paper). \n\nInstead of averaging all relationships into one blurred score, each head focuses on different semantic aspects—for example, one head tracks grammatical agreement, another tracks pronoun antecedents, and another tracks spatial context.',
        source: 'Page 3, Section 3.2 (Attention Mechanism)',
        sourceId: 'sec-attention',
        time: '10:42 AM',
      },
    ],
  },
  {
    customId: 'deep-residual-learning',
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
    institution: 'Microsoft Research',
    year: '2015',
    venue: 'CVPR 2016 (Best Paper)',
    pages: 12,
    fileSize: '1.8 MB',
    citations: '192,500+',
    doi: '10.1109/CVPR.2016.90',
    category: 'Computer Vision',
    readingTime: '5 min simplified',
    aiScore: 98,
    status: 'READY',
    uploadedAt: new Date('2024-03-08T14:15:00Z'),
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
    summaries: {
      tldr: 'Before ResNet, stacking more than 20 layers caused accuracy to plummet. He et al. introduced Skip Connections (F(x) + x), allowing networks to scale up to 152 layers.',
      beginner: 'Imagine playing the game of telephone with 100 people—by the end, the message is completely lost (vanishing gradient). ResNet adds "express elevators" (skip connections) that let the original message travel straight to the end untouched. This allowed neural networks to grow from 20 layers to 152+ layers without breaking down.',
      intermediate: 'As network depth increases, accuracy saturates and degrades rapidly due to vanishing/exploding gradients. ResNet addresses this by letting layers learn a residual mapping F(x) = H(x) - x, recasting the output as F(x) + x. Identity shortcuts introduce zero parameter overhead while maintaining smooth gradient backpropagation.',
      technical: 'ResNet reformulates deep representations through residual building blocks: y = F(x, {W_i}) + W_s x. Gradient flow satisfies dE/dx = (dE/dy)(dF/dx + 1), where the additive identity term ensures gradients flow directly back to initial layers regardless of network depth.',
    },
    structuredSummary: {
      problem: 'The degradation problem: deep plain networks experience substantially higher training error despite batch normalization, failing to learn identity mappings.',
      approach: 'Shortcut connections that perform identity mapping, skipping 2-3 convolutional layers and adding directly to their output.',
      findings: 'Won ImageNet 2015 with 3.57% top-5 error using a 152-layer ensemble, surpassing human-level recognition benchmarks.',
      limitations: 'Extremely deep ResNets suffer diminishing returns per layer and increased memory consumption during training forward passes.',
    },
    keywords: [
      { term: 'Skip Connection', tag: 'Architecture', desc: 'Identity shortcut bypassing weight layers.' },
      { term: 'Residual Mapping', tag: 'Formulation', desc: 'Learning F(x) := H(x) - x instead of direct mapping H(x).' },
      { term: 'Vanishing Gradient', tag: 'Problem', desc: 'Exponential decay of gradient signal across deep sequential layers.' },
      { term: 'Bottleneck Block', tag: 'Efficiency', desc: '1x1, 3x3, and 1x1 convolutions reducing parameter footprint in deep variants.' },
    ],
    sections: [
      {
        id: 'sec-resnet-abstract',
        page: 1,
        title: 'Abstract',
        content: `Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously.`,
      },
      {
        id: 'sec-resnet-core',
        page: 2,
        title: '2. Residual Mapping Concept',
        content: `Instead of hoping each few stacked layers directly fit a desired underlying mapping H(x), we explicitly let these layers fit a residual mapping F(x) := H(x) - x. The original mapping is recast into F(x) + x. We hypothesize that it is easier to optimize the residual mapping than to optimize the original, unreferenced mapping.`,
      },
    ],
    flashcards: [
      {
        id: 'fc-res-1',
        q: 'What is the residual learning formulation?',
        a: 'Recasting the target mapping H(x) into F(x) + x, where layers fit F(x) := H(x) - x.',
        ref: 'Page 2, Section 2',
        difficulty: 'Medium',
      },
    ],
    quizzes: [
      {
        id: 'qz-res-1',
        question: 'What happens to the parameter count when using standard identity skip connections in ResNet?',
        options: [
          'Parameters double',
          'Zero additional parameters are added',
          'Parameters increase by 50%',
          'Requires separate GPU tensors',
        ],
        correct: 1,
        explanation: 'Identity shortcut connections perform direct addition (F(x) + x) and introduce zero extra parameters or computational complexity.',
      },
    ],
    sampleChat: [
      {
        sender: 'user',
        text: 'What was the main breakthrough of ResNet in 2015?',
        time: '11:15 AM',
      },
      {
        sender: 'ai',
        text: 'ResNet proved that neural networks could successfully scale to **152 layers** without degradation, winning ImageNet 2015 with a record **3.57% error rate**—outperforming human benchmark classifiers for the first time in history.',
        source: 'Page 1, Abstract & Section 4',
        sourceId: 'sec-resnet-abstract',
        time: '11:15 AM',
      },
    ],
  },
  {
    customId: 'bert-pre-training',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    institution: 'Google AI Language',
    year: '2018',
    venue: 'NAACL-HLT 2019',
    pages: 16,
    fileSize: '3.1 MB',
    citations: '94,200+',
    doi: '10.48550/arXiv.1810.04805',
    category: 'Natural Language Processing',
    readingTime: '5 min simplified',
    aiScore: 97,
    status: 'READY',
    uploadedAt: new Date('2024-03-05T09:00:00Z'),
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    summaries: {
      tldr: 'Before BERT, models read text only left-to-right. BERT introduced Masked Language Modeling (MLM), hiding 15% of words to learn bidirectional context.',
      beginner: 'Imagine playing a fill-in-the-blank game: "The [BLANK] jumped over the lazy dog." To guess "fox", you look at words BEFORE and AFTER the blank simultaneously. BERT was the first AI model trained this way on millions of Wikipedia articles.',
      intermediate: 'Standard language models are unidirectional, constraining context flow (e.g. GPT-1). BERT utilizes the Transformer encoder with Masked Language Modeling (MLM) and Next Sentence Prediction (NSP) objectives, allowing representations to fuse both left and right context concurrently across 24 layers.',
      technical: 'BERT pre-trains on BooksCorpus and English Wikipedia with a unified architecture across downstream tasks. Fine-tuning is initialized with pre-trained parameters and all parameters are fine-tuned using task-specific labeled datasets with minimal task-specific architectural modification.',
    },
    structuredSummary: {
      problem: 'Unidirectional architectures restrict contextual representation power, severely impacting sentence-level and token-level tasks like SQuAD QA.',
      approach: 'Masked Language Model (MLM) randomly replacing 15% of tokens with [MASK] and Next Sentence Prediction (NSP) for cross-sentence relationships.',
      findings: 'Obtained state-of-the-art results on 11 NLP tasks, including pushing GLUE score to 80.5% and SQuAD v1.1 F1 score to 93.2.',
      limitations: 'Pre-train / fine-tune mismatch from [MASK] tokens not appearing during inference, addressed via an 80/10/10 token replacement strategy.',
    },
    keywords: [
      { term: 'Masked Language Model', tag: 'Pre-training', desc: 'Predicting masked tokens using bidirectional sentence context.' },
      { term: 'Next Sentence Prediction', tag: 'Objective', desc: 'Binary classification whether sentence B logically follows sentence A.' },
      { term: 'Transformer Encoder', tag: 'Backbone', desc: 'Stack of bi-directional self-attention transformer blocks.' },
    ],
    sections: [
      {
        id: 'sec-bert-abstract',
        page: 1,
        title: 'Abstract',
        content: `BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.`,
      },
    ],
    flashcards: [
      {
        id: 'fc-bert-1',
        q: 'What is Masked Language Modeling (MLM)?',
        a: 'Randomly masking 15% of input tokens and predicting them using both left and right context simultaneously.',
        ref: 'Page 3, Section 3.1',
        difficulty: 'Easy',
      },
    ],
    quizzes: [
      {
        id: 'qz-bert-1',
        question: 'What percentage of tokens are selected for masking during BERT pre-training?',
        options: ['5%', '15%', '30%', '50%'],
        correct: 1,
        explanation: 'BERT randomly selects 15% of all token positions for the Masked LM pre-training objective.',
      },
    ],
    sampleChat: [
      {
        sender: 'user',
        text: 'How does BERT handle fine-tuning for downstream tasks?',
        time: '02:30 PM',
      },
      {
        sender: 'ai',
        text: 'BERT uses the exact same pre-trained architecture for downstream tasks—simply swapping the top layer with a classification head and fine-tuning end-to-end on task data.',
        source: 'Page 4, Section 4 (Fine-Tuning)',
        sourceId: 'sec-bert-abstract',
        time: '02:30 PM',
      },
    ],
  },
];

async function seed() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/paprism';
  console.log(`[Seed] Connecting to ${mongoURI}...`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');

    // 1. Create or ensure Demo User exists
    let demoUser = await User.findOne({ email: 'elena.vance@university.edu' });
    if (!demoUser) {
      demoUser = new User({
        name: 'Dr. Elena Vance',
        email: 'elena.vance@university.edu',
        passwordHash: 'Password123!',
        role: 'ML Research Fellow',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        papersSimplified: 48,
        readingTimeSaved: '14.2 hrs',
      });
      await demoUser.save();
      console.log(`[Seed] Created demo user: ${demoUser.email} (Password: Password123!)`);
    } else {
      console.log(`[Seed] Demo user exists: ${demoUser.email}`);
    }

    // 2. Upsert initial papers
    for (const paperData of SEED_PAPERS) {
      const existing = await Paper.findOne({ customId: paperData.customId });
      if (!existing) {
        await Paper.create({
          ...paperData,
          ownerId: null, // Public demo paper
        });
        console.log(`[Seed] Inserted paper: "${paperData.title}" (${paperData.customId})`);
      } else {
        console.log(`[Seed] Paper already exists: "${paperData.title}"`);
      }
    }

    console.log('[Seed] Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
