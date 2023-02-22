const express = require("express");
const router = express.Router();
const { main } = require("./../app");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const register = require("../lib/registration");
const login = require("../lib/login");

var contract;
main().then((cnt) => (contract = cnt));

router.use(bodyParser.json());
router.use(cookieParser());

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

router.get("/getData", async function (req, res, next) {
  try {
    console.log("\n--> Evaluate Transaction: DeleteAsset, function deletese");
    let result = await contract.submitTransaction("DeleteAsset", "Reg-user02");
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    res.send(result.toString());
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/", async (req, res) => {
  console.log("Get Request");
  console.log(
    "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
  );
  let result = await contract.evaluateTransaction("GetAllAssets");
  res.send(`*** Result: ${prettyJSONString(result.toString())}`);
});

router.post("/registration", async (req, res) => {
  const { identifier, metadata } = req.body;
  const response = await register(identifier, metadata, contract);
  res.json(response);
});

router.post("/login", async (req, res) => {
  const { identifier, privateKey } = req.body;
  const response = await login(identifier, privateKey);
  res.cookie("loginCookie", JSON.stringify(response.cookie)).json(response);
});

module.exports = router;
