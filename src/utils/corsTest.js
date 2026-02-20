// CORS Test Utility
export const testCORS = async () => {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🔍 Testing CORS from browser...');
  
  try {
    // Test 1: Health check
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test 2: Categories API
    console.log('Testing categories endpoint...');
    const categoriesResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Categories status:', categoriesResponse.status);
    const categoriesData = await categoriesResponse.json();
    console.log('Categories count:', categoriesData.length);
    
    return {
      success: true,
      health: { status: healthResponse.status, data: healthData },
      categories: { status: categoriesResponse.status, count: categoriesData.length }
    };
    
  } catch (error) {
    console.error('CORS Test Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run test immediately when imported in development
if (process.env.NODE_ENV === 'development') {
  testCORS().then(result => {
    if (result.success) {
      console.log('✅ CORS test passed!');
    } else {
      console.log('❌ CORS test failed:', result.error);
    }
  });
}