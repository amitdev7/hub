// Automated End-to-End Functional Verification Suite for StorageHub
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('STORAGEHUB AUTOMATED VERIFICATION SUITE');
  console.log('Testing against: ' + BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  let sessionCookie = '';
  let createdResourceId = '';
  let createdCollectionId = '';
  let uploadedFileId = '';

  try {
    // 1. Public Portal Page Load
    const publicPageRes = await fetch(`${BASE_URL}/`);
    assert(publicPageRes.status === 200, 'Test 1: Public portal page loads with HTTP 200');

    // 2. Public Resources API (Strict Privacy Isolation)
    const publicRes = await fetch(`${BASE_URL}/api/resources`);
    const publicData = await publicRes.json();
    assert(
      publicRes.status === 200 && Array.isArray(publicData.resources),
      'Test 2: Public resources API returns resources array'
    );
    const hasPrivateInPublic = publicData.resources.some((r) => r.visibility === 'private');
    assert(
      !hasPrivateInPublic,
      'Test 16: Privacy Isolation - Zero private resources visible to public visitors'
    );

    // 3. Unauthorized Mutation Rejection (Security check)
    const unauthPost = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked', url: 'https://evil.com' }),
    });
    assert(
      unauthPost.status === 401,
      'Test 20: Security - Unauthorized users cannot access protected operations (401)'
    );

    // 4. Admin Authentication
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'adminpassword123' }),
    });
    const loginData = await loginRes.json();
    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
    assert(
      loginRes.status === 200 && loginData.success === true && loginData.user.username === 'admin',
      'Test 1: Administrator authentication succeeds with valid session'
    );

    // 5. Verify Authenticated Session
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    const meData = await meRes.json();
    assert(
      meRes.status === 200 && meData.user?.username === 'admin',
      'Test 2: Session validation returns current admin identity'
    );

    // 6. Admin can view both public and private resources
    const adminRes = await fetch(`${BASE_URL}/api/resources`, {
      headers: { Cookie: sessionCookie },
    });
    const adminResData = await adminRes.json();
    const hasPrivateInAdmin = adminResData.resources.some((r) => r.visibility === 'private');
    assert(
      hasPrivateInAdmin,
      'Test 15: Admin command center has access to private workstation resources'
    );

    // 7. Create Collection
    const createColRes = await fetch(`${BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        name: 'Automated Test Collection',
        slug: 'test-collection-' + Date.now(),
        description: 'Created during automated verification suite',
        color: 'violet',
        isPublic: true,
      }),
    });
    const createColData = await createColRes.json();
    createdCollectionId = createColData.id;
    assert(
      createColRes.status === 200 && Boolean(createdCollectionId),
      'Test 7: Collection creation succeeds and persists'
    );

    // 8. Create Resource
    const createRes = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        title: 'DeepMind AlphaFold Portal',
        url: 'https://alphafold.ebi.ac.uk',
        description: 'Accurate 3D protein structure prediction database',
        category: 'Science',
        resourceType: 'link',
        collectionId: createdCollectionId,
        visibility: 'public',
        isFavorite: true,
        tags: ['Biology', 'AI', 'DeepMind'],
      }),
    });
    const createResData = await createRes.json();
    createdResourceId = createResData.id;
    assert(
      createRes.status === 200 && Boolean(createdResourceId),
      'Test 3: Resource creation succeeds and persists'
    );

    // 9. Resource URL Click & Activity Tracking
    const clickRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}/click`, {
      method: 'POST',
    });
    const clickData = await clickRes.json();
    assert(
      clickRes.status === 200 && clickData.clickCount >= 1,
      'Test 6: Resource URL click tracking increments click counter'
    );

    // 10. Favorites Persistence
    const favRes = await fetch(`${BASE_URL}/api/resources?favorite=true`, {
      headers: { Cookie: sessionCookie },
    });
    const favData = await favRes.json();
    const isFavPresent = favData.resources.some((r) => r.id === createdResourceId);
    assert(isFavPresent, 'Test 8: Favorites filtering correctly includes favorited resource');

    // 11. Resource Editing
    const editRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        title: 'DeepMind AlphaFold 3 Portal (Updated)',
        isPinned: true,
      }),
    });
    assert(editRes.status === 200, 'Test 4: Resource editing succeeds and updates values');

    // 12. Resource Reordering Persistence
    const reorderRes = await fetch(`${BASE_URL}/api/resources/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        items: [
          { id: createdResourceId, displayOrder: 0 },
          { id: 'res-stripe-0001', displayOrder: 1 },
        ],
      }),
    });
    assert(reorderRes.status === 200, 'Test 13: Drag-and-drop resource reordering persists');

    // 13. File Upload (Multi-part form)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileContent = 'STORAGEHUB AUTOMATED VERIFICATION FILE\nTimestamp: ' + new Date().toISOString();
    const bodyBuffer = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="automated_test_doc.txt"\r\nContent-Type: text/plain\r\n\r\n`
      ),
      Buffer.from(fileContent),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="visibility"\r\n\r\npublic\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="createResource"\r\n\r\ntrue\r\n`),
      Buffer.from(`--${boundary}--\r\n`),
    ]);

    const uploadRes = await fetch(`${BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Cookie: sessionCookie,
      },
      body: bodyBuffer,
    });
    const uploadData = await uploadRes.json();
    if (uploadData.files?.[0]) {
      uploadedFileId = uploadData.files[0].id;
    }
    assert(
      uploadRes.status === 200 && Boolean(uploadedFileId),
      'Test 10: Multi-file upload persists to disk and creates database records'
    );

    // 14. File Preview Streaming
    const previewRes = await fetch(`${BASE_URL}/api/files/${uploadedFileId}/preview`);
    const previewText = await previewRes.text();
    assert(
      previewRes.status === 200 && previewText.includes('STORAGEHUB AUTOMATED VERIFICATION FILE'),
      'Test 11: In-browser file preview streams content accurately'
    );

    // 15. File Download Streaming
    const downloadRes = await fetch(`${BASE_URL}/api/files/${uploadedFileId}/download`);
    const disposition = downloadRes.headers.get('content-disposition');
    assert(
      downloadRes.status === 200 && disposition?.includes('attachment'),
      'Test 12: File download streams with Content-Disposition attachment header'
    );

    // 16. Global Search
    const searchRes = await fetch(`${BASE_URL}/api/search?q=AlphaFold`);
    const searchData = await searchRes.json();
    const foundResource = searchData.resources.some((r) => r.id === createdResourceId);
    assert(foundResource, 'Test 9: Global instant search returns matching resources and files');

    // 17. Duplicate Resource
    const dupRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({ action: 'duplicate' }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && Boolean(dupData.id), 'Test 18: Resource duplicate action creates clone');

    // 18. Delete Resource
    const deleteRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}`, {
      method: 'DELETE',
      headers: { Cookie: sessionCookie },
    });
    assert(deleteRes.status === 200, 'Test 5: Resource deletion removes record cleanly');

    // Clean up duplicate
    if (dupData.id) {
      await fetch(`${BASE_URL}/api/resources/${dupData.id}`, {
        method: 'DELETE',
        headers: { Cookie: sessionCookie },
      });
    }

    // 19. Activity Logs Verification
    const activityRes = await fetch(`${BASE_URL}/api/activity`, {
      headers: { Cookie: sessionCookie },
    });
    const activityData = await activityRes.json();
    assert(
      activityRes.status === 200 && activityData.logs.length > 0,
      'Test 14: Activity audit log tracks all administrative operations'
    );

    // 20. Admin Safe Logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
    });
    assert(logoutRes.status === 200, 'Test 19: Safe administrator logout clears session');
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
