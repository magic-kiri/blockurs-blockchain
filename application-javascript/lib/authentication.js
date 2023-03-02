const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { loginQuery } = require("./query");
const validate = async ({ body, identifier, publicKey, signature }) => {
  try {
    console.log("validating");
    const res = await apiCall(loginQuery, {
      _eq: identifier,
    });

    const publicKeyFromDB = res?.data?.User[0].publicKey;
    const privateKey = res?.data?.User[0].privateKey;
    if (publicKeyFromDB != publicKey) return { authenticated: false };
    const cs = new CryptoSecurity();
    return {
      authenticated: cs.verify(Buffer.from(signature), body, publicKey),
      publicKey,
      privateKey,
    };
  } catch (err) {
    console.log(err);
    return { authenticated: false };
  }
};

module.exports = validate;
