const express = require('express');
const {downloadDocument } = require('../controllers/fileDownload.js');
const {createEnvelope} = require('../controllers/createEnvelope.js');
const {getEnvelopeStatus} = require('../controllers/getEnvelopeStatus.js')
const {getRecipentStatus} = require('../controllers/getRecipentStatus.js');
const {auth} = require('../controllers/getToken.js');
const checkUser = require('../middlewares/checkUser.js');

const router = express.Router();
router.use(checkUser);




router.post('/filedownload', downloadDocument);
router.post('/createEnvelope', createEnvelope);
router.post('/getEnvelopeStatus', getEnvelopeStatus);
router.post('/getRecipentStatus', getRecipentStatus);
router.get('/auth',auth);

module.exports = router;
