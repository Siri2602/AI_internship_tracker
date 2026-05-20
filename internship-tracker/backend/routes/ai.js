const express = require('express');
const { generateEmailTemplate, getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/email-template', generateEmailTemplate);
router.post('/insights', getInsights);

module.exports = router;
