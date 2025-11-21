const express = require('express');
const router = express.Router();
const { createLink, getAllLinks, getLinkByCode, deleteLink } = require('../controllers/linkController');

router.post('/links', createLink);
router.get('/links', getAllLinks);
router.get('/links/:code', getLinkByCode);
router.delete('/links/:code', deleteLink);

module.exports = router;