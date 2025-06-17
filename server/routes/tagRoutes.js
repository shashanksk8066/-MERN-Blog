const express = require('express');
const router = express.Router();

const tags = ['React', 'Node.js', 'MongoDB', 'UI/UX', 'TypeScript'];

router.get('/', (req, res) => {
  res.json(tags);
});

module.exports = router;
