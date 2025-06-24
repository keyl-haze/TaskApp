const express = require('express');
const router = express.Router();
const service = require('./service');

router.post('/login', async (req, res) => {
  try {
    const user = await service.login(req.body);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;