const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { loginQuery } = require("./query");

const login = async (identifier, passHash) => {
  const res = await apiCall(loginQuery, {
    _eq: identifier,
  });

  const passHashFromDB = res?.data?.User[0].passHash;
  let response = {};
  if (passHashFromDB === passHash) {
    console.log("Key Matched!");
    response.status = true;
    const randomNumber = Math.random().toString();
    const cs = new CryptoSecurity();
    const { privateKey, name } = res?.data?.User[0];
    try {
      response.cookie = {
        body: randomNumber,
        publicKey: res?.data?.User[0].publicKey,
        identifier,
        signature: cs.signing(randomNumber, privateKey, identifier),
        name,
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
