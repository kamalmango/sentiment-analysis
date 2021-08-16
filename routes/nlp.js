const express = require('express');
const vader = require('vader-sentiment')

const router = express.Router();


router.post('/s-analyzer', function(req, res, next) {
  const { review } = req.body;
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review)

  res.status(200).json({ intensity });
});


module.exports = router;