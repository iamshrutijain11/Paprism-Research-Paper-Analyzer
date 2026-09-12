/**
 * Byte AI Assistant Service
 * Intelligent conversational RAG agent with personality, paper intelligence,
 * multi-level explanations, interactive quiz generation, and voice capabilities.
 */

export const BYTE_PERSONAS = {
  ELI5: {
    id: 'ELI5',
    name: 'ELI5 Buddy',
    icon: '🐣',
    tagline: 'Simple analogies & fun explanations',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  SCHOLAR: {
    id: 'SCHOLAR',
    name: 'Professor Byte',
    icon: '🎓',
    tagline: 'Rigorous math & academic citations',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  SPEED: {
    id: 'SPEED',
    name: 'TL;DR Bullet',
    icon: '⚡',
    tagline: 'Instant high-impact takeaways',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  QUIZ: {
    id: 'QUIZ',
    name: 'Quiz Master',
    icon: '🎯',
    tagline: 'Tests your comprehension with live questions',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
};

export const DEFAULT_BYTE_GREETING = {
  id: 'byte-welcome-1',
  sender: 'byte',
  text: `Hi there! I'm **Byte** ✦, your interactive research companion!

I can help you read, simplify, and master research papers. 

Here are some things we can do together:
- ⚡ **TL;DR summaries** at beginner or technical levels
- 🔍 **Explain complex math & formulas** (like Softmax Attention)
- 🎯 **Test you with interactive quizzes** right here in chat
- 🗺️ **Navigate Paprism** (Workspace, Flashcards, Summaries)

What are you researching today?`,
  mood: 'happy',
  time: 'Just now',
  suggestions: [
    'Explain active paper simply',
    'What is Attention(Q,K,V)?',
    'Quiz me on this paper!',
    'How do I use the 3-Column Workspace?'
  ]
};

// Knowledge base and response synthesis for Byte
export const generateByteResponse = async ({
  query,
  activePaper,
  persona = 'ELI5',
  user = {},
  currentPage = 'dashboard',
  history = []
}) => {
  // Simulate network thinking latency
  await new Promise(resolve => setTimeout(resolve, 650));

  const q = (query || '').toLowerCase().trim();
  const title = activePaper?.title || 'Attention Is All You Need';
  const category = activePaper?.category || 'Machine Learning';

  // Check for Quiz request
  if (q.includes('quiz') || q.includes('test me') || persona === 'QUIZ') {
    if (activePaper?.quizzes && activePaper.quizzes.length > 0) {
      const randomQuiz = activePaper.quizzes[Math.floor(Math.random() * activePaper.quizzes.length)];
      return {
        text: `Here is a quick knowledge check on **${title}**! Let's see how well you know the core concepts:`,
        mood: 'scholar',
        quiz: {
          id: randomQuiz.id || `quiz-${Date.now()}`,
          question: randomQuiz.question,
          options: randomQuiz.options,
          correct: randomQuiz.correct,
          explanation: randomQuiz.explanation
        },
        suggestions: [
          'Give me another quiz question',
          'Explain why this answer is correct',
          'Show flashcards for this paper'
        ]
      };
    } else {
      return {
        text: `Here's a comprehension challenge for **${title}**:\n\n**Question:** Why does the Transformer discard recurrence (RNNs) in favor of Self-Attention?\n\nA) To use less memory on GPUs\nB) To allow full parallel computation across all sequence tokens simultaneously\nC) Because RNNs cannot process English\nD) To reduce model parameters to zero\n\n*Choose an option below to test yourself!*`,
        mood: 'scholar',
        quiz: {
          id: `quiz-gen-${Date.now()}`,
          question: `Why does the Transformer discard recurrence in favor of Self-Attention?`,
          options: [
            'To use less memory on mobile devices',
            'To allow parallel token computation across the entire sequence',
            'Because RNNs cannot handle numbers',
            'To eliminate all neural weights'
          ],
          correct: 1,
          explanation: 'Recurrent networks are sequential (step t depends on t-1), preventing parallel training. Self-Attention computes all token relationships in parallel on GPUs!'
        },
        suggestions: [
          'Explain the math formula',
          'Give me another question',
          'Summarize in 3 bullet points'
        ]
      };
    }
  }

  // Check for Flashcards request
  if (q.includes('flashcard') || q.includes('cards') || q.includes('study cards')) {
    const fcs = activePaper?.flashcards || [
      {
        q: 'What is Scaled Dot-Product Attention?',
        a: 'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V',
        ref: 'Page 3, Section 3.2',
        difficulty: 'Medium'
      },
      {
        q: 'What is the purpose of Positional Encodings?',
        a: 'Injected sinusoidal frequencies that tell the model the order of words without recurrence.',
        ref: 'Page 4, Section 3.5',
        difficulty: 'Easy'
      }
    ];

    return {
      text: `I've prepared study flashcards extracted directly from **${title}**! You can also view the full deck on the [Flashcards page](/flashcards).`,
      mood: 'excited',
      flashcards: fcs,
      action: {
        label: 'Open Full Flashcard Deck',
        path: '/flashcards'
      },
      suggestions: [
        'Quiz me on these flashcards',
        'Explain Attention simply',
        'Show paper summary'
      ]
    };
  }

  // Check for Navigation or Platform Help
  if (q.includes('workspace') || q.includes('3-column') || q.includes('reader')) {
    return {
      text: `The **Paprism 3-Column Workspace** is our flagship research interface:\n\n1. 📑 **Left:** Full PDF Original Document with deep vector highlighting\n2. ✦ **Center:** Multi-level AI Editorial breakdowns & Key Concepts\n3. 💬 **Right:** Vector-grounded RAG Assistant with exact citation links\n\nWould you like me to open the workspace for **${title}** right now?`,
      mood: 'happy',
      action: {
        label: 'Launch 3-Column Workspace',
        path: `/workspace/${activePaper?.id || 'attention-is-all-you-need'}`
      },
      suggestions: [
        'Take me to Workspace',
        'Explain the active paper',
        'Show me summaries'
      ]
    };
  }

  if (q.includes('how to use') || q.includes('help') || q.includes('paprism') || q.includes('navigate') || q.includes('upload')) {
    return {
      text: `Here's a quick tour of what you can do on **Paprism**:\n\n- 📥 **Upload PDF:** Drag & drop any arXiv or research PDF from the Dashboard\n- 👓 **3-Col Workspace:** Read papers side-by-side with AI simplification\n- 📝 **Summary & Insights:** Toggle between Beginner, Intermediate, and Scholar levels\n- 🗂️ **Flashcards & Quizzes:** Spaced repetition and active recall tools\n- 💬 **Byte Chat:** I am always here in the corner ready to answer questions or quiz you!`,
      mood: 'happy',
      suggestions: [
        'Take me to Dashboard',
        'Explain active paper',
        'Quiz me on machine learning'
      ]
    };
  }

  // Check for Attention / Transformer / Math questions
  if (q.includes('attention') || q.includes('transformer') || q.includes('qkv') || q.includes('query') || q.includes('formula') || q.includes('math')) {
    if (persona === 'ELI5') {
      return {
        text: `Imagine you're at a loud cafeteria and trying to listen to your best friend's story.\n\nYour brain uses **"Self-Attention"**:\n- 🎯 **Query (Q):** What you're searching for (*"friend's voice"*)\n- 🏷️ **Key (K):** Labels on all ambient sounds (*"clinking forks", "loud laugh", "friend speaking"*)\n- 📦 **Value (V):** The actual sound content\n\nThe AI compares your **Query** with all **Keys**, finds the highest match (your friend), and turns up that **Value** while tuning out the rest!`,
        mood: 'excited',
        source: 'Section 3.2, Page 3',
        suggestions: [
          'Show me the mathematical formula',
          'Why is it divided by sqrt(d_k)?',
          'Quiz me on Attention!'
        ]
      };
    } else if (persona === 'SCHOLAR') {
      return {
        text: `In **"${title}"**, Scaled Dot-Product Attention is formalized as:\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n**Mechanics:**\n1. **Compatibility Matrix:** $QK^T$ computes pairwise cosine similarities of dimensionality $d_k$.\n2. **Gradient Scaling:** Scaling by $\\frac{1}{\\sqrt{d_k}}$ prevents the dot products from growing excessively large for large dimensions, which would otherwise push softmax into regions with vanishingly small gradients.\n3. **Multi-Head Projection:** Linear projections into $h=8$ parallel subspaces allow joint modeling of syntactic and semantic dependencies.`,
        mood: 'scholar',
        source: 'Section 3.2, Eq. 1',
        suggestions: [
          'Explain Multi-Head Attention',
          'What are Positional Encodings?',
          'Generate a Quiz question on this'
        ]
      };
    } else if (persona === 'SPEED') {
      return {
        text: `⚡ **Attention in 30 Seconds:**\n\n• **Formula:** $\\text{softmax}(QK^T / \\sqrt{d_k})V$\n• **Why it matters:** Computes all token-to-token connections simultaneously instead of step-by-step.\n• **Key Win:** 10x faster training on GPUs + no degradation over long sentences.`,
        mood: 'happy',
        source: 'Section 3, Page 3',
        suggestions: [
          'Explain Positional Encodings',
          'Give me a quick quiz',
          'Open 3-Column Workspace'
        ]
      };
    }
  }

  // Check for Summary requests
  if (q.includes('summary') || q.includes('summarize') || q.includes('explain') || q.includes('tldr') || q.includes('about')) {
    if (persona === 'ELI5') {
      return {
        text: `🌟 **Simplified Breakdown of "${title}":**\n\n${activePaper?.summaries?.beginner || 'This paper replaces slow word-by-word reading with a powerful parallel attention network that connects all parts of a document at once.'}\n\n💡 **Key Takeaway:** It is the foundational architecture powering ChatGPT, Claude, Gemini, and modern AI!`,
        mood: 'happy',
        source: 'Executive Summary & Introduction',
        action: {
          label: 'View Multi-Level Summaries',
          path: '/summary'
        },
        suggestions: [
          'Explain the math formula',
          'What are the limitations?',
          'Quiz me on this paper'
        ]
      };
    } else if (persona === 'SCHOLAR') {
      return {
        text: `📚 **Academic Abstract & Synthesis for "${title}":**\n\n${activePaper?.summaries?.technical || activePaper?.abstract || 'The paper introduces a sequence transduction architecture solely based on attention mechanisms.'}\n\n**Structured Assessment:**\n- **Problem:** ${activePaper?.structuredSummary?.problem || 'Recurrent sequential computation bottleneck.'}\n- **Method:** ${activePaper?.structuredSummary?.approach || 'Stacked 6-layer encoder/decoder with multi-head self-attention.'}\n- **Metric:** ${activePaper?.structuredSummary?.findings || 'State-of-the-art BLEU scores on machine translation benchmarks.'}`,
        mood: 'scholar',
        source: 'Section 1 & 5',
        suggestions: [
          'Show paper limitations',
          'Compare with RNNs/LSTMs',
          'Generate study flashcards'
        ]
      };
    } else {
      return {
        text: `⚡ **Executive Summary:**\n\n${activePaper?.summaries?.tldr || 'Replaces recurrent neural networks with pure self-attention mechanisms, allowing full GPU parallelization.'}\n\n• **Category:** ${category}\n• **Key Metric:** 28.4 BLEU (EN-DE), 41.0 BLEU (EN-FR)\n• **Impact:** Underpins all modern Large Language Models.`,
        mood: 'happy',
        source: 'Executive Brief',
        suggestions: [
          'Explain in simple terms',
          'Quiz me on this paper',
          'Open in Workspace'
        ]
      };
    }
  }

  // Check for Fun / Personality / Greetings
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
    return {
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'friend'}! ✨ I'm **Byte**, your AI co-pilot on Paprism.\n\nI'm currently connected to **"${title}"**. What would you like to explore together?`,
      mood: 'happy',
      suggestions: [
        'Explain this paper in simple terms',
        'Quiz me on key concepts',
        'Show me the 3-Column Workspace',
        'Tell me a science joke!'
      ]
    };
  }

  if (q.includes('joke') || q.includes('funny') || q.includes('humor')) {
    const jokes = [
      "Why did the neural network go to therapy? Because it had too many unresolved weights and couldn't handle the gradient descent!",
      "Why do Transformers make terrible secret keepers? Because their attention is all you need!",
      "Why did the machine learning model break up with the dataset? There was zero correlation and too much bias!",
      "There are 10 types of people in the world: Those who understand binary, and those who don't."
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      text: `😄 Here you go:\n\n> *"${joke}"*\n\nNeed any research concepts simplified now?`,
      mood: 'happy',
      suggestions: [
        'Explain Self-Attention',
        'Quiz me on Transformers',
        'Tell me another joke'
      ]
    };
  }

  // Default intelligent contextual fallback
  return {
    text: `Regarding **"${title}"**:\n\nBased on the indexed document text, ${activePaper?.summaries?.intermediate || activePaper?.abstract || 'this paper introduces a novel architecture that optimizes deep learning representation learning.'}\n\nIs there a specific section, theorem, or term you'd like me to unpack in greater detail?`,
    mood: 'happy',
    source: 'Indexed Document Vector Index',
    suggestions: [
      'Explain this simply (ELI5)',
      'What are the key findings?',
      'Quiz me on this topic',
      'Generate flashcards'
    ]
  };
};

/**
 * Text-to-Speech Web Speech API utility
 */
export const speakWithByte = (text, onEnd) => {
  if (!('speechSynthesis' in window)) return null;

  // Clean markdown for smoother audio synthesis
  const cleanText = text
    .replace(/[*#`$\-_~[\]()]/g, ' ')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
    .replace(/\s+/g, ' ')
    .trim();

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05;
  utterance.pitch = 1.1; // Friendly slightly higher pitch for Byte

  // Try to pick a natural friendly English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Jenny'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopByteSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
