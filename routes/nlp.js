const express = require('express');
const vader = require('vader-sentiment')

const router = express.Router();


const sortComments = function(results) {
	var sortedResults = results.sort(function (a, b) {
    return b.intensity - a.intensity
  })
  return sortedResults
}


router.post('/s-analyzer', function(req, res, next) {
  const { review } = req.body;
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review)

  res.status(200).json({ intensity });
});

router.post('/bulk-analyzer', function(req, res, next) {
	const comments  = req.body
	let pos = []
	let neu = []
	let neg = []
	comments.forEach(comment => {
		const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(comment)
	  if (intensity.compound <= -0.05) {
      neg.push(comment)
    }
    if (intensity.compound > -0.05 & intensity.compound < 0.05) {
    	neu.push(comment)
    }
    if (intensity.compound >= 0.05) {
     	pos.push(comment)
    }
	})

	let results = {
		'pos': pos.length, 
		'neu': neu.length, 
		'neg': neg.length,
		'posFraction': pos.length/ comments.length,
		'neuFraction': neu.length/ comments.length,
		'negFraction': neg.length/ comments.length
	}

	res.status(200).json(results)
})

router.post('/top-comments', function(req, res, next) {
	const comments = req.body
	var results = []
	comments.forEach(comment => {
		const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(comment).compound
		results.push({comment, intensity})
	})

	res.status(200).json(sortComments(results))
})

module.exports = router;


