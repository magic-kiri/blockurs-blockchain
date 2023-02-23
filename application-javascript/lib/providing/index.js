exports.getAllUser = async (contract) => {
  let result = await contract.evaluateTransaction("GetAllUser");
  const resultArray = JSON.parse(result);
  const res = resultArray.map((record) => {
    return {
      identifier: record.Record.identifier,
      publicKey: record.Record.publicKey,
    };
  });
  return res;
};

exports.pushReputationScore = async (
  contract,
  type,
  providerIdentifier,
  data
) => {
  const response = data.map(async ({ userIdentifier, encryptedScore }) => {
    const res = await contract.submitTransaction(
      "AddScore",
      type,
      userIdentifier,
      encryptedScore,
      providerIdentifier
    );
    console.log(res);
    return res;
  });
  return await Promise.all(response);
};
