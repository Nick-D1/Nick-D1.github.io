//Added for CS499
var express = require('express');
var router = express.Router();

// Show feedback form
router.get('/', function(req, res) {
  res.render('feedback', { title: 'Feedback' });
});

// Handle form submission
router.post('/', function(req, res) {
  // Normally you would save to a database here
  // For now, just show thank you page
  res.render('thankyou', { title: 'Thank You' });
});

module.exports = router;
