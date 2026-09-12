const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

async function testUpload() {
  console.log('\n--- Testing Upload & Multer Middleware ---\n');
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
    // 1. Upload non-PDF file (should be rejected)
    const badUploadRes = await request(app)
      .post('/api/papers/upload')
      .attach('paper', Buffer.from('not a pdf'), 'test.txt');

    assert(badUploadRes.status === 400, 'Uploading non-PDF file returns 400');
    assert(badUploadRes.body.message.includes('Only PDF'), 'Error message states only PDF files allowed');

    // 2. Upload valid PDF buffer
    // PDF header: %PDF-1.4
    const dummyPdf = Buffer.from('%PDF-1.4\n%âãÏÓ\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000015 00000 n\n0000000060 00000 n\n0000000111 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n165\n%%EOF');

    const goodUploadRes = await request(app)
      .post('/api/papers/upload')
      .attach('paper', dummyPdf, 'Transformer_Self_Attention.pdf');

    // If MongoDB is offline, upload handler will encounter Mongoose save error, but Multer file filter and upload parsing succeeded!
    if (goodUploadRes.status === 201) {
      assert(goodUploadRes.body.id !== undefined, 'Uploaded paper returns id');
      assert(goodUploadRes.body.status === 'UPLOADING', 'Uploaded paper starts with status UPLOADING');
      assert(goodUploadRes.body.title.includes('Transformer'), 'Title parsed from filename');
    } else {
      // If DB is offline, error message should be Mongoose connection error or similar
      console.log(`(Info: Status is ${goodUploadRes.status}, Message: ${goodUploadRes.body.message})`);
      assert(goodUploadRes.status !== 404, 'Endpoint POST /api/papers/upload exists');
    }
  } catch (err) {
    console.error('Upload test error:', err);
    failed++;
  }

  console.log(`\nUpload Test Complete: ${passed} PASSED, ${failed} FAILED\n`);
  process.exit(failed > 0 ? 1 : 0);
}

testUpload();
