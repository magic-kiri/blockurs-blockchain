const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { registrationQuery } = require("./query");
const sha256 = require("js-sha256");

const register = async (identifier, metadata, contract) => {
  const cs = new CryptoSecurity();
  const { publicKey, privateKey } = cs.getKey(identifier);

  const { data } = await apiCall(registrationQuery, {
    identifier,
    metadata: JSON.stringify(metadata),
    publicKey,
    privateKey,
  });
  const index = data.insert_User_one.index;

  const metaHash = sha256(JSON.stringify(metadata));

  try {
    console.log(
      "\n--> Submit Transaction: CreateUser, creates new asset with index, identifier, publicKey, metaHash"
    );
    result = await contract.submitTransaction(
      "CreateUser",
      index,
      identifier,
      publicKey,
      metaHash,
      "registered_user"
    );
    console.log("*** Result: committed");
    if (`${result}` !== "") {
      console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    }
  } catch (err) {
    console.log("EROOR>>>>:::: ", err);
  }

  return { privateKey, publicKey };
};
module.exports = register;

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}
