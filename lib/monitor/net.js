var si = require('systeminformation'),
  utils = require('../utils');

var colors = utils.colors;

function Net(line) {
  this.line = line;
  this.netData = [{
    title: 'Receiving',
    style: {
      line: colors[0]
    },
    x: Array(61).fill().map((_, i) => 60 - i),
    y: Array(61).fill(0)
  }, {
    title: 'Transferring',
    style: {
      line: colors[1]
    },
    x: Array(61).fill().map((_, i) => 60 - i),
    y: Array(61).fill(0)
  }];

  si.networkInterfaceDefault(iface => {
    this.defaultIface = iface;
    si.networkStats(iface, data => {
      this.updateData(data);
    });

    this.interval = setInterval(() => {
      si.networkStats(iface, data => {
        this.updateData(data);
      })
    }, 1000);
  })
}

Net.prototype.updateData = function(data) {

  var rx_sec = Math.max(0, data['rx_sec']);
  var tx_sec = Math.max(0, data['tx_sec']);
  var rx_label = 'Rx: ' + utils.humanFileSize(rx_sec);
  var tx_label = 'Tx: ' + utils.humanFileSize(tx_sec);

  this.netData[0].title = rx_label;
  this.netData[0].y.shift();
  this.netData[0].y.push(rx_sec);

  this.netData[1].title = tx_label;
  this.netData[1].y.shift();
  this.netData[1].y.push(tx_sec);

  // +
    // '/s \nTotal received: ' +
    // utils.humanFileSize(data['rx'])


  // tx_label = 'Transferring:      ' +
  //   utils.humanFileSize(tx_sec) +
  //   '/s \nTotal transferred: ' +
  //   utils.humanFileSize(data['tx']);

  this.line.setData(this.netData);
  this.line.screen.render();
};

module.exports = Net;
