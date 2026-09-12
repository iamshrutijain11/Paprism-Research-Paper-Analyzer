const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Paper = require('../models/Paper');
const aiService = require('../services/aiService');

async function runTests() {
  console.log('\n--- Starting Contract & Unit Verification Suite ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check endpoint test
    const healthRes = await request(app).get('/api/health');
    assert(healthRes.status === 200, 'GET /api/health returns 200');
    assert(healthRes.body.status === 'healthy', 'GET /api/health has status "healthy"');

    // 2. 404 handler test
    const notFoundRes = await request(app).get('/api/non-existent-route');
    assert(notFoundRes.status === 404, 'GET /api/non-existent-route returns 404');
    assert(notFoundRes.body.message.includes('not found'), '404 contains standardized error message');

    // 3. User Model schema & toJSON contract test
    const testUser = new User({
      name: 'Test Researcher',
      email: 'researcher@example.com',
      passwordHash: 'SuperSecret123',
      role: 'PhD Scholar',
      avatar: 'https://example.com/avatar.jpg',
    });
    const userJson = testUser.toJSON();
    assert(userJson.id !== undefined, 'User toJSON maps id');
    assert(userJson._id === undefined, 'User toJSON removes _id');
    assert(userJson.passwordHash === undefined, 'User toJSON excludes passwordHash');
    assert(userJson.name === 'Test Researcher', 'User toJSON has correct name');
    assert(userJson.papersSimplified === 0, 'User toJSON includes papersSimplified');
    assert(userJson.readingTimeSaved === '0 hrs', 'User toJSON includes readingTimeSaved');

    // 4. Paper Model schema & toJSON contract test
    const testPaper = new Paper({
      customId: 'attention-test',
      title: 'Attention Is All You Need',
      authors: 'Vaswani et al.',
      category: 'Machine Learning',
      status: 'READY',
      summaries: {
        tldr: 'Transformer paper',
        beginner: 'Simple explanation',
        intermediate: 'Technical overview',
        technical: 'Equations',
      },
      sections: [{ id: 'sec-1', page: 1, title: 'Intro', content: 'Text...' }],
      flashcards: [{ id: 'fc-1', q: 'What is attention?', a: 'Mechanism', ref: 'Page 1', difficulty: 'Easy' }],
      quizzes: [{ id: 'qz-1', question: 'Q?', options: ['A', 'B'], correct: 0, explanation: 'Exp' }],
    });
    const paperJson = testPaper.toJSON();
    assert(paperJson.id === 'attention-test', 'Paper toJSON maps customId to id');
    assert(paperJson._id === undefined, 'Paper toJSON removes _id');
    assert(paperJson.title === 'Attention Is All You Need', 'Paper toJSON retains title');
    assert(paperJson.summaries.tldr === 'Transformer paper', 'Paper toJSON retains summaries structure');
    assert(paperJson.sections.length === 1, 'Paper toJSON retains sections array');
    assert(paperJson.flashcards.length === 1, 'Paper toJSON retains flashcards');
    assert(paperJson.quizzes.length === 1, 'Paper toJSON retains quizzes');

    // 5. Auth Middleware tests
    const unauthProfileRes = await request(app).get('/api/auth/profile');
    assert(unauthProfileRes.status === 401, 'GET /api/auth/profile without token returns 401');

    const badTokenRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid-token-string');
    assert(badTokenRes.status === 401, 'GET /api/auth/profile with invalid token returns 401');

    // 6. Auth Controller validation tests
    const emptyRegisterRes = await request(app).post('/api/auth/register').send({});
    assert(emptyRegisterRes.status === 400, 'POST /api/auth/register with empty body returns 400');

    const emptyLoginRes = await request(app).post('/api/auth/login').send({});
    assert(emptyLoginRes.status === 400, 'POST /api/auth/login with empty body returns 400');

    // 7. Paper Upload validation test
    const emptyUploadRes = await request(app).post('/api/papers/upload');
    assert(emptyUploadRes.status === 400, 'POST /api/papers/upload without file/url returns 400');

    // 8. AI Chat endpoint test
    const emptyChatRes = await request(app).post('/api/ai/chat').send({});
    assert(emptyChatRes.status === 400, 'POST /api/ai/chat with empty body returns 400');

    const chatRes = await request(app).post('/api/ai/chat').send({
      paperId: 'attention-test',
      query: 'What is the attention mechanism?',
    });
    assert(chatRes.status === 200, 'POST /api/ai/chat returns 200');
    assert(typeof chatRes.body.text === 'string', 'AI chat returns text string');
    assert(typeof chatRes.body.source === 'string', 'AI chat returns source string');
    assert(typeof chatRes.body.sourceId === 'string', 'AI chat returns sourceId string');
    assert(typeof chatRes.body.time === 'string', 'AI chat returns time string');

    // 9. AI Service fallback synthesis test
    const fallbackData = aiService._generateFallbackProcessingData(
      { title: 'Neural ODEs for Continuous Depth Models' },
      'test-paper-id'
    );
    assert(fallbackData.title.includes('Neural ODEs'), 'AI service fallback parses title');
    assert(fallbackData.summaries.tldr.length > 0, 'AI service fallback generates TLDR');
    assert(fallbackData.sections.length > 0, 'AI service fallback generates sections');
    // 10. AI Summary, Quiz, and Flashcards tests
    const summaryRes = await request(app).post('/api/ai/summary').send({ paperId: 'attention-test', level: 'beginner' });
    assert(summaryRes.status === 200, 'POST /api/ai/summary returns 200');
    assert(summaryRes.body.summaries !== undefined, 'Summary response includes summaries');

    const quizRes = await request(app).post('/api/ai/quiz').send({ paperId: 'attention-test' });
    assert(quizRes.status === 200, 'POST /api/ai/quiz returns 200');
    assert(Array.isArray(quizRes.body.quizzes), 'Quiz response includes quizzes array');

    const flashcardsRes = await request(app).post('/api/ai/flashcards').send({ paperId: 'attention-test' });
    assert(flashcardsRes.status === 200, 'POST /api/ai/flashcards returns 200');
    assert(Array.isArray(flashcardsRes.body.flashcards), 'Flashcards response includes flashcards array');

    const unauthPutProfileRes = await request(app).put('/api/auth/profile').send({ name: 'Hacker' });
    assert(unauthPutProfileRes.status === 401, 'PUT /api/auth/profile without token returns 401');
  } catch (err) {
    console.error('Test execution exception:', err);
    failed++;
  }

  console.log(`\nVerification Complete: ${passed} PASSED, ${failed} FAILED\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
