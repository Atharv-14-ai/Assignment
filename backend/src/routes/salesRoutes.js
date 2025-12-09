const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/health', salesController.health);

router.get('/', salesController.getSales);

router.get('/filters', salesController.getFilterMeta);

router.get('/stats', salesController.getSummaryStats);

router.get('/sample', salesController.getSampleData);

module.exports = router;