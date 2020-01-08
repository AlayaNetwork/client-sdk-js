var testMethod = require("./helpers/test.method.js");
var Platon = require("../packages/web3-eth");

var platon = new Platon();

var method = "getCode";

var tests = [
    {
        args: ["0x4E65FDa2159562a496F9f3522f89122A3088497a"], // checksum address
        formattedArgs: [
            "0x4e65fda2159562a496f9f3522f89122a3088497a",
            platon.defaultBlock
        ],
        result:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        formattedResult:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        call: "platon_" + method
    },
    {
        args: ["0x47d33b27bb249a2dbab4c0612bf9caf4c1950855"],
        formattedArgs: [
            "0x47d33b27bb249a2dbab4c0612bf9caf4c1950855",
            platon.defaultBlock
        ],
        result:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        formattedResult:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        call: "platon_" + method
    },
    {
        args: ["0x47d33b27bb249a2dbab4c0612bf9caf4c1950855", 2],
        formattedArgs: ["0x47d33b27bb249a2dbab4c0612bf9caf4c1950855", "0x2"],
        result:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        formattedResult:
            "0x47d33b27bb249a2dbab4c0612bf9caf4747d33b27bb249a2dbab4c0612bf9cafd33b27bb249a2dbab4c0612bf9caf4c1950855",
        call: "platon_" + method
    }
];

testMethod.runTests("platon", method, tests);
