const express = require('express');
const router = express.Router();
const inventoryLogController = require('../controllers/inventoryLogController');

router.get('/', inventoryLogController.getAllLogs);
router.get('/:id', inventoryLogController.getLogById);
router.post('/', inventoryLogController.createLog);
router.put('/:id', inventoryLogController.updateLog);
router.delete('/:id', inventoryLogController.deleteLog);

module.exports = router;
