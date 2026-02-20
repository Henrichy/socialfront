// Backend Diagnostic Tool
import { appConfig } from '../config/environments';

export const testBackendConnection = async () => {
  const results = {
    baseUrl: appConfig.API_BASE_URL,
    tests: [],
    summary: { passed: 0, failed: 0, total: 0 }
  };

  const endpoints = [
    { name: 'Health Check', url: '/health', method: 'GET' },
    { name: 'Categories API', url: '/api/categories', method: 'GET' },
    { name: 'Accounts API', url: '/api/accounts', method: 'GET' }
  ];

  console.log('🔍 Testing backend connection to:', appConfig.API_BASE_URL);

  for (const endpoint of endpoints) {
    const test = {
      name: endpoint.name,
      url: `${appConfig.API_BASE_URL}${endpoint.url}`,
      method: endpoint.method,
      status: 'pending',
      statusCode: null,
      error: null,
      responseTime: null
    };

    try {
      const startTime = Date.now();
      
      const response = await fetch(test.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      test.responseTime = Date.now() - startTime;
      test.statusCode = response.status;
      
      if (response.ok) {
        test.status = 'passed';
        results.summary.passed++;
      } else {
        test.status = 'failed';
        test.error = `HTTP ${response.status}: ${response.statusText}`;
        results.summary.failed++;
      }
    } catch (error) {
      test.status = 'failed';
      test.error = error.message;
      test.responseTime = Date.now() - (test.responseTime || Date.now());
      results.summary.failed++;
    }

    results.tests.push(test);
    results.summary.total++;
  }

  // Log results
  console.log('📊 Backend Diagnostic Results:');
  results.tests.forEach(test => {
    const icon = test.status === 'passed' ? '✅' : '❌';
    console.log(`${icon} ${test.name}: ${test.statusCode || 'No Response'} (${test.responseTime}ms)`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  console.log(`\n📈 Summary: ${results.summary.passed}/${results.summary.total} tests passed`);

  return results;
};

export const displayDiagnosticResults = (results) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '500px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 10000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h3>🔍 Backend Diagnostic Results</h3>
      <p><strong>Base URL:</strong> {results.baseUrl}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Summary:</strong> {results.summary.passed}/{results.summary.total} tests passed
      </div>

      {results.tests.map((test, index) => (
        <div key={index} style={{
          padding: '8px',
          margin: '5px 0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: test.status === 'passed' ? '#f0f9ff' : '#fef2f2'
        }}>
          <div style={{ fontWeight: 'bold' }}>
            {test.status === 'passed' ? '✅' : '❌'} {test.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {test.url}
          </div>
          <div style={{ fontSize: '12px' }}>
            Status: {test.statusCode || 'No Response'} | Time: {test.responseTime}ms
          </div>
          {test.error && (
            <div style={{ fontSize: '12px', color: 'red' }}>
              Error: {test.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default testBackendConnection;