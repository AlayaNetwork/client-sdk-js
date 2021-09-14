"use strict";

var core = require('web3-core');
var Method = require('web3-core-method');
var Net = require('web3-net');

var Admin = function () {
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
            name: 'stopWS',
            call: 'admin_stopWS',
            params: 0,
        }),
        new Method({
            name: 'stopRPC',
            call: 'admin_stopRPC',
            params: 0,
        }),
        new Method({
            name: 'startWS',
            call: 'admin_startWS',
            params: 4,
        }),
        new Method({
            name: 'startRPC',
            call: 'admin_startRPC',
            params: 5,
        }),
        new Method({
            name: 'addPeer',
            call: 'admin_addPeer',
            params: 1,
        }),
        new Method({
            name: 'removePeer',
            call: 'admin_removePeer',
            params: 1,
        }),

        new Method({
            name: 'datadir',
            call: 'admin_datadir',
            params: 0,
        }),

        new Method({
            name: 'peers',
            call: 'admin_peers',
            params: 0,
        }),

        new Method({
            name: 'exportChain',
            call: 'admin_exportChain',
            params: 1,
        }),

        new Method({
            name: 'importChain',
            call: 'admin_importChain',
            params: 1,
        }),

        new Method({
            name: 'nodeInfo',
            call: 'admin_nodeInfo',
            params: 0,
        }),

        new Method({
            name: 'getProgramVersion',
            call: 'admin_getProgramVersion',
            params: 0,
        }),

        new Method({
            name: 'getSchnorrNIZKProve',
            call: 'admin_getSchnorrNIZKProve',
            params: 0,
        }),

    ].forEach(function(method) {
        method.attachToObject(_this);
        method.setRequestManager(_this._requestManager);
    });

};

core.addProviders(Admin);


module.exports = Admin;


