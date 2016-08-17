var horseman = require('node-horseman');
var async = require('async');

var url = 'http://kortladdning3.chalmerskonferens.se/default.aspx';
var options = {
  loadImages: false,
  switchToNewTab: true
};

var queue = async.queue(function(cardNumber, callback) {
  (new horseman(options)).open(url)
    .type('#txtCardNumber', cardNumber)
    .click('#btnNext')
    .waitForNextPage()
    .text('#txtPTMCardValue')
    .then((value) => {
      if (!value)
        return callback('Invalid card number');

      callback(false, Math.round(parseInt(value)));
    })
    .close();
});

module.exports = {
  queryCardAmount: (cardNumber, callback) => {
    queue.push(cardNumber, callback);
  }
};