const dotenv = require('dotenv');
dotenv.config();



const getRecipentStatus = async (req, res) => {
  const envelopeId = req.body.envelopeId;
  const authHeader = req.headers.authorization;

  if (!envelopeId || !authHeader) {
    return res.status(400).json({ error: 'Missing envelopeId or Authorization header' });
  }

  try {
    const response = await fetch(
      `https://demo.docusign.net/restapi/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/recipients`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'Failed to fetch envelope status',
        error: data
      });
    }

    res.status(200).json({data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {getRecipentStatus};