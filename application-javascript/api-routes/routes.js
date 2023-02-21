const express = require("express");
const router = express.Router();
const { main } = require("./../app");

var contract;
main().then((cnt) => (contract = cnt));

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

router.get("/getData", async function (req, res, next) {
  res.send("HII");
  console.log(contract);
});

router.get("/", async (req, res) => {
  console.log("Get Request");
  console.log(
    "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
  );
  let result = await contract.evaluateTransaction("GetAllAssets");
  res.send(`*** Result: ${prettyJSONString(result.toString())}`);
});

module.exports = router;
