const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { loginQuery } = require("./query");
const { calculateUnifiedScore } = require("./unifiedScore");

const reputationScoreQuery = async (
  contract,
  identifier
) => {
  console.log("Query");
  let result = await contract.evaluateTransaction("GetScoreByID", identifier);
  scores = JSON.parse(result);
  console.log(scores);
  const { unifiedScore, eCommerceScore, financialScore } =
    await calculateUnifiedScore(scores);
  scores.unifiedScore = unifiedScore;
  scores.eCommerceScore = eCommerceScore;
  scores.financialScore = financialScore;
  scores.timeStamp = new Date();

  return scores;
};

module.exports = reputationScoreQuery;
