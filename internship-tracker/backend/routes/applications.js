const express = require('express');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
  bulkDelete,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.delete('/bulk', bulkDelete);
router.route('/').get(getApplications).post(createApplication);
router.route('/:id').get(getApplication).put(updateApplication).delete(deleteApplication);

module.exports = router;
