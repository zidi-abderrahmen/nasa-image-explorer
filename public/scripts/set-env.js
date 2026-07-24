const fs = require('fs');

const apiKey = process.env.NASA_API_KEY;

const envFile = `export const environment = {
  production: true,
  nasaApiKey: '${apiKey}'
};`;

fs.writeFileSync('./src/environments/environment.ts', envFile);
console.log('✅ Environment file generated with NASA_API_KEY');