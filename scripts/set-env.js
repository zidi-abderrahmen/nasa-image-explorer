const fs = require('fs');

const apiKey = process.env.NASA_API_KEY || 'YOUR_API_KEY_HERE';

const envFile = `export const environment = {
  production: true,
  nasaApiKey: '${apiKey}',
  nasaApiUrl: 'https://api.nasa.gov/planetary/apod'
};`;

fs.writeFileSync('./src/environments/environment.ts', envFile);
console.log('✅ Environment file generated with NASA_API_KEY');