const express = require('express');
const router = express.Router();

const categories = ['Technology', 'Health', 'Lifestyle', 'Education', 'Travel'];

router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;
