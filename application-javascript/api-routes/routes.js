const express = require("express");
const router = express.Router();
const { main } = require("./../app");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const register = require("../lib/registration");
const login = require("../lib/login");
const { getAllUser, pushReputationScore } = require("../lib/providing");
const validate = require("../lib/authentication");
const reputationScoreQuery = require("../lib/reputationQuery");

var contract;
main().then((cnt) => (contract = cnt));

router.use(bodyParser.json());
router.use(cookieParser());
// router.use(
//   cors({
//     origin: ["http://localhost:3001"],
//   })
// );

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

router.get("/delete/:identifier", async function (req, res, next) {
  try {
    console.log("\n--> Evaluate Transaction: DeleteAsset, function deletese");
    let result = await contract.submitTransaction(
      "DeleteAsset",
      req.params.identifier
    );
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
  const query = { fileType: "registered_user" };

  let result = await contract.evaluateTransaction("GetAllUser");
  res.send(`*** Result: ${prettyJSONString(result.toString())}`);
});

router.post("/registration", async (req, res) => {
  const { identifier, metadata, passHash, name } = req.body;
  const response = await register(
    identifier,
    metadata,
    passHash,
    name,
    contract
  );
  res.json(response);
});

router.post("/login", async (req, res) => {
  const { identifier, passHash } = req.body;
  const response = await login(identifier, passHash);
  console.log(response);
  res.cookie("loginCookie", JSON.stringify(response.cookie));
  res.json(response);
});

router.get("/getUserList", async (req, res) => {
  const result = await getAllUser(contract);
  res.json(result);
});

router.post("/pushScores", async (req, res) => {
  console.log("Triggering /pushScores");
  const { data, providerIdentifier, type } = req.body;
  console.log(req.body);
  const response = await pushReputationScore(
    contract,
    type,
    providerIdentifier,
    data
  );

  res.json(response);
});

router.get("/read", async (req, res) => {
  const resp = await contract.evaluateTransaction("ReadAsset", "Score-user02");
  return res.send(resp);
});

router.get("/getReputationScore", async (req, res) => {
  try {
    const loginCookie = JSON.parse(req.cookies.loginCookie);
    // console.log(loginCookie);
    const { authenticated } = await validate(loginCookie);
    console.log({ authenticated });
    if (!authenticated) {
      res.send("Please Authenticate!");
    } else {
      const response = await reputationScoreQuery(
        contract,
        loginCookie.identifier
      );
      console.log(response);
      res.json(response);
    }
  } catch (err) {
    console.log("ERROR");
    res.json({ error: err });
  }
});

module.exports = router;
