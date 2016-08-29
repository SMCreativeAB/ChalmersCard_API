var BROWSER_INSTANCES = 2;
var horseman = require('node-horseman');
var async = require('async');

var url = 'http://kortladdning3.chalmerskonferens.se/default.aspx';
var options = {
  loadImages: false,
  switchToNewTab: true,
  timeout: 10000
};

var queue = async.queue(function(cardNumber, callback) {
  var browser = new horseman(options);
  
  browser.open(url)
    .type('#txtCardNumber', cardNumber)
    .click('#btnNext')
    .waitForNextPage()
    .text('#txtPTMCardValue')
    .then((value) => {
      if (!value)
        return callback('Invalid card number');

      callback(false, Math.round(parseInt(value)));
    }).finally(function() {
      browser.close();
    });
}, BROWSER_INSTANCES);

module.exports = {
  queryCardAmount: (cardNumber, callback) => {
    queue.push(cardNumber, callback);
  }
};