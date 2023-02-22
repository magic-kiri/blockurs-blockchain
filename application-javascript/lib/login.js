const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { loginQuery } = require("./query");

const login = async (identifier, privateKey) => {
  const res = await apiCall(loginQuery, {
    _eq: identifier,
  });

  const privateKeyFromDB = res?.data?.User[0].privateKey;
  let response = {};

  if (privateKeyFromDB !== undefined && privateKeyFromDB === privateKey) {
    console.log("Key Matched!");
    response.status = true;
    const randomNumber = Math.random().toString();
    const cs = new CryptoSecurity();
    try {
      response.cookie = {
        body: randomNumber,
        signature: cs.signing(randomNumber, privateKey, identifier),
      };
    } catch (err) {
      console.log("ERROR in signing>>");
      console.log(err);
    }
  } else {
    response.status = false;
  }
  return response;
};

module.exports = login;
