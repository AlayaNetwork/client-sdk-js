"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var Net = require('web3-net');

var TxPool = function () {
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
            name: 'status',
            call: 'txpool_status',
            params: 0,
        }),

        new Method({
            name: 'content',
            call: 'txpool_content',
            params: 0,
        }),

    ].forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

};

core.addProviders(TxPool);


module.exports = TxPool;


