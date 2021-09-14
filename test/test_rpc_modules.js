var Web3 = require("../packages/web3/src");
var web3 = undefined;
var RLP = require("rlp");
var _ = require('underscore');
var fs = require("fs-extra");
// const { result } = require("underscore");

// const provider = "https://devnetopenapi.platon.network"; // 请更新成自己的 http 节点
const provider = "http://127.0.0.1:6789";
const privateKey = "0X29345764fe154f68d788072f11b5124e16f2cb770713e946511a507f4d51043e"; 
const password = "123456";
web3 = new Web3(provider);
// var utils = require("../packages/web3-utils/src");
// evm
vmType = 0

const test_admin = async (method, arguments) => {

    var result = await web3.admin.nodeInfo();
    console.log("nodeInfo: ", result)

    result = await web3.admin.startWS("0.0.0.0", 6790, "*", "admin, platon");
    console.log("startWS: ", result)

    result = await web3.admin.stopWS();
    console.log("stopWS: ", result)

    // result = await web3.admin.stopRPC();
    // console.log("stopRPC: ", result)

    // result = await web3.admin.startRPC("0.0.0.0", 6789, "*", "admin, platon","*");
    // console.log("startRPC: ", result)

    // result = await web3.admin.addPeer("enode://ab4c8aa906c24a3f68b85759e771783d54eea3eedeac8c3a5518c3f9d96a8e02399794c559623fd6705c6ebddda42da03bf2f1990a4780240ec47b63ef9ca682@127.0.0.1:16789");
    // console.log("addPeer: ", result)

    // result = await web3.admin.removePeer("enode://ab4c8aa906c24a3f68b85759e771783d54eea3eedeac8c3a5518c3f9d96a8e02399794c559623fd6705c6ebddda42da03bf2f1990a4780240ec47b63ef9ca682@127.0.0.1:16789");
    // console.log("removePeer: ", result)

    data_dir = await web3.admin.datadir();
    console.log("datadir: ", result)

    result = await web3.admin.peers();
    console.log("peers: ", result)

    // var export_path = data_dir + "/export.txt"
    // console.log("export_path:", export_path);
    // result = await web3.admin.exportChain(export_path);
    // console.log("exportChain path: ", export_path, ", result:", result)

    // result = await web3.admin.importChain(export_path);
    // console.log("importChain path: ", export_path, ", result:", result)

    result = await web3.admin.getProgramVersion();
    console.log("getProgramVersion: ", result)

    result = await web3.admin.getSchnorrNIZKProve();
    console.log("getSchnorrNIZKProve: ", result)

}

const test_debug = async (method, arguments) => {
    var result = await web3.debug.economicConfig();
    console.log("economicConfig: ", result)
}

const test_miner = async (method, arguments) => {
    var result = await web3.miner.setGasPrice(web3.utils.numberToHex("1000000"));
    console.log("setGasPrice: ", result)
}

const test_net = async (method, arguments) => {
    var result = await web3.net.isListening();
    console.log("isListening: ", result)

    result = await web3.net.getId();
    console.log("getId: ", result)

    result = await web3.net.getPeerCount();
    console.log("getPeerCount: ", result)
}

const test_personal = async (method, arguments) => {
    // listAccounts
    var accounts = await web3.platon.personal.getAccounts();
    console.log("getAccounts: ", accounts)

    var result = await web3.platon.personal.listWallets();
    console.log("listWallets: ", result);

    if(result.length > 0) {
        console.log("openWallet url: ", result[0]["url"])
        result = await web3.platon.personal.openWallet(result[0]["url"], password);
        console.log("openWallet: ", result)
    }

    /////////importRawKey////////////////////////
    /*
    var priKey = privateKey
    if(priKey.startsWith("0x") || priKey.startsWith("0X"))
    {
        priKey = priKey.slice(2);
    }
    result = await web3.platon.personal.importRawKey(priKey, password);
    console.log("importRawKey: ", result)
    */
    //////lockAccount//////////////////
    if(accounts.length > 0)
    {
        result = await web3.platon.personal.unlockAccount(accounts[0], password);
        console.log("unlockAccount ", accounts[0], ", result:", result);

        result = await web3.platon.personal.lockAccount(accounts[0]);
        console.log("lockAccount ", accounts[0], ", result:", result);

        gasPrice = web3.utils.numberToHex(await web3.platon.getGasPrice()*10);
        gas = web3.utils.numberToHex(parseInt((await web3.platon.getBlock("latest")).gasLimit - 1));
        let nonce = web3.utils.numberToHex(await web3.platon.getTransactionCount(accounts[0]));
        let tx = {
            from: accounts[0],
            to: accounts[1],
            value: "1000000",
            chainId: 100,
            gasPrice:gasPrice, 
            gas: gas, 
            nonce:nonce,
        };

        result = await web3.platon.personal.signAndSendTransaction(tx, password);
        console.log("signAndSendTransaction result:", result);
    }
}

const test_platon = async (method, arguments) => {
    var result = await web3.platon.getGasPrice();
    console.log("getGasPrice: ", result)

    result = await web3.platon.getProtocolVersion();
    console.log("getProtocolVersion: ", result)

    result = await web3.platon.isSyncing();
    console.log("isSyncing: ", result)

    result = await web3.platon.chainId();
    console.log("chainId: ", result)

    result = await web3.utils.sha3("111");
    console.log("sha3: ", result)

    var blkNumber = await web3.platon.getBlockNumber();
    console.log("blkNumber: ", blkNumber)
    result = await web3.platon.getBlock(blkNumber);
    console.log("getBlock by blocknumber: ", result)

    var blkHash = result["hash"]
    result = await web3.platon.getBlock(blkHash);
    console.log("getBlock by hash: ", result)

    result = await web3.platon.getPendingTransactions();
    console.log("pendingTransactions: ", result)

    result = await web3.platon.getTransactionFromBlock(blkNumber, 0);
    console.log("getTransactionFromBlock by blockNumber and tx index: ", result)

    result = await web3.platon.getTransactionFromBlock(blkHash, 0);
    console.log("getTransactionFromBlock by blockHash and tx index: ", result)

    result = await web3.platon.getBlockTransactionCount(blkNumber);
    console.log("getBlockTransactionCount by blockNumber: ", result)

    result = await web3.platon.getBlockTransactionCount(blkHash);
    console.log("getBlockTransactionCount by blockHash: ", result)


    result = await web3.platon.evidences();
    console.log("evidences: ", result)

    result = await web3.platon.getRawTransactionFromBlock(blkNumber, 0);
    console.log("getRawTransactionFromBlock by blockNumber and tx index: ", result)

    result = await web3.platon.getRawTransactionFromBlock(blkHash, 0);
    console.log("getRawTransactionFromBlock by blockHash and tx index: ", result)
        
}

const test_txpool = async (method, arguments) => {
    var result = await web3.txpool.status();
    console.log("txpool status: ", result)

    result = await web3.txpool.content();
    console.log("txpool content: ", result)
}


// test_admin()
// test_debug()
// test_miner()
// test_net()
// test_personal()
test_platon()
// test_txpool()
