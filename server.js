var ua = require('universal-analytics');
var express = require('express');
var app = express();
var scraper = require('./scraper');

app.get('/:cardNumber?', (req, res) => {
  var visitor = ua('UA-83437472-1');
  visitor.pageview('/').send();

  var cardNumber = req.params.cardNumber;
  
  if (!cardNumber) {
    return res.status(400).json({
      error: 'No card number'
    });
  }

  if (!/^[0-9]{16}$/.test(cardNumber)) {
    return res.status(400).json({
      error: 'Invalid card number'
    });
  }

  scraper.queryCardAmount(cardNumber, (err, amount) => {
    if (err) {
      return res.status(err.status).json({
        error: err.message
      });
    }
    
    res.json({
      amount: amount
    });
  });
});

app.listen(3002, () => console.log('Card proxy listening on port 3000'));
