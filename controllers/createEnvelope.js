const dotenv = require('dotenv');
dotenv.config();


const createEnvelope = async (req, res) => {
  try {
    // Get access token from request headers
    const accessToken =
      req.headers['authorization'] || req.headers['access-token'] || req.headers.accesstoken;

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing access token in headers.' });
    }

    const { subject, documents, recipients } = req.body;

    if (!Array.isArray(documents) || !Array.isArray(recipients)) {
      return res.status(400).json({ error: 'Invalid documents or recipients format.' });
    }

    // Construct envelope definition
    const envelope = {
      emailSubject: subject || 'Please sign this document',
      documents: documents.map((doc, index) => ({
        documentBase64: doc.base64,
        name: doc.name,
        fileExtension: doc.extension || 'docx',
        documentId: (index + 1).toString()
      })),
      recipients: {
        signers: recipients.map((recipient, idx) => ({
          email: recipient.email,
          name: recipient.name,
          recipientId: (idx + 1).toString(),
          tabs: {
            signHereTabs: (recipient.tabs || []).map(tab => ({
              anchorString: tab.anchorString,
              anchorXOffset: tab.anchorXOffset || '0',
              anchorYOffset: tab.anchorYOffset || '0',
              documentId: tab.documentId || '1'
            }))
          }
        }))
      },
      status: 'sent'
    };

    const docusignResponse = await fetch(
      `https://demo.docusign.net/restapi/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes`,
      {
        method: 'POST',
        headers: {
          Authorization: accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(envelope)
      }
    );

    const data = await docusignResponse.json();

    if (!docusignResponse.ok) {
      return res.status(docusignResponse.status).json({
        error: data,
        message: 'Failed to create envelope'
      });
    }

    res.status(200).json({ envelopeId: data.envelopeId });
  } catch (err) {
    console.error('Envelope creation error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

module.exports = { createEnvelope };
