const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');
dotenv.config();


const auth = async (req, res) => {
  try {
    // Load private key
    const privateKey = fs.readFileSync('./file.txt', 'utf8');

    // DocuSign credentials
    const integratorKey = process.env.INTEGRATIONKEY;
    const userId = process.env.USERID;
    const audience = 'account-d.docusign.com';

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: integratorKey,
      sub: userId,
      aud: audience,
      scope: 'signature impersonation',
      iat: now,
      exp: now + 3600,
    };

    // Sign the JWT
    const jwtAssertion = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    // Request access token from DocuSign
    const response = await fetch('https://account-d.docusign.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtAssertion,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
    } else {
      res.status(400).json({
        error: data.error,
        message: data.error_description || 'DocuSign token error',
      });
    }
  } catch (err) {
    console.error('JWT auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {auth};
