"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var Net = require('web3-net');
var Miner = function () {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);
    this.net = new Net(this.currentProvider);
    var self = this;
    var setProvider = self.setProvider;
    self.setProvider = function() {
      setProvider.apply(self, arguments);
      core.packageInit(_this, [self.currentProvider]);
    };

    [
        new Method({
            name: 'setGasPrice',
            call: 'miner_setGasPrice',
            params: 1,
        }),

    ].forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

};

core.addProviders(Miner);


module.exports = Miner;


