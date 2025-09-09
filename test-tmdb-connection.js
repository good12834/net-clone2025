// Test TMDB API Connection
// Run with: node test-tmdb-connection.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let apiKey, bearerToken;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_TMDB_API_KEY=')) {
      apiKey = trimmed.split('=')[1];
    } else if (trimmed.startsWith('VITE_TMDB_BEARER_TOKEN=')) {
      bearerToken = trimmed.split('=')[1];
    }
  }
} catch (error) {
  console.log('❌ Could not read .env.local file');
  console.log('Please make sure the file exists and contains your TMDB API keys');
  process.exit(1);
}

const TMDB_API_URL = 'https://api.themoviedb.org/3';

console.log('🔍 Testing TMDB API Connection...\n');

async function testAPIConnection() {
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.log('❌ API Key not configured. Please update VITE_TMDB_API_KEY in .env.local');
    return;
  }

  if (!bearerToken || bearerToken === 'YOUR_BEARER_TOKEN_HERE') {
    console.log('❌ Bearer Token not configured. Please update VITE_TMDB_BEARER_TOKEN in .env.local');
    return;
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  console.log('✅ Bearer Token found:', bearerToken.substring(0, 20) + '...\n');

  try {
    // Test with API key
    console.log('🧪 Testing API Key authentication...');
    const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
      params: { api_key: apiKey, page: 1 }
    });

    console.log('✅ API Key test successful!');
    console.log('📊 Found', response.data.results.length, 'popular movies\n');

    // Test with Bearer token
    console.log('🧪 Testing Bearer Token authentication...');
    const bearerResponse = await axios.get(`${TMDB_API_URL}/movie/popular`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      params: { page: 1 }
    });

    console.log('✅ Bearer Token test successful!');
    console.log('📊 Found', bearerResponse.data.results.length, 'popular movies\n');

    console.log('🎉 All TMDB API tests passed! Your configuration is working correctly.');

  } catch (error) {
    console.log('❌ TMDB API test failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.status_message || error.message);

    if (error.response?.status === 401) {
      console.log('\n💡 This usually means:');
      console.log('   - Your API key is invalid or expired');
      console.log('   - Your Bearer token is invalid');
      console.log('   - Your API key doesn\'t have the right permissions');
      console.log('\n🔗 Get new keys at: https://www.themoviedb.org/settings/api');
    }
  }
}

testAPIConnection();