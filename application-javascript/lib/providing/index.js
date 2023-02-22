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
