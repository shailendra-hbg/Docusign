const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());

const baseUrl = 'https://demo.docusign.net/restapi/v2.1';

const downloadDocument = async (req, res) => {
  try {
    const envelopeId = req.body.envelopeId;
    const documentId = req.body.count;
    let accessToken = req.headers.authorization;

    console.log('Received envelopeId:', envelopeId);
    console.log('Received documentId:', documentId);
    console.log('Authorization header:', accessToken ? '[provided]' : '[missing]');

    if (!envelopeId || !accessToken) {
      return res.status(400).json({ error: 'Missing envelopeId or Authorization header.' });
    }

    // Ensure Bearer prefix
    if (!accessToken.startsWith('Bearer ')) {
      accessToken = `Bearer ${accessToken}`;
    }

    const url = `${baseUrl}/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/documents/${documentId}`;

    const fetchRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': accessToken,
        'Accept': 'application/pdf'
      }
    });

    if (!fetchRes.ok) {
      const errorText = await fetchRes.text();
      console.error('DocuSign error response:', errorText);
      return res.status(fetchRes.status).json({ 
        error: 'Failed to fetch document from DocuSign.',
        details: errorText
      });
    }

    const buffer = Buffer.from(await fetchRes.arrayBuffer());

    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { downloadDocument };
