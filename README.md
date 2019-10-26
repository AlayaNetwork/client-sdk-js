# Web3 JavaScript app API for 0.1.0
## Getting Started
 * [Adding web3](#adding-web3)
* [Using Callbacks](#using-callbacks)
* [Batch requests](#batch-requests)
* [A note on big numbers in web3.js](#a-note-on-big-numbers-in-web3js)

### Adding web3
First you need to get web3.js into your project. This can be done using the following methods:
- npm: `npm i https://github.com/PlatONnetwork/client-sdk-js`

Then you need to create a web3 instance, setting a provider.
To make sure you don't overwrite the already set provider when in mist, check first if the web3 is available:

```js
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:6789"));
}
```

 After that you can use the [API](web3js-api-reference) of the `web3` object.

### Using callbacks

As this API is designed to work with a local RPC node, all its functions use synchronous HTTP requests by default.

If you want to make an asynchronous request, you can pass an optional callback as the last parameter to most functions.

All callbacks are using an [error first callback](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/) style:

```js
web3.platon.getBlock(48, function(error, result){
    if(!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
})
```

### Batch requests
Batch requests allow queuing up requests and processing them at once.

**Note** Batch requests are not faster! In fact making many requests at once will in some cases be faster, as requests are processed asynchronously.

Batch requests are mainly useful to ensure the serial processing of requests.

```js
var batch = web3.createBatch();
batch.add(web3.platon.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.platon.contract(abi).at(address).balance.request(address, callback2));
batch.execute();
```

### A note on big numbers in web3.js
You will always get a BigNumber object for number values as JavaScript is not able to handle big numbers correctly.
Look at the following examples:

```js
"101010100324325345346456456456456456456"
// "101010100324325345346456456456456456456"
101010100324325345346456456456456456456
// 1.0101010032432535e+38
```

web3.js depends on the [BigNumber Library](https://github.com/MikeMcl/bignumber.js/) and adds it automatically.

```js
var balance = new BigNumber('131242344353464564564574574567456');
// or var balance = web3.platon.getBalance(someAddress);
balance.plus(21).toString(10); // toString(10) converts it to a number string
// "131242344353464564564574574567477"
```

The next example wouldn't work as we have more than 20 floating points, therefore it is recommended to always keep your balance in *wei* and only transform it to other units when presenting to the user:

```js
var balance = new BigNumber('13124.234435346456466666457455567456');
balance.plus(21).toString(10); // toString(10) converts it to a number string, but can only show upto 20 digits
// "13124.23443534645646666646" // your number will be truncated after the 20th digit
```

### Usage
#### web3
The `web3` object provides all methods.
##### Example

```js
var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if it's available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```

###### Example using HTTP Basic Authentication

```js
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545", 0, BasicAuthUsername, BasicAuthPassword));
//Note: HttpProvider takes 4 arguments (host, timeout, user, password)
```

***
#### web3.version.api
```js
web3.version.api
```
##### Returns
 `String` - The platon js api version.

##### Example
```js
var version = web3.version.api;
console.log(version); // "0.2.0"
```

***
#### web3.version.node

web3.version.node

// or async

web3.version.getNode(callback(error, result){ ... })

##### Returns
 `String` - The client/node version.

##### Example
```js
var version = web3.version.node;
console.log(version); // "Mist/v0.9.3/darwin/go1.4.1"
```

***
#### web3.version.network
web3.version.network

// or async

web3.version.getNetwork(callback(error, result){ ... })

##### Returns
 `String` - The network protocol version.

##### Example
```js
var version = web3.version.network;
console.log(version); // 54
```

***
#### web3.version.platon
web3.version.platon

// or async

web3.version.getPlaton(callback(error, result){ ... })

##### Returns
 `String` - The platon protocol version.

##### Example
```js
var version = web3.version.platon;
console.log(version); // 60
```

***
#### web3.isConnected
web3.isConnected() 

Should be called to check if a connection to a node exists

##### Parameters
none

##### Returns
 `Boolean`

##### Example
```js
if(!web3.isConnected()) {
  
   // show some dialog to ask the user to start a node
 } else {
 
   // start web3 filters, calls, etc
}
```

***
#### web3.setProvider
web3.setProvider(provider)

Should be called to set provider.

##### Parameters
none

##### Returns
 `undefined`

##### Example
```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')); // 8080 for cpp/AZ, 8545 for go/mist
```

***
#### web3.currentProvider
web3.currentProvider

Will contain the current provider, if one is set. This can be used to check if mist etc. has set already a provider.
##### Returns
 `Object` - The provider set or `null`;

##### Example
```js
// Check if mist etc. already set a provider
if(!web3.currentProvider)
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
```

***
#### web3.reset
web3.reset(keepIsSyncing)

Should be called to reset state of web3. Resets everything except manager. Uninstalls all filters. Stops polling.

##### Parameters
 1. `Boolean` - If `true` it will uninstall all filters, but will keep the [web3.platon.isSyncing()](#web3ethissyncing) polls

##### Returns
 `undefined`

##### Example
```js
web3.reset();
```

***
#### web3.sha3
web3.sha3(string [, options])

##### Parameters
1. `String` - The string to hash using the Keccak-256 SHA3 algorithm
2. `Object` - (optional) Set `encoding` to `hex` if the string to hash is encoded in hex. A leading `0x` will be automatically ignored.

##### Returns
 `String` - The Keccak-256 SHA3 of the given data.

##### Example
```js
var hash = web3.sha3("Some string to be hashed");
console.log(hash); // "0xed973b234cf2238052c9ac87072c71bcf33abc1bbd721018e0cca448ef79b379"
var hashOfHash = web3.sha3(hash, {encoding: 'hex'});
console.log(hashOfHash); // "0x85dd39c91a64167ba20732b228251e67caed1462d4bcf036af88dc6856d0fdcc"
```

***
#### web3.toHex
web3.toHex(mixed);

Converts any value into HEX.

##### Parameters
 1. `String|Number|Object|Array|BigNumber` - The value to parse to HEX. If its an object or array it will be `JSON.stringify` first. If its a BigNumber it will make it the HEX value of a number.

##### Returns
 `String` - The hex string of `mixed`.

##### Example
```js
var str = web3.toHex({test: 'test'});
console.log(str); // '0x7b2274657374223a2274657374227d'
```

***
#### web3.toAscii
web3.toAscii(hexString);

Converts a HEX string into a ASCII string.

##### Parameters
1. `String` - A HEX string to be converted to ascii.

##### Returns
 `String` - An ASCII string made from the given `hexString`.

##### Example
```js
var str = web3.toAscii("0x657468657265756d000000000000000000000000000000000000000000000000");
console.log(str); // "ethereum"
```

***
#### web3.fromAscii
web3.fromAscii(string);

Converts any ASCII string to a HEX string.

##### Parameters
1. `String` - An ASCII string to be converted to HEX.

##### Returns
 `String` - The converted HEX string.

##### Example
```js
var str = web3.fromAscii('ethereum');
console.log(str); // "0x657468657265756d"
```

***
#### web3.toDecimal
web3.toDecimal(hexString);

Converts a HEX string to its number representation.

##### Parameters
1. `String` - A HEX string to be converted to a number.

##### Returns
`Number` - The number representing the data `hexString`.

##### Example
```js
var number = web3.toDecimal('0x15');
console.log(number); // 21
```

***
#### web3.fromDecimal
web3.fromDecimal(number);
Converts a number or number string to its HEX representation.

##### Parameters
1. `Number|String` - A number to be converted to a HEX string.

##### Returns
 `String` - The HEX string representing of the given `number`.

##### Example
```js
var value = web3.fromDecimal('21');
console.log(value); // "0x15"
```

***
#### web3.fromVon
web3.fromVon(number, unit)

Converts a number of von into the following platon units:
- `von`
- `kvon`
- `mvon`
- `gvon`
- `microlat`
- `millilat`
- `lat`
- `klat`
- `mlat`
- `glat`
- `tlat`

##### Parameters
1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above ether units.

##### Returns
`String|BigNumber` - Either a number string, or a BigNumber instance, depending on the given `number` parameter.

##### Example
```js
var value = web3.fromVon('21000000000000', 'gvon');
console.log(value); // "21000"
```

***
#### web3.toVon
web3.toVon(number, unit)

```
'von':          '1',
'kvon':         '1000',
'mvon':         '1000000',
'gvon':         '1000000000',
'microlat':     '1000000000000',
'millilat':     '1000000000000000',
'lat':          '1000000000000000000',
'klat':         '1000000000000000000000',
'mlat':         '1000000000000000000000000',
'glat':         '1000000000000000000000000000',
'tlat':         '1000000000000000000000000000000'
```

Converts an platon unit into von. Possible units are:
- `von`
- `kvon`
- `mvon`
- `gvon`
- `microlat`
- `millilat`
- `lat`
- `klat`
- `mlat`
- `glat`
- `tlat`

##### Parameters
1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above lat units.

##### Returns
 `String|BigNumber` - Lat a number string, or a BigNumber instance, depending on the given `number` parameter.

##### Example
```js
var value = web3.toVon('1', 'lat');
console.log(value); // "1000000000000000000"
```

***
#### web3.toBigNumber
web3.toBigNumber(numberOrHexString); Converts a given number into a BigNumber instance. See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Parameters
1. `Number|String` - A number, number string or HEX string of a number.

##### Returns
`BigNumber` - A BigNumber instance representing the given value.

##### Example
```js
var value = web3.toBigNumber('200000000000000000000001');
console.log(value); // instanceOf BigNumber
console.log(value.toNumber()); // 2.0000000000000002e+23
console.log(value.toString(10)); // '200000000000000000000001'
```

***
#### web3.isAddress
web3.isAddress(HexString); Checks if the given string is an address.

##### Parameters
 1. `String` - A HEX string.

##### Returns
 `Boolean` - `false` if it's not on a valid address format. Returns `true` if it's an all lowercase or all uppercase valid address. If it's a mixed case address, it checks using `web3.isChecksumAddress()`.

##### Example
```js
var isAddress = web3.isAddress("0x8888f1f195afa192cfee860698584c030f4c9db1");
console.log(isAddress); // true
```

***
### web3.net
#### web3.net.listening
web3.net.listening

// or async

web3.net.getListening(callback(error, result){ ... })

This property is read only and says whether the node is actively listening for network connections or not.
##### Returns
`Boolean` - `true` if the client is actively listening for network connections, otherwise `false`.

##### Example
```js
var listening = web3.net.listening;
console.log(listening); // true of false
```

***
#### web3.net.peerCount
web3.net.peerCount

// or async

web3.net.getPeerCount(callback(error, result){ ... })

This property is read only and returns the number of connected peers.

##### Returns
 `Number` - The number of peers currently connected to the client.

##### Example
```js
var peerCount = web3.net.peerCount;
console.log(peerCount); // 4
```

***
### web3.platon
 Contains the ethereum blockchain related methods.

##### Example
```js
var platon = web3.platon;
```

***
#### web3.platon.gasPrice
web3.platon.gasPrice

// or async
web3.platon.getGasPrice(callback(error, result){ ... })

This property is read only and returns the current gas price.

The gas price is determined by the x latest blocks median gas price.

##### Returns
`BigNumber` - A BigNumber instance of the current gas price in wei.
See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Example
```js
var gasPrice = web3.platon.gasPrice;
console.log(gasPrice.toString(10)); // "10000000000000"
```

***
#### web3.platon.accounts
web3.platon.accounts

// or async

web3.platon.getAccounts(callback(error, result){ ... })

This property is read only and returns a list of accounts the node controls.

##### Returns
 `Array` - An array of addresses controlled by client.

##### Example
```js
var accounts = web3.platon.accounts;
console.log(accounts); // ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"] 
```

***
#### web3.platon.blockNumber
web3.platon.blockNumber

// or async

web3.platon.getBlockNumber(callback(error, result){ ... })

This property is read only and returns the current block number.

##### Returns
`Number` - The number of the most recent block.

##### Example
```js
var number = web3.platon.blockNumber;
console.log(number); // 2744
```

***
#### web3.platon.getBalance
web3.platon.getBalance(addressHexString [, defaultBlock] [, callback])

Get the balance of an address at a given block.

##### Parameters
1. `String` - The address to get the balance of.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - A BigNumber instance of the current balance for the given address in wei.
 See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).

##### Example
```js
var balance = web3.platon.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
console.log(balance.toNumber()); // 1000000000000
```

***
#### web3.platon.getStorageAt
web3.platon.getStorageAt(addressHexString, position [, defaultBlock] [, callback])

Get the storage at a specific position of an address.

##### Parameters
1. `String` - The address to get the storage from.
1. `Number` - The index position of the storage.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
`String` - The value in storage at the given position.

##### Example
```js
var state = web3.platon.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0);
console.log(state); // "0x03"
```

***
#### web3.platon.getCode
web3.platon.getCode(addressHexString [, defaultBlock] [, callback])

Get the code at a specific address.

##### Parameters
1. `String` - The address to get the code from.
1. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The data at given address `addressHexString`.

##### Example
```js
var code = web3.platon.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8");
console.log(code); // "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```

***
#### web3.platon.getBlock
web3.platon.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])

Returns a block matching the block number or block hash.

##### Parameters
1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Boolean` - (optional, default `false`) If `true`, the returned block will contain all transactions as objects, if `false` it will only contains the transaction hashes.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
##### Returns
- `Object` - The block object:
  - `number`: `Number` - the block number. `null` when its pending block.
  - `hash`: `String`, 32 Bytes - hash of the block. `null` when its pending block.
  - `parentHash`: `String`, 32 Bytes - hash of the parent block.
  - `nonce`: `String`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
  - `sha3Uncles`: `String`, 32 Bytes - SHA3 of the uncles data in the block.
  - `logsBloom`: `String`, 256 Bytes - the bloom filter for the logs of the block. `null` when its pending block.
  - `transactionsRoot`: `String`, 32 Bytes - the root of the transaction trie of the block
  - `stateRoot`: `String`, 32 Bytes - the root of the final state trie of the block.
  - `miner`: `String`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  - `difficulty`: `BigNumber` - integer of the difficulty for this block.
  - `totalDifficulty`: `BigNumber` - integer of the total difficulty of the chain until this block.
  - `extraData`: `String` - the "extra data" field of this block.
  - `size`: `Number` - integer the size of this block in bytes.
  - `gasLimit`: `Number` - the maximum gas allowed in this block.
  - `gasUsed`: `Number` - the total used gas by all transactions in this block.
  - `timestamp`: `Number` - the unix timestamp for when the block was collated.
  - `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  - `uncles`: `Array` - Array of uncle hashes.

##### Example
```js
var info = web3.platon.getBlock(3150);
console.log(info);
/*
{
  "number": 3,
  "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
  "nonce": "0xfb6e1a62d119228b",
  "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
  "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
  "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
  "difficulty": BigNumber,
  "totalDifficulty": BigNumber,
  "size": 616,
  "extraData": "0x",
  "gasLimit": 3141592,
  "gasUsed": 21662,
  "timestamp": 1429287689,
  "transactions": [
    "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
  ],
  "uncles": []
}
*/
```

***
#### web3.platon.getBlockTransactionCount
web3.platon.getBlockTransactionCount(hashStringOrBlockNumber [, callback])

Returns the number of transaction in a given block.

##### Parameters
1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Number` - The number of transactions in the given block.

##### Example
```js
var number = web3.platon.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```

***
##### web3.platon.getTransaction
web3.platon.getTransaction(transactionHash [, callback])

Returns a transaction matching the given transaction hash.

##### Parameters
1. `String` - The transaction hash.
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
- `Object` - A transaction object its hash `transactionHash`:
  - `hash`: `String`, 32 Bytes - hash of the transaction.
  - `nonce`: `Number` - the number of transactions made by the sender prior to this one.
  - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in. `null` when its pending.
  - `blockNumber`: `Number` - block number where this transaction was in. `null` when its pending.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block. `null` when its pending.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `value`: `BigNumber` - value transferred in Wei.
  - `gasPrice`: `BigNumber` - gas price provided by the sender in Wei.
  - `gas`: `Number` - gas provided by the sender.
  - `input`: `String` - the data sent along with the transaction.

##### Example
```js
var transaction = web3.platon.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
console.log(transaction);
/*
{
  "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "nonce": 2,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "transactionIndex": 0,
  "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f",
  "value": BigNumber,
  "gas": 314159,
  "gasPrice": BigNumber,
  "input": "0x57cb2fc4"
}
*/
```

***
#### web3.platon.getTransactionFromBlock
getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])

Returns a transaction based on a block hash or number and the transactions index position.

##### Parameters
1. `String` - A block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
1. `Number` - The transactions index position.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Object` - A transaction object, see [web3.platon.getTransaction](#web3ethgettransaction):

##### Example
```js
var transaction = web3.platon.getTransactionFromBlock('0x4534534534', 2);
console.log(transaction); // see web3.platon.getTransaction
```
***

#### web3.platon.getTransactionReceipt
web3.platon.getTransactionReceipt(hashString [, callback])

Returns the receipt of a transaction by transaction hash.
 
**Note** That the receipt is not available for pending transactions.

##### Parameters
1. `String` - The transaction hash.

1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
- `Object` - A transaction receipt object, or `null` when no receipt was found:
  - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in.
  - `blockNumber`: `Number` - block number where this transaction was in.
  - `transactionHash`: `String`, 32 Bytes - hash of the transaction.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `cumulativeGasUsed `: `Number ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `Number ` -  The amount of gas used by this specific transaction alone.
  - `contractAddress `: `String` - 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.
  - `logs `:  `Array` - Array of log objects, which this transaction generated.
  - `status `:  `String` - '0x0' indicates transaction failure , '0x1' indicates transaction succeeded. 

##### Example
```js
var receipt = web3.platon.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
console.log(receipt);
{
  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "contractAddress": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "cumulativeGasUsed": 314159,
  "gasUsed": 30234,
  "logs": [{
         // logs as returned by getFilterLogs, etc.
     }, ...],
  "status": "0x1"
}
```

***
#### web3.platon.getTransactionCount

web3.platon.getTransactionCount(addressHexString [, defaultBlock] [, callback])

Get the numbers of transactions sent from this address.

##### Parameters
1. `String` - The address to get the numbers of transactions from.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `Number` - The number of transactions sent from the given address.

##### Example
```js
var number = web3.platon.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```

***
#### web3.platon.sendTransaction
web3.platon.sendTransaction(transactionObject [, callback])

Sends a transaction to the network.

##### Parameters
 1. `Object` - The transaction object to send:
  - `from`: `String` - The address for the sending account. Uses the [web3.platon.defaultAccount](#web3ethdefaultaccount) property, if not specified.
  - `to`: `String` - (optional) The destination address of the message, left undefined for a contract-creation transaction.
  - `value`: `Number|String|BigNumber` - (optional) The value transferred for the transaction in Wei, also the endowment if it's a contract-creation transaction.
  - `gas`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The amount of gas to use for the transaction (unused gas is refunded).
  - `gasPrice`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The price of gas for this transaction in wei, defaults to the mean network gas price.
  - `data`: `String` - (optional) Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  - `nonce`: `Number`  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.
 If the transaction was a contract creation use [web3.platon.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.

##### Example
```js
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";
 web3.platon.sendTransaction({data: code}, function(err, transactionHash) {
  if (!err)
    console.log(transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
});
```
***

#### web3.platon.sendRawTransaction

web3.platon.sendRawTransaction(signedTransactionData [, callback])

Sends an already signed transaction. For example can be signed using: https://github.com/SilentCicero/ethereumjs-accounts

##### Parameters
1. `String` - Signed transaction data in HEX format
1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.

 If the transaction was a contract creation use [web3.platon.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.

##### Example
```js
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
 var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}
 var tx = new Tx(rawTx);
tx.sign(privateKey);
 var serializedTx = tx.serialize();
 //console.log(serializedTx.toString('hex'));
//f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
 web3.platon.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});
```

***
#### web3.platon.sign
web3.platon.sign(address, dataToSign, [, callback])
Signs data from a specific account. This account needs to be unlocked.

##### Parameters
1. `String` - Address to sign with.
1. `String` - Data to sign.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The signed data.
 After the hex prefix, characters correspond to ECDSA values like this:
```
r = signature[0:64]
s = signature[64:128]
v = signature[128:130]
```

Note that if you are using `ecrecover`, `v` will be either `"00"` or `"01"`. As a result, in order to use this value, you will have to parse it to an integer and then add `27`. This will result in either a `27` or a `28`.

##### Example
```js
var result = web3.platon.sign("0x135a7de83802408321b74c322f8558db1679ac20",
    "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49"); // second argument is web3.sha3("xyz")
console.log(result); // "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

***
#### web3.platon.call

web3.platon.call(callObject [, defaultBlock] [, callback])
 
Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.

##### Parameters
1. `Object` - A transaction object see [web3.platon.sendTransaction](#web3ethsendtransaction), with the difference that for calls the `from` property is optional as well.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - The returned data of the call, e.g. a codes functions return value.

##### Example
```js
var result = web3.platon.call({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```

***
#### web3.platon.estimateGas
web3.platon.estimateGas(callObject [, callback])

Executes a message call or transaction, which is directly executed in the VM of the node, but never mined into the blockchain and returns the amount of the gas used.

##### Parameters
 See [web3.platon.sendTransaction](#web3ethsendtransaction), except that all properties are optional.

##### Returns
 `Number` - the used gas for the simulated call/transaction.

##### Example
```js
var result = web3.platon.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```

***
#### web3.platon.filter
```js
// can be 'latest' or 'pending'
var filter = web3.platon.filter(filterString);
// OR object are log filter options
var filter = web3.platon.filter(options);
 // watch for changes
filter.watch(function(error, result){
  if (!error)
    console.log(result);
});
 // Additionally you can start watching right away, by passing a callback:
web3.platon.filter(options, function(error, result){
  if (!error)
    console.log(result);
});
```

##### Parameters
 1. `String|Object` - The string `"latest"` or `"pending"` to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
  * `fromBlock`: `Number|String` - The number of the earliest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `toBlock`: `Number|String` - The number of the latest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `address`: `String` - An address ~or a list of addresses~ to only get logs from particular account(s).
  * `topics`: `Array of Strings` - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use `null`, e.g. `[null, '0x00...']`. You can also pass another array for each topic with options for that topic e.g. `[null, ['option1', 'option2']]`

##### Returns
 `Object` - A filter object with the following methods:
   * `filter.get(callback)`: Returns all of the log entries that fit the filter.
  * `filter.watch(callback)`: Watches for state changes that fit the filter and calls the callback. See [this note](#using-callbacks) for details.
  * `filter.stopWatching()`: Stops the watch and uninstalls the filter in the node. Should always be called once it is done.

##### Watch callback return value
- `String` - When using the `"latest"` parameter, it returns the block hash of the last incoming block.
- `String` - When using the `"pending"` parameter, it returns a transaction hash of the most recent pending transaction.
- `Object` - When using manual filter options, it returns a log object as follows:
    - `logIndex`: `Number` - integer of the log index position in the block. `null` when its pending log.
    - `transactionIndex`: `Number` - integer of the transactions index position log was created from. `null` when its pending log.
    - `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from. `null` when its pending log.
    - `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending. `null` when its pending log.
    - `blockNumber`: `Number` - the block number where this log was in. `null` when its pending. `null` when its pending log.
    - `address`: `String`, 32 Bytes - address from which this log originated.
    - `data`: `String` - contains one or more 32 Bytes non-indexed arguments of the log.
    - `topics`: `Array of Strings` - Array of 0 to 4 32 Bytes `DATA` of indexed log arguments. (In *solidity*: The first topic is the *hash* of the signature of the event (e.g. `Deposit(address,bytes32,uint256)`), except if you declared the event with the `anonymous` specifier.)
    - `type`: `STRING` - `pending` when the log is pending. `mined` if log is already mined.
 **Note** For event filter return values see [Contract Events](#contract-events)

##### Example
```js
var filter = web3.platon.filter({toBlock:'pending'});
 filter.watch(function (error, log) {
  console.log(log); //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
});
 // get all past logs again.
var myResults = filter.get(function(error, logs){ ... });
 ...
 // stops and uninstalls the filter
filter.stopWatching();
```
***

#### web3.platon.contract

web3.platon.contract(abiArray)

Creates a contract object for a solidity contract, which can be used to initiate contracts on an address.

You can read more about events [here](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#example-javascript-usage).

##### Parameters
1. `Array` - ABI array with descriptions of functions and events of the contract.

##### Returns
 `Object` - A contract object, which can be initiated as follows:
```js
var MyContract = web3.platon.contract(abiArray);
 // instantiate by address
var contractInstance = MyContract.at(address);
 // deploy new contract
var contractInstance = MyContract.new([constructorParam1] [, constructorParam2], {data: '0x12345...', from: myAccount, gas: 1000000});
 // Get the data to deploy the contract manually
var contractData = MyContract.new.getData([constructorParam1] [, constructorParam2], {data: '0x12345...'});
// contractData = '0x12345643213456000000000023434234'
```
 And then you can either initiate an existing contract on an address,
or deploy the contract using the compiled byte code:
```js
// Instantiate from an existing address:
var myContractInstance = MyContract.at(myContractAddress);
 // Or deploy a new contract:
 // Deploy the contract asynchronous from Solidity file:
...
const fs = require("fs");
const solc = require('solc')
 let source = fs.readFileSync('nameContract.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts['nameContract'].interface;
let bytecode = compiledContract.contracts['nameContract'].bytecode;
let gasEstimate = web3.platon.estimateGas({data: bytecode});
let MyContract = web3.platon.contract(JSON.parse(abi));
 var myContractReturned = MyContract.new(param1, param2, {
   from:mySenderAddress,
   data:bytecode,
   gas:gasEstimate}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.
        // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
       // check address on the second call (contract deployed)
       } else {
           console.log(myContract.address) // the contract address
       }
        // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    }
  });
 // Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
var myContractInstance = MyContract.new(param1, param2, {data: bytecode, gas: 300000, from: mySenderAddress});
myContractInstance.transactionHash // The hash of the transaction, which created the contract
myContractInstance.address // undefined at start, but will be auto-filled later
```

##### Example
```js
// contract abi
var abi = [{
     name: 'myConstantMethod',
     type: 'function',
     constant: true,
     inputs: [{ name: 'a', type: 'string' }],
     outputs: [{name: 'd', type: 'string' }]
}, {
     name: 'myStateChangingMethod',
     type: 'function',
     constant: false,
     inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'int' }],
     outputs: []
}, {
     name: 'myEvent',
     type: 'event',
     inputs: [{name: 'a', type: 'int', indexed: true},{name: 'b', type: 'bool', indexed: false}]
}];
 // creation of contract object
var MyContract = web3.platon.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0xc4abd0339eb8d57087278718986382264244252f');
 // call constant function
var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 // send a transaction to a function
myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});
 // short hand style
web3.platon.contract(abi).at(address).myAwesomeMethod(...);
 // create filter
var filter = myContractInstance.myEvent({a: 5}, function (error, result) {
  if (!error)
    console.log(result);
    /*
    {
        address: '0x8718986382264244252fc4abd0339eb8d5708727',
        topics: "0x12345678901234567890123456789012", "0x0000000000000000000000000000000000000000000000000000000000000005",
        data: "0x0000000000000000000000000000000000000000000000000000000000000001",
        ...
    }
    */
});
```

***
#### Contract Methods
```js
// Automatically determines the use of call or sendTransaction based on the method type
myContractInstance.myMethod(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly calling this method
myContractInstance.myMethod.call(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly sending a transaction to this method
myContractInstance.myMethod.sendTransaction(param1 [, param2, ...] [, transactionObject] [, callback]);
 // Get the call data, so you can call the contract through some other means
// var myCallData = myContractInstance.myMethod.request(param1 [, param2, ...]);
var myCallData = myContractInstance.myMethod.getData(param1 [, param2, ...]);
// myCallData = '0x45ff3ff6000000000004545345345345..'
```

The contract object exposes the contract's methods, which can be called using parameters and a transaction object.

##### Parameters
 - `String|Number|BigNumber` - (optional) Zero or more parameters of the function. If passing in a string, it must be formatted as a hex number, e.g. "0xdeadbeef" If you have already created BigNumber object, then you can just pass it too.
- `Object` - (optional) The (previous) last parameter can be a transaction object, see [web3.platon.sendTransaction](#web3ethsendtransaction) parameter 1 for more. **Note**: `data` and `to` properties will not be taken into account.
- `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.platon.defaultBlock](#web3ethdefaultblock).
- `Function` - (optional) If you pass a callback as the last parameter the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.

##### Returns
 `String` - If its a call the result data, if its a send transaction a created contract address, or the transaction hash, see [web3.platon.sendTransaction](#web3ethsendtransaction) for details.

##### Example
```js
// creation of contract object
var MyContract = web3.platon.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000}, function(err, result){ ... });
```
***
#### Contract Events
```js
var event = myContractInstance.myEvent({valueA: 23} [, additionalFilterObject])
 // watch for changes
event.watch(function(error, result){
  if (!error)
    console.log(result);
});
 // Or pass a callback to start watching immediately
var event = myContractInstance.myEvent([{valueA: 23}] [, additionalFilterObject] , function(error, result){
  if (!error)
    console.log(result);
});
```
 
 You can use events like [filters](#web3ethfilter) and they have the same methods, but you pass different objects to create the event filter.

##### Parameters
 1. `Object` - Indexed return values you want to filter the logs by, e.g. `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`. By default all filter values are set to `null`. It means, that they will match any event of given type sent from this contract.
2. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. Also first topic is the signature of event.
3. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.

##### Callback return
 `Object` - An event object as follows:
 - `address`: `String`, 32 Bytes - address from which this log originated.
- `args`: `Object` - The arguments coming from the event.
- `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending.
- `blockNumber`: `Number` - the block number where this log was in. `null` when its pending.
- `logIndex`: `Number` - integer of the log index position in the block.
- `event`: `String` - The event name.
- `removed`: `bool` -  indicate if the transaction this event was created from was removed from the blockchain (due to orphaned block) or never get to it (due to rejected transaction).
- `transactionIndex`: `Number` - integer of the transactions index position log was created from.
- `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from.

##### Example
```js
var MyContract = web3.platon.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var myEvent = myContractInstance.myEvent({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
myEvent.watch(function(error, result){
   ...
});
 // would get all past logs again.
var myResults = myEvent.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
myEvent.stopWatching();
```
***
#### Contract allEvents
```js
var events = myContractInstance.allEvents([additionalFilterObject]);
 // watch for changes
events.watch(function(error, event){
  if (!error)
    console.log(event);
});
 // Or pass a callback to start watching immediately
var events = myContractInstance.allEvents([additionalFilterObject], function(error, log){
  if (!error)
    console.log(log);
});
```
 Will call the callback for all events which are created by this contract.

##### Parameters
 1. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. This method sets the topic to the signature of event, and does not support additional topics.
2. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.

##### Callback return
 `Object` - See [Contract Events](#contract-events) for more.

##### Example
```js
var MyContract = web3.platon.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var events = myContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
events.watch(function(error, result){
   ...
});
 // would get all past logs again.
events.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
events.stopWatching();
```

## PPOS ����ָ��

### ����
ͨ���� ppos �������Ĳ�����װ��һ�����ף�ִ�н��׵�call���û���send���á��Լ����call�Լ�send��Ҫ��һЩ����������

### ��Ҫʹ��
�ڵ���`const web3 = new Web3('http://127.0.0.1:6789');`ʵ����һ��web3��ʱ��ϵͳ���Զ��� web3 ���渽��һ�� ppos ����Ҳ����˵�����ֱ��ʹ��web3.ppos ���� ppos �е�һЩ�������������Ҫʹ��ppos�����������Ľ��ף���ô������ʵ����`web3`��ʱ�򴫽�ȥ�� provider����������Ҫ���ͽ���ǩ����Ҫ��˽Կ�Լ���id�����е���id��ͨ��rpc�ӿ�`admin_nodeInfo`���ص�`'chainId': xxx`��ȡ��

��Ȼ��Ϊ��������������ʵ�����ppos(������Ҫʵ��3��ppos����ͬ������ͬʱ���ͽ��׵���)���һ�����web3�����ϸ���һ��PPOS����(ע��ȫ���Ǵ�д)������Ե���`new PPOS(setting)`ʵ����һ��ppos����һ������ʾ�����£�

```JavaScript
(async () => {
    const Web3 = require('web3');
    const web3 = new Web3('http://192.168.120.164:6789');
    const ppos = web3.ppos; // ���������Ҷ��� ppos Ϊ���󡣾Ͳ�д�� web3.ppos �ˡ�

    // ���� ppos �����ã������������ױ���Ҫ����һ��
    // ������ʵ����web3��ʱ���Ѵ����� provider, ���Բ�����provider�ˡ�
    ppos.updateSetting({
        privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
        chainId: 100,
    })

    let data, reply;

    // �����Զ�����ʽ���ͽ��ף� 1000. createStaking() : ������Ѻ
    const benefitAddress = '0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA';
    const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
    const amount = '10000000000000000000000000000';
    const blsPubKey = 'd2459db974f49ca9cbf944d4d04c2d17888aef90858b62d6aec166341a6e886e8c0c0cfae9e469c2f618f5d9b7a249130d10047899da6154288c9cde07b576acacd75fef07ba0cfeb4eaa7510704e77a9007eff5f1a5f8d099e6ea664129780c';
    data = {
        funcType: 1000,
        typ: 0,
        benefitAddress: ppos.hexStrBuf(benefitAddress),
        nodeId: ppos.hexStrBuf(nodeId),
        externalId: 'externalId',
        nodeName: 'Me',
        website: 'www.platon.network',
        details: 'staking',
        amount: ppos.bigNumBuf(amount),
        programVersion: undefined, // rpc ��ȡ
        programVersionSign: undefined, // rpc ��ȡ
        blsPubKey: ppos.hexStrBuf(blsPubKey),
        blsProof: undefined, // rpc ��ȡ
    }
    let pv = await ppos.rpc('admin_getProgramVersion');
    let blsProof = await ppos.rpc('admin_getSchnorrNIZKProve');
    data.programVersion = pv.Version;
    data.programVersionSign = pv.Sign;
    data.blsProof = ppos.hexStrBuf(blsProof);
    reply = await ppos.send(data);
    console.log('createStaking params object reply: ', JSON.stringify(reply, null, 2));

    // ������������ʽ���ͽ��ף� 1000. createStaking() : ������Ѻ
    data = [
        1000,
        0,
        ppos.hexStrBuf(benefitAddress),
        ppos.hexStrBuf(nodeId),
        'externalId',
        'Me',
        'www.platon.network',
        'staking',
        ppos.bigNumBuf(amount),
        pv.Version,
        pv.Sign,
        ppos.hexStrBuf(blsPubKey),
        ppos.hexStrBuf(blsProof)
    ];
    // ���������ѵ��ù������׻�����������ҵ���ʧ��
    reply = await ppos.send(data);
    console.log('createStaking params array reply: ', reply);

    // �����Զ�����ʽ���ã� 1102. getCandidateList() : ��ѯ����ʵʱ�ĺ�ѡ���б�
    data = {
        funcType: 1102,
    }
    reply = await ppos.call(data);
    console.log('getCandidateList params object reply: ', reply);

    // ������������ʽ���ã� 1102. getCandidateList() : ��ѯ����ʵʱ�ĺ�ѡ���б�
    data = [1102];
    reply = await ppos.call(data);
    console.log('getCandidateList params array reply: ', reply);

    // ����ʵ����һ��ppos1�����������
    const ppos1 = new web3.PPOS({
        provider: 'http://127.0.0.1:6789',
        privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b',
        chainId: 100,
    })
    reply = await ppos1.call(data);
})()
```

��־��Ϣ������¡�Ϊ�˽�ʡƪ������ɾ��

```
createStaking params object reply:  {
  "blockHash": "0xdddd6b12919b69169b63d17fece52e8632fe3d8b48166c8b4ef8fdee39a1f35c",
  "blockNumber": "0xb",
  "contractAddress": null,
  "cumulativeGasUsed": "0x14f34",
  "from": "0x714de266a0effa39fcaca1442b927e5f1053eaa3",
  "gasUsed": "0x14f34",
  "logs": [
    {
      "address": "0x1000000000000000000000000000000000000002",
      "topics": [
        "0xd63087bea9f1800eed943829fc1d61e7869764805baa3259078c1caf3d4f5a48"
      ],
      "data": "0xe3a27b22436f6465223a302c2244617461223a22222c224572724d7367223a226f6b227d",
      "blockNumber": "0xb",
      "transactionHash": "0x4bee71e351076a81482e2576e469a8dfaa76da9b6cc848265c10968d6de67364",
      "transactionIndex": "0x0",
      "blockHash": "0xdddd6b12919b69169b63d17fece52e8632fe3d8b48166c8b4ef8fdee39a1f35c",
      "logIndex": "0x0",
      "removed": false,
      "dataStr": {
        "Code": 0,
        "Data": "",
        "ErrMsg": "ok"
      }
    }
  ],
  "logsBloom": "",
  "root": "0x3b7a41cea97f90196039586a3068f6a64c09aa7597898440c3c241a095e37984",
  "to": "0x1000000000000000000000000000000000000002",
  "transactionHash": "0x4bee71e351076a81482e2576e469a8dfaa76da9b6cc848265c10968d6de67364",
  "transactionIndex": "0x0"
}

createStaking params array reply:  { blockHash:
   '0x43351e4a9f1b7173552094bacfd5b6f84f18a6c7c0c02d8a10506e3a61041117',
  blockNumber: '0x10',
  contractAddress: null,
  cumulativeGasUsed: '0x14f34',
  from: '0x714de266a0effa39fcaca1442b927e5f1053eaa3',
  gasUsed: '0x14f34',
  logs:
   [ { address: '0x1000000000000000000000000000000000000002',
       topics: [Array],
       data:
        '0xf846b8447b22436f6465223a3330313130312c2244617461223a22222c224572724d7367223a22546869732063616e64696461746520697320616c7265616479206578697374227d',
       blockNumber: '0x10',
       transactionHash:
        '0xe5cbc728d6e284464c30ce6f0bbee5fb2b30351a591424f3a0edd37cc1bbdc05',
       transactionIndex: '0x0',
       blockHash:
        '0x43351e4a9f1b7173552094bacfd5b6f84f18a6c7c0c02d8a10506e3a61041117',
       logIndex: '0x0',
       removed: false,
       dataStr: [Object] } ],
  logsBloom:'',
  root:
   '0x45ffeda340b68a0d54c5556a51f925b0787307eab1fb120ed141fd8ba81183d4',
  to: '0x1000000000000000000000000000000000000002',
  transactionHash:
   '0xe5cbc728d6e284464c30ce6f0bbee5fb2b30351a591424f3a0edd37cc1bbdc05',
  transactionIndex: '0x0' }

getCandidateList params object reply:  { 
  Code: 0,
  Data:
   [ { candidate1 info... },
     { candidate2 info... },
     { candidate3 info... },
     { candidate4 info... } 
   ],
  ErrMsg: 'ok' }

getCandidateList params array reply:  { 
  Code: 0,
  Data:
   [ { candidate1 info... },
     { candidate2 info... },
     { candidate3 info... },
     { candidate4 info... } 
   ],
  ErrMsg: 'ok' }
```

### API ������ϸ˵��

#### `updateSetting(setting)`
���� ppos ����ĵ����ò����������ֻ��Ҫ����call���ã���ôֻ��Ҫ���� provider ���ɡ��������ʵ���� web3 ��ʱ���Ѿ������� provider����ô��ppos��providerĬ�Ͼ�����ʵ����web3��������provider����Ȼ��Ҳ������ʱ����provider��

�����Ҫ����send���ף���ô����provider��������Ҫ���뷢�ͽ�������Ҫ��˽Կ�Լ���id����Ȼ�����ͽ�����Ҫ���õ�gas, gasPrice, retry, interval���ĸ�������ϸ���`async send(params, [other])`˵����

�Դ���Ĳ����������ѡ�񲿷ָ��£��������һ��ppos���󣬷���ĳ������ʱ��ʹ��˽ԿA����ô���ڵ���`send(params, [other])`֮ǰִ�� `ppos.updateSetting({privateKey: youPrivateKeyA})`����˽Կ���ɡ�һ������֮�󣬽��Ḳ�ǵ�ǰ���ã�������÷��ͽ��׽ӿڣ���Ĭ�������һ�θ��µ����á�

���˵����
* setting Object
  * provider String ����
  * privateKey String ˽Կ
  * chainId String ��id
  * gas String ȼ��������ģ�������ʮ�������ַ��������� '0x76c0000'
  * gasPrice String ȼ�ϼ۸�������ʮ�������ַ��������� '0x9184e72a000000'
  * retry Number ��ѯ�����վݶ��������
  * interval Number ��ѯ�����վݶ���ļ������λΪms��

�޳��Ρ�

����ʾ��
```JavaScript
// ͬʱ���� privateKey��chainId
ppos.updateSetting({
    privateKey: 'acc73b693b79bbb56f89f63ccc3a0c00bf1b8380111965bfe8ab22e32045600c',
    chainId: 100,
})

// ֻ���� privateKey
ppos.updateSetting({
    privateKey: '9f9b18c72f8e5154a9c59af2a35f73d1bdad37b049387fc6cea2bac89804293b'
})
```

***

#### `getSetting()`
��ѯ�����õĲ���

�����

����
* setting Object
  * provider String ����
  * privateKey String ˽Կ
  * chainId String ��id
  * gas String ȼ���������
  * gasPrice String ȼ�ϼ۸�
  * retry Number ��ѯ�����վݶ��������
  * interval Number ��ѯ�����վݶ���ļ������λΪms��

����ʾ��
```JavaScript
let setting = ppos.getSetting();
```

***

#### `async rpc(method, [params])`
���� rpc ����һ��������������Ϊ�ڵ���ppos���ͽ��׵Ĺ����У���Щ������Ҫͨ��rpc����ȡ�����������װ��һ��rpc�����á�ע��˽ӿ�Ϊasync��������Ҫ��await���ص��ý�������򷵻�һ��Promise����

���˵����
* method String ������
* params Array ����rpc�ӿ���Ҫ�Ĳ�����������ô�rpc�˿ڲ���Ҫ��������˲�������ʡ�ԡ�
  
����
* reply rpc���÷��صĽ��

����ʾ��
```JavaScript
// ��ȡ����汾
let reply = await ppos.rpc('admin_getProgramVersion'); 

// ��ȡ�����˺�
let reply = await ppos.rpc('platon_accounts')

// ��ȡһ���˺ŵĽ��
let reply = await ppos.rpc('platon_getBalance', ["0x714de266a0effa39fcaca1442b927e5f1053eaa3","latest"])
```

***

#### `bigNumBuf(intStr)`
��һ���ַ�����ʮ���ƴ�����תΪһ��RLP�����ܽ��ܵ�buffer����һ��������������ΪJavaScript��������Χֻ������ʾΪ2^53��Ϊ��RLP�ܶԴ��������б��룬��Ҫ���ַ�����ʮ���ƴ�����ת��Ϊ��Ӧ��Buffer��ע�⣬�˽ӿ���ʱֻ�ܶ�ʮ���ƵĴ�����תΪBuffer�������ʮ�����Ƶ��ַ���������Ҫ�Ƚ���תΪʮ���Ƶ��ַ�����

���˵����
* intStr String �ַ���ʮ���ƴ�������
  
����
* buffer Buffer һ����������

����ʾ��
```JavaScript
let buffer = ppos.bigNumBuf('1000000000000000000000000000000000000000000'); 
```

***

#### `hexStrBuf(hexStr)`
��һ��ʮ�����Ƶ��ַ���תΪһ��RLP�����ܽ��ܵ�buffer����һ��������������ppos���ͽ��׵Ĺ����У����Ǻܶ������Ҫ��Ϊbytes���Ͷ�����string������ `nodeId 64bytes ����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)`����д����ʱ���nodeIdֻ�����ַ�������ʽ���֡���Ҫ����תΪһ�� 64 bytes �� Buffer��

ע�⣺����㴫��ȥ���ַ����� 0x ���� 0X ��ͷ��ϵͳ��Ĭ��Ϊ���Ǳ�ʾһ��ʮ�������ַ������Կ�ͷ����������ĸ���б��롣�����ȷʵҪ�� 0x ���� 0X ���룬����������ַ���ǰ���ټ�ǰ׺ 0x�����磬��Ҫ��ȫ�ַ��� 0x31c0e0 (4 bytes) ���б��룬��ô���봫�� 0x0x31c0e0 ��

���˵����
* hexStr String һ��ʮ�����Ƶ��ַ�����
  
����
* buffer Buffer һ����������

����ʾ��
```JavaScript
const nodeId = '80f1fcee54de74dbf7587450f31c31c0e057bedd4faaa2a10c179d52c900ca01f0fb255a630c49d83b39f970d175c42b12a341a37504be248d76ecf592d32bc0';
let buffer = ppos.hexStrBuf(nodeId); 
```

***

#### `async call(params)`
����һ�� ppos ��call��ѯ���á�����������������Ҫ���������Ƿ��ǲ�ѯ�����Ƿ��ͽ��ס���ο���ѡ�����������顣�����ѡ���������ô����Ҫʹ�ù涨���ַ���key�����Ƕ�keyҪ����˳�����������д`{a: 1, b: 'hello'}` ���� `{b: 'hello', a: 1}`��û���⡣

�����ѡ����������Ϊ��Σ���ô��**�����ϸ�����ε�˳�����ν������ŵ���������**��ע�⣬��һЩ�ַ����������Լ���Ҫ�����bytes����ѡ�������ṩ�Ľӿ�`bigNumBuf(intStr)`��`hexStrBuf(hexStr)`���н���ת���ٴ��롣

ע��˽ӿ�Ϊasync��������Ҫ��await���ص��ý�������򷵻�һ��Promise����

���˵����
* params Object | Array ���ò�����
  
����
* reply Object call���õķ��صĽ����ע�⣬���ѽ������صĽ��תΪ��Object����
  * Code Number ���÷����룬0��ʾ���ý��������
  * Data Array | Object | String | Number... ���ݵ��ý��������Ӧ����
  * ErrMsg String ������ʾ��Ϣ��

�Ե��� `1103. getRelatedListByDelAddr(): ��ѯ��ǰ�˻���ַ��ί�еĽڵ��NodeID����ѺId`����ӿڣ����˳����ϵ��£����������ʾ��

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1103)|
|addr|common.address(20bytes)|ί���˵��˻���ַ|

����ʾ��
```JavaScript
let params, reply;

// �Դ����������е���(����key��Ҫ��˳��)
params = {
    funcType: 1103,
    addr: ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")
}
reply = await ppos.call(params);

// �Դ������������е���
params = [1103, ppos.hexStrBuf("0xe6F2ce1aaF9EBf2fE3fbA8763bABaDf25e3fb5FA")];
reply = await ppos.call(params);
```

***

#### `async send(params, [other])`
����һ�� ppos ��send���ͽ��׵��á���������������Ҫ���������Ƿ��ǲ�ѯ�����Ƿ��ͽ��ס���ο���ѡ�����������顣��������뿴����`async call(params)`���á�

������һ�����ף������漰�����ý�����Ҫ��һЩ����������gas��gasPrice�������׷��ͳ�ȥ֮��Ϊ��ȷ�Ͻ����Ƿ���������Ҫ���ϵ�ͨ�����׹�ϣȥ��ѯ���ϵĽ��������и���ѯ���� retry ��ÿ����ѯ֮��ļ�� interval��

���������ᵽ�� gas, gasPrice, retry, interval ���ĸ����������other�����ָ������ʹ��otherָ���ġ����other���δָ������ʹ�õ��ú���ʱ��`updateSetting(setting)`ָ���Ĳ���������ʹ��Ĭ�ϵ���ֵ��

ע��˽ӿ�Ϊasync��������Ҫ��await���ص��ý�������򷵻�һ��Promise����

���˵����
* params Object|Array ���ò�����
* other Object ��������
  * gas String ȼ�����ƣ�Ĭ�� '0x76c0000'��
  * gasPrice String ȼ�ͼ۸�Ĭ�� '0x9184e72a000000'��
  * retry Number ��ѯ�����վݶ��������Ĭ�� 600 �Ρ�
  * interval Number ��ѯ�����վݶ���ļ������λΪms��Ĭ�� 100 ms��

����
* reply Object ���óɹ���send���÷�������ָ�����׵��վݶ���
  * status - Boolean: �ɹ��Ľ��׷���true�����EVM�ع��˸ý����򷵻�false
  * blockHash 32 Bytes - String: �������ڿ�Ĺ�ϣֵ
  * blockNumber - Number: �������ڿ�ı��
  * transactionHash 32 Bytes - String: ���׵Ĺ�ϣֵ
  * transactionIndex - Number: �����ڿ��е�����λ��
  * from - String: ���׷��ͷ��ĵ�ַ
  * to - String: ���׽��շ��ĵ�ַ�����ڴ�����Լ�Ľ��ף���ֵΪnull
  * contractAddress - String: ���ڴ�����Լ�Ľ��ף���ֵΪ�����ĺ�Լ��ַ������Ϊnull
  * cumulativeGasUsed - Number: �ý���ִ��ʱ���ڿ��gas�ۼ�������
  * gasUsed- Number: �ý��׵�gas����
  * logs - Array: �ý��ײ�������־��������
* errMsg String ����ʧ�ܣ�������ͽ��׷���֮��û�л�ִ���򷵻ش�����Ϣ`no hash`��������ͽ���֮���л�ִ�������ڹ涨��ʱ����û�в鵽�վݶ����򷵻� `getTransactionReceipt txHash ${hash} interval ${interval}ms by ${retry} retry failed`

�Ե��� `1004. delegate(): ����ί��`����ӿڣ����˳����ϵ��£����������ʾ��

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1004)|
|typ|uint16(2bytes)|��ʾʹ���˻����ɽ����˻������ֽ����ί�У�0: ���ɽ� 1: ���ֽ��|
|nodeId|64bytes|����Ѻ�Ľڵ��NodeId|
|amount|big.Int(bytes)|ί�еĽ��(������С��λ�㣬1LAT = 10^18 von)|


����ʾ��
```JavaScript
const nodeId = "f71e1bc638456363a66c4769284290ef3ccff03aba4a22fb60ffaed60b77f614bfd173532c3575abe254c366df6f4d6248b929cb9398aaac00cbcc959f7b2b7c";
let params, others, reply;

// �Դ����������е���(����key��Ҫ��˳��)
params = {
    funcType: 1004,
    typ: 0,
    nodeId: ppos.hexStrBuf(nodeId),
    amount: ppos.bigNumBuf("10000000000000000000000")
}
reply = await ppos.send(params);

// �Դ������������е���
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params);

// �Ҳ���Ĭ�ϵ���ѯ
other = {
    retry: 300, // ֻ��ѯ300��
    interval: 200 // ÿ����ѯ���200ms
}
params = [1004, 0, ppos.hexStrBuf(nodeId), ppos.bigNumBuf("10000000000000000000000")];
reply = await ppos.send(params, other);
```

### PPOS�ӿ������ϸ˵��

#### staking�ӿ�

**����staking��ؽӿڵĺ�Լ��ַΪ:** 0x1000000000000000000000000000000000000002

<a name="staking_contract_1"></a>
<code style="color: purple;">1000. createStaking() </code>: ������Ѻ



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1000)|
|typ|uint16(2bytes)|��ʾʹ���˻����ɽ����˻������ֽ������Ѻ��0: ���ɽ� 1: ���ֽ��|
|benefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|nodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|externalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|nodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|amount|*big.Int(bytes)|��Ѻ��von|
|programVersion|uint32|�������ʵ�汾������rpc��ȡ|
|programVersionSign|65bytes|�������ʵ�汾ǩ��������rpc��ȡ|
|blsPubKey|96bytes|bls�Ĺ�Կ|
|blsProof|64bytes|bls��֤��,ͨ����ȡ֤���ӿڻ�ȡ|

<a name="staking_contract_2"></a>
<code style="color: purple;">1001. editCandidate() </code>: �޸���Ѻ��Ϣ



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1001)|
|benefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|nodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|externalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|nodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|



<a name="staking_contract_3"></a>
<code style="color: purple;">1002. increaseStaking() </code>: ������Ѻ



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1002)|
|nodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|typ|uint16(2bytes)|��ʾʹ���˻����ɽ����˻������ֽ������Ѻ��0: ���ɽ� 1: ���ֽ��|
|amount|*big.Int(bytes)|���ֵ�von|






<a name="staking_contract_4"></a>
<code style="color: purple;">1003. withdrewStaking() </code>: ������Ѻ(һ���Է���ȫ����������ε���)



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1003)|
|nodeId|64bytes|����Ѻ�Ľڵ��NodeId|

<a name="staking_contract_5"></a>
<code style="color: purple;">1004. delegate() </code>: ����ί��



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1004)|
|typ|uint16(2bytes)|��ʾʹ���˻����ɽ����˻������ֽ����ί�У�0: ���ɽ� 1: ���ֽ��|
|nodeId|64bytes|����Ѻ�Ľڵ��NodeId|
|amount|*big.Int(bytes)|ί�еĽ��(������С��λ�㣬1LAT = 10**18 von)|

<a name="staking_contract_6"></a>
<code style="color: purple;">1005. withdrewDelegate() </code>: ����/����ί��(ȫ�����־��ǳ���)



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1005)|
|stakingBlockNum|uint64(8bytes)|������ĳ��node��ĳ����Ѻ��Ψһ��ʾ|
|nodeId|64bytes|����Ѻ�Ľڵ��NodeId|
|amount|*big.Int(bytes)|����ί�еĽ��(������С��λ�㣬1LAT = 10**18 von)|

<a name="staking_contract_7"></a>
<code style="color: purple;">1100. getVerifierList() </code>: ��ѯ��ǰ�������ڵ���֤�˶���



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1100)|

<a name="query_result">��ѯ���ͳһ��ʽ</a>

|����|����|˵��|
|---|---|---|
|Code|uint32| ��ʾppos���ú�Լ���صĴ�����|
|Data|string| json�ַ����Ĳ�ѯ����������ʽ�μ����²�ѯ��ؽӿڷ���ֵ |
|ErrMsg|string| ������ʾ��Ϣ|

> ע�����²�ѯ�ӿڣ�platon_call���õĽӿڣ������������������ز���������������ʽ����

���Σ� �б�

|����|����|˵��|
|---|---|---|
|NodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|StakingAddress|20bytes|������Ѻʱʹ�õ��˻�(����������Ѻ��Ϣֻ��������˻���������Ѻʱ��von�ᱻ�˻ظ��˻����߸��˻���������Ϣ��)|
|BenefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|StakingTxIndex|uint32(4bytes)|������Ѻʱ�Ľ�������|
|ProgramVersion|uint32|����Ѻ�ڵ��PlatON���̵���ʵ�汾��(��ȡ�汾�ŵĽӿ��������ṩ)|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|Shares|*big.Int(bytes)|��ǰ��ѡ���ܹ���Ѻ�ӱ�ί�е�von��Ŀ|
|ExternalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|NodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|Website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|Details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|ValidatorTerm|uint32(4bytes)|��֤�˵�����(�ڽ������ڵ�101����֤�˿�������Զ��0��ֻ���ڹ�ʶ�ֵ���֤��ʱ�Żᱻ��ֵ���ձ�ѡ����ʱҲ��0����������ʱ��+1)|

<a name="staking_contract_8"></a>
<code style="color: purple;">1101. getValidatorList() </code>: ��ѯ��ǰ��ʶ���ڵ���֤���б�



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1101)|

���Σ� �б�

|����|����|˵��|
|---|---|---|
|NodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|StakingAddress|20bytes|������Ѻʱʹ�õ��˻�(����������Ѻ��Ϣֻ��������˻���������Ѻʱ��von�ᱻ�˻ظ��˻����߸��˻���������Ϣ��)|
|BenefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|StakingTxIndex|uint32(4bytes)|������Ѻʱ�Ľ�������|
|ProgramVersion|uint32(4bytes)|����Ѻ�ڵ��PlatON���̵���ʵ�汾��(��ȡ�汾�ŵĽӿ��������ṩ)|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|Shares|*big.Int(bytes)|��ǰ��ѡ���ܹ���Ѻ�ӱ�ί�е�von��Ŀ|
|ExternalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|NodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|Website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|Details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|ValidatorTerm|uint32(4bytes)|��֤�˵�����(�ڽ������ڵ�101����֤�˿�������Զ��0��ֻ���ڹ�ʶ�ֵ���֤��ʱ�Żᱻ��ֵ���ձ�ѡ����ʱҲ��0����������ʱ��+1)|

<a name="staking_contract_9"></a>
<code style="color: purple;">1102. getCandidateList() </code>: ��ѯ����ʵʱ�ĺ�ѡ���б�



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1102)|

���Σ� �б�

|����|����|˵��|
|---|---|---|
|NodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|StakingAddress|20bytes|������Ѻʱʹ�õ��˻�(����������Ѻ��Ϣֻ��������˻���������Ѻʱ��von�ᱻ�˻ظ��˻����߸��˻���������Ϣ��)|
|BenefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|StakingTxIndex|uint32(4bytes)|������Ѻʱ�Ľ�������|
|ProgramVersion|uint32(4bytes)|����Ѻ�ڵ��PlatON���̵���ʵ�汾��(��ȡ�汾�ŵĽӿ��������ṩ)|
|Status|uint32(4bytes)|��ѡ�˵�״̬(״̬�Ǹ���uint32��32bit�����õģ���ͬʱ���ڶ��״̬��ֵΪ���ͬʱ���ڵ�״ֵ̬��ӡ�0: �ڵ���� (32��bitȫΪ0)�� 1: �ڵ㲻���� (ֻ�����һbitΪ1)�� 2�� �ڵ�����ʵ͵�û�дﵽ�Ƴ�������(ֻ�е����ڶ�bitΪ1)�� 4�� �ڵ��von���������Ѻ�ż�(ֻ�е�������bitΪ1)�� 8���ڵ㱻�ٱ�˫ǩ(ֻ�е�������bitΪ1)); 16: �ڵ�����ʵ��Ҵﵽ�Ƴ�����(��������λbitΪ1); 32: �ڵ�����������(ֻ�е�������λbitΪ1)��|
|StakingEpoch|uint32(4bytes)|��ǰ�����Ѻ���ʱ�Ľ�������|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|Shares|string(0xʮ�������ַ���)|��ǰ��ѡ���ܹ���Ѻ�ӱ�ί�е�von��Ŀ|
|Released|string(0xʮ�������ַ���)|������Ѻ�˻������ɽ�����������Ѻ��von|
|ReleasedHes|string(0xʮ�������ַ���)|������Ѻ�˻������ɽ�����ԥ����Ѻ��von|
|RestrictingPlan|string(0xʮ�������ַ���)|������Ѻ�˻������ֽ�����������Ѻ��von|
|RestrictingPlanHes|string(0xʮ�������ַ���)|������Ѻ�˻������ֽ�����ԥ����Ѻ��von|
|ExternalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|NodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|Website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|Details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|

<a name="staking_contract_10"></a>
<code style="color: purple;">1103. getRelatedListByDelAddr() </code>: ��ѯ��ǰ�˻���ַ��ί�еĽڵ��NodeID����ѺId



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(1103)|
|addr|common.address(20bytes)|ί���˵��˻���ַ|

���Σ� �б�

|����|����|˵��|
|---|---|---|
|Addr|20bytes|ί���˵��˻���ַ|
|NodeId|64bytes|��֤�˵Ľڵ�Id|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|


<a name="staking_contract_11"></a>
<code style="color: purple;">1104. getDelegateInfo() </code>: ��ѯ��ǰ����ί����Ϣ



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16|������������(1104)|
|stakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|delAddr|20bytes|ί�����˻���ַ|
|nodeId|64bytes|��֤�˵Ľڵ�Id|

���Σ� �б�

|����|����|˵��|
|---|---|---|
|Addr|20bytes|ί���˵��˻���ַ|
|NodeId|64bytes|��֤�˵Ľڵ�Id|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|DelegateEpoch|uint32(4bytes)|���һ�ζԸú�ѡ�˷����ί��ʱ�Ľ�������|
|Released|string(0xʮ�������ַ���)|����ί���˻������ɽ���������ί�е�von|
|ReleasedHes|string(0xʮ�������ַ���)|����ί���˻������ɽ�����ԥ��ί�е�von|
|RestrictingPlan|string(0xʮ�������ַ���)|����ί���˻������ֽ���������ί�е�von|
|RestrictingPlanHes|string(0xʮ�������ַ���)|����ί���˻������ֽ�����ԥ��ί�е�von|
|Reduction|string(0xʮ�������ַ���)|���ڳ����ƻ��е�von|

<a name="staking_contract_12"></a>
<code style="color: purple;">1105. getCandidateInfo() </code>: ��ѯ��ǰ�ڵ����Ѻ��Ϣ



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16|������������(1105)|
|nodeId|64bytes|��֤�˵Ľڵ�Id|

���Σ� �б�

|����|����|˵��|
|---|---|---|
|NodeId|64bytes|����Ѻ�Ľڵ�Id(Ҳ�к�ѡ�˵Ľڵ�Id)|
|StakingAddress|20bytes|������Ѻʱʹ�õ��˻�(����������Ѻ��Ϣֻ��������˻���������Ѻʱ��von�ᱻ�˻ظ��˻����߸��˻���������Ϣ��)|
|BenefitAddress|20bytes|���ڽ��ܳ��齱������Ѻ�����������˻�|
|StakingTxIndex|uint32(4bytes)|������Ѻʱ�Ľ�������|
|ProgramVersion|uint32(4bytes)|����Ѻ�ڵ��PlatON���̵���ʵ�汾��(��ȡ�汾�ŵĽӿ��������ṩ)|
|Status|uint32(4bytes)|��ѡ�˵�״̬(״̬�Ǹ���uint32��32bit�����õģ���ͬʱ���ڶ��״̬��ֵΪ���ͬʱ���ڵ�״ֵ̬��ӡ�0: �ڵ���� (32��bitȫΪ0)�� 1: �ڵ㲻���� (ֻ�����һbitΪ1)�� 2�� �ڵ�����ʵ͵�û�дﵽ�Ƴ�������(ֻ�е����ڶ�bitΪ1)�� 4�� �ڵ��von���������Ѻ�ż�(ֻ�е�������bitΪ1)�� 8���ڵ㱻�ٱ�˫ǩ(ֻ�е�������bitΪ1)); 16: �ڵ�����ʵ��Ҵﵽ�Ƴ�����(��������λbitΪ1); 32: �ڵ�����������(ֻ�е�������λbitΪ1)��|
|StakingEpoch|uint32(4bytes)|��ǰ�����Ѻ���ʱ�Ľ�������|
|StakingBlockNum|uint64(8bytes)|������Ѻʱ������߶�|
|Shares|string(0xʮ�������ַ���)|��ǰ��ѡ���ܹ���Ѻ�ӱ�ί�е�von��Ŀ|
|Released|string(0xʮ�������ַ���)|������Ѻ�˻������ɽ�����������Ѻ��von|
|ReleasedHes|string(0xʮ�������ַ���)|������Ѻ�˻������ɽ�����ԥ����Ѻ��von|
|RestrictingPlan|string(0xʮ�������ַ���)|������Ѻ�˻������ֽ�����������Ѻ��von|
|RestrictingPlanHes|string(0xʮ�������ַ���)|������Ѻ�˻������ֽ�����ԥ����Ѻ��von|
|ExternalId|string|�ⲿId(�г������ƣ�����������ȡ�ڵ�������Id)|
|NodeName|string|����Ѻ�ڵ������(�г������ƣ���ʾ�ýڵ������)|
|Website|string|�ڵ�ĵ�������ҳ(�г������ƣ���ʾ�ýڵ����ҳ)|
|Details|string|�ڵ������(�г������ƣ���ʾ�ýڵ������)|



#### ����ӿ�

**���� ������ؽӿڵĺ�Լ��ַΪ:** 0x1000000000000000000000000000000000000005

<a name="submitText"></a>
<code style="color: purple;">2000. submitText() </code>: �ύ�ı��᰸

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2000)|
|verifier|discover.NodeID(64bytes)|�ύ�᰸����֤��|
|pIDID|string(uint64)|PIPID|

<a name="submitVersion"></a>
<code style="color: purple;">2001. submitVersion() </code>: �ύ�����᰸



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2001)|
|verifier|discover.NodeID(64bytes)|�ύ�᰸����֤��|
|pIDID|string(uint64)|PIPID|
|newVersion|uint32(4bytes)|�����汾|
|endVotingRounds|uint64|ͶƱ��ʶ��������˵���������ύ�᰸�Ľ��ף����������ʱ�Ĺ�ʶ�����ʱround1�����᰸ͶƱ��ֹ��ߣ�����round1 + endVotingRounds�����ʶ�ֵĵ�230����ߣ�����һ����ʶ�ֳ���250��ppos�Ұ���ǰ20����ߣ�250��20���ǿ����õ� ��������0 < endVotingRounds <= 4840��ԼΪ2�ܣ�ʵ�������������ÿɼ��㣩����Ϊ������|


<a name="submitCancel"></a>
<code style="color: purple;">2005. submitCancel() </code>: �ύȡ���᰸



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2005)|
|verifier|discover.NodeID(64bytes)|�ύ�᰸����֤��|
|pIDID|string(uint64)|PIPID|
|endVotingRounds|uint64|ͶƱ��ʶ���������ο��ύ�����᰸��˵����ͬʱ���˽ӿ��д˲�����ֵ���ܴ��ڶ�Ӧ�����᰸�е�ֵ|
|tobeCanceledProposalID|common.hash(32bytes)|��ȡ���������᰸ID|


<a name="vote"></a>
<code style="color: purple;">2003. vote() </code>: ���᰸ͶƱ



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2003)|
|verifier|discover.NodeID(64bytes)|ͶƱ��֤��|
|proposalID|common.Hash(32bytes)|�᰸ID|
|option|uint8(1byte)|ͶƱѡ��|
|programVersion|uint32(4bytes)|�ڵ����汾����rpc��getProgramVersion�ӿڻ�ȡ|
|versionSign|common.VesionSign(65bytes)|����汾ǩ������rpc��getProgramVersion�ӿڻ�ȡ|

<a name="declareVersion"></a>
<code style="color: purple;">2004. declareVersion() </code>: �汾����



|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2004)|
|verifier|discover.NodeID(64bytes)|�����Ľڵ㣬ֻ������֤��/��ѡ��|
|programVersion|uint32(4bytes)|�����İ汾����rpc��getProgramVersion�ӿڻ�ȡ|
|versionSign|common.VesionSign(65bytes)|�����İ汾ǩ������rpc��getProgramVersion�ӿڻ�ȡ|



<a name="getProposal"></a>
<code style="color: purple;">2100. getProposal() </code>: ��ѯ�᰸



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|2100)|
|proposalID|common.Hash(32bytes)|�᰸ID|

���Σ�

Proposal�ӿ�ʵ�ֶ����json�ַ������ο��� [Proposal�ӿ� �᰸����](#Proposal)

<a name="getTallyResult"></a>
<code style="color: purple;">2101. getTallyResult() </code>: ��ѯ�᰸���



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2101)|
|proposalID|common.Hash(32bytes)|�᰸ID|

���Σ�
TallyResult�����json�ַ������ο���[TallyResult ͶƱ�������](#TallyResult)

<a name="listProposal"></a>

<code style="color: purple;">2102. listProposal() </code>: ��ѯ�᰸�б�



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2102)|

���Σ�

Proposal�ӿ�ʵ�ֶ����б��json�ַ������ο��� [Proposal�ӿ� �᰸����](#Proposal)



<a name="getActiveVersion"></a>

<code style="color: purple;">2103. getActiveVersion() </code>: ��ѯ�ڵ������Ч�汾



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2103)|

���Σ�

�汾�ŵ�json�ַ�������{65536}����ʾ�汾�ǣ�1.0.0��
����ʱ����Ҫ��verת��4���ֽڡ����汾���ڶ����ֽڣ�С�汾���������ֽڣ�patch�汾�����ĸ��ֽڡ�


<a name="getAccuVerifiersCount"></a>

<code style="color: purple;">2105. getAccuVerifiersCount() </code>: ��ѯ�᰸���ۻ���ͶƱ����



��Σ�

|����|����|˵��|
|---|---|---|
|funcType|uint16(2bytes)|������������(2105)|
|proposalID|common.Hash(32bytes)|�᰸ID|
|blockHash|common.Hash(32bytes)|��hash|

���Σ�
�Ǹ�[]uint16����

|����|����|˵��|
|---|---|---|
||uint16|�ۻ���ͶƱ����|
||uint16|�޳�Ʊ��|
||uint16|����Ʊ��|
||uint16|��ȨƱ��|


<a name="ProposalType"></a>

####  <span style="color: red;">**ProposalType �᰸���Ͷ���**</span>

|����|����|˵��|
|---|---|---|
|TextProposal|0x01|�ı��᰸|
|VersionProposal|0x02|�����᰸|
|CancelProposal|0x04|ȡ���᰸|

<a name="ProposalType"></a>

####  <span style="color: red;">**ProposalStatus �᰸״̬����**</span>

���ı��᰸��˵���У�0x01,0x02,0x03����״̬��
�������᰸��˵���У�0x01,0x03,0x04,0x05,0x06����״̬��
��ȡ���᰸��˵���У�0x01,0x02,0x03����״̬��

|����|����|˵��|
|---|---|---|
|Voting|0x01|ͶƱ��|
|Pass|0x02|ͶƱͨ��|
|Failed|0x03|ͶƱʧ��|
|PreActive|0x04|�������᰸��Ԥ��Ч|
|Active|0x05|�������᰸����Ч|
|Canceled|0x06|�������᰸����ȡ��|

<a name="VoteOption"></a>

####  <span style="color: red;">**VoteOption ͶƱѡ���**</span>

|����|����|˵��|
|---|---|---|
|Yeas|0x01|֧��|
|Nays|0x02|����|
|Abstentions|0x03|��Ȩ|

<a name="Proposal"></a>

####  <span style="color: red;">**Proposal�ӿ� �᰸����**</span>

����TextProposal���ı��᰸

- �ֶ�˵����

|�ֶ�|����|˵��|
|---|---|---|
|ProposalID|common.Hash(32bytes)|�᰸ID|
|Proposer|common.NodeID(64bytes)|�᰸�ڵ�ID|
|ProposalType|byte|�᰸���ͣ� 0x01���ı��᰸�� 0x02�������᰸��0x03�����᰸��0x04ȡ���᰸��|
|PIPID|string|�᰸PIPID|
|SubmitBlock|8bytes|�ύ�᰸�Ŀ��|
|EndVotingBlock|8bytes|�᰸ͶƱ�����Ŀ�ߣ�ϵͳ����SubmitBlock|


����VersionProposal�������᰸

- �ֶ�˵����

|�ֶ�|����|˵��|
|---|---|---|
|ProposalID|common.Hash(32bytes)|�᰸ID|
|Proposer|common.NodeID(64bytes)|�᰸�ڵ�ID|
|ProposalType|byte|�᰸���ͣ� 0x01���ı��᰸�� 0x02�������᰸��0x03�����᰸��0x04ȡ���᰸��|
|PIPID|string|�᰸PIPID|
|SubmitBlock|8bytes|�ύ�᰸�Ŀ��|
|EndVotingRounds|8bytes|ͶƱ�����Ĺ�ʶ��������|
|EndVotingBlock|8bytes|�᰸ͶƱ�����Ŀ�ߣ�ϵͳ����SubmitBlock��EndVotingRounds���|
|ActiveBlock|8bytes|�᰸��Ч��ߣ�ϵͳ����EndVotingBlock���|
|NewVersion|uint|�����汾|


����CancelProposal��ȡ���᰸

- �ֶ�˵����

|�ֶ�|����|˵��|
|---|---|---|
|ProposalID|common.Hash(32bytes)|�᰸ID|
|Proposer|common.NodeID(64bytes)|�᰸�ڵ�ID|
|ProposalType|byte|�᰸���ͣ� 0x01���ı��᰸�� 0x02�������᰸��0x03�����᰸��0x04ȡ���᰸��|
|PIPID|string|�᰸PIPID|
|SubmitBlock|8bytes|�ύ�᰸�Ŀ��|
|EndVotingRounds|8bytes|ͶƱ�����Ĺ�ʶ��������|
|EndVotingBlock|8bytes|�᰸ͶƱ�����Ŀ�ߣ�ϵͳ����SubmitBlock��EndVotingRounds���|
|TobeCanceled|common.Hash(32bytes)|�᰸Ҫȡ���������᰸ID|


<a name="Vote"></a>

####  <span style="color: red;">**Vote ͶƱ����**</span>

|�ֶ�|����|˵��|
|---|---|---|
|voter|64bytes|ͶƱ��֤��|
|proposalID|common.Hash(32bytes)|�᰸ID|
|option|VoteOption|ͶƱѡ��|

<a name="TallyResult"></a>

####  <span style="color: red;">**TallyResult ͶƱ�������**</span>

|�ֶ�|����|˵��|
|---|---|---|
|proposalID|common.Hash(32bytes)|�᰸ID|
|yeas|uint16(2bytes)|�޳�Ʊ|
|nays|uint16(2bytes)|����Ʊ|
|abstentions|uint16(2bytes)|��ȨƱ|
|accuVerifiers|uint16(2bytes)|������ͶƱ������ͶƱ�ʸ����֤������|
|status|byte|״̬|
|canceledBy|common.Hash(32bytes)|��status=0x06ʱ����¼����ȡ����ProposalID|

#### �ٱ��ͷ��ӿ�

**���� slashing��ؽӿڵĺ�Լ��ַΪ:** 0x1000000000000000000000000000000000000004

<a name="ReportDuplicateSign"></a>
<code style="color: purple;">3000. ReportDuplicateSign() </code>: �ٱ�˫ǩ



| ����     | ����   | ����                                    |
| -------- | ------ | --------------------------------------- |
| funcType | uint16(2bytes) | ������������(3000)                    |
| typ      | uint8         | ����˫ǩ���ͣ�<br />1��prepareBlock��2��prepareVote��3��viewChange |
| data     | string | ����֤�ݵ�jsonֵ����ʽ����[RPC�ӿ�Evidences][evidences_interface] |

<a name="CheckDuplicateSign"></a>
<code style="color: purple;">3001. CheckDuplicateSign() </code>: ��ѯ�ڵ��Ƿ��ѱ��ٱ�����ǩ

��Σ�

| ����        | ����           | ����                                                         |
| ----------- | -------------- | ------------------------------------------------------------ |
| funcType    | uint16(2bytes) | ������������(3001)                                         |
| typ         | uint32         | ����˫ǩ���ͣ�<br />1��prepareBlock��2��prepareVote��3��viewChange |
| addr        | 20bytes        | �ٱ��Ľڵ��ַ                                               |
| blockNumber | uint64         | ��ǩ�Ŀ��                                                   |

�زΣ�

| ����   | ����           |
| ------ | -------------- |
| 16���� | �ٱ��Ľ���Hash |



#### ���ֽӿ�

**���� ������ؽӿڵĺ�Լ��ַΪ:** 0x1000000000000000000000000000000000000001

<a name="CreateRestrictingPlan"></a>
<code style="color: purple;">4000. CreateRestrictingPlan() </code>: �������ּƻ�



��Σ�

| ����    | ����           | ˵��                                                         |
| ------- | -------------- | ------------------------------------------------------------ |
| account | 20bytes | `�����ͷŵ����˻�`                                           |
| plan    | []RestrictingPlan | plan Ϊ RestrictingPlan ���͵��б����飩��RestrictingPlan �������£�<br>type RestrictingPlan struct { <br/>    Epoch uint64<br/>    Amount��\*big.Int<br/>}<br/>���У�Epoch����ʾ�������ڵı�������ÿ���������ڳ������ĳ˻���ʾ��Ŀ������߶����ͷ��������ʽ�Epoch \* ÿ���ڵ�����������Ҫ������߲���������߶ȡ�<br>Amount����ʾĿ�������ϴ��ͷŵĽ� |

<a name="GetRestrictingInfo"></a>
<code style="color: purple;">4100. GetRestrictingInfo() </code>: ��ȡ������Ϣ��

ע�����ӿ�֧�ֻ�ȡ��ʷ���ݣ�����ʱ�ɸ�����ߣ�Ĭ������²�ѯ���¿�����ݡ�



��Σ�

| ����    | ����    | ˵��               |
| ------- | ------- | ------------------ |
| account | 20bytes | `�����ͷŵ����˻�` |

���Σ�

���ز���Ϊ�����ֶε� json ��ʽ�ַ���

| ����    | ����            | ˵��                                                         |
| ------- | --------------- | ------------------------------------------------------------ |
| balance | string(0xʮ�������ַ���) | ���������-���ͷŽ��                                                     |
| pledge    | string(0xʮ�������ַ���) |��Ѻ/��Ѻ��� |
| debt  | string(0xʮ�������ַ���)            | Ƿ�ͷŽ��                                                 |
| plans    | bytes           | ���ַ�¼��Ϣ��json���飺[{"blockNumber":"","amount":""},...,{"blockNumber":"","amount":""}]�����У�<br/>blockNumber��\*big.Int���ͷ�����߶�<br/>amount��\string(0xʮ�������ַ���)���ͷŽ�� |

### ����
����Ը���test��Ŀ¼����config.default.js�ļ�Ϊģ�����ú����ñ�����ͬ��Ŀ¼��config.js�ļ���Ȼ��ִ��`npm run ppos`ִ�е�Ԫ���ԡ��������ʾ����ο�testĿ¼����д�ĵ�Ԫ����ppos.js�ļ�