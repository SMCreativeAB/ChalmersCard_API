var BROWSER_INSTANCES = 3;
var horseman = require('node-horseman');
var async = require('async');

var url = 'https://kortladdning3.chalmerskonferens.se/default.aspx';
var options = {
  loadImages: false,
  //switchToNewTab: true,
  timeout: 10000
};

//var browser = new horseman(options);

var queue = async.queue(function(cardNumber, callback) {
  var browser = new horseman(options);
  
  browser.open(url)
    .type('#txtCardNumber', cardNumber)
    .click('#btnNext')
    .waitForNextPage()
    .text('#txtPTMCardValue')
    .then((value) => {
      if (!value)
        return callback({status: 400, message: 'Invalid card number'});

      callback(false, Math.round(parseInt(value)));
    }).finally(function() {
      browser.close();
    }).on('error', function(e) { 
      return callback({status: 500, message: 'The scraper gave the following error: ' + e});
    });
}, BROWSER_INSTANCES);

module.exports = {
  queryCardAmount: (cardNumber, callback) => {
    queue.push(cardNumber, callback);
  }
};
