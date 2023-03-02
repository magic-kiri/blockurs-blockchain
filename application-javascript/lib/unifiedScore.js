const { CryptoSecurity } = require("./crypto");
const apiCall = require("./dbCall");
const { userCountQuery } = require("./query");

// function sigmoid(A, D, x) {
//   return A / (1 + Math.pow(Math.E, -D * x));
// }

// function convertUnboundToBound(reputation) {
//   const amplitude = 100;
//   const D = 0.01;
//   return sigmoid(amplitude, D, reputation);
// }

exports.calculateUnifiedScore = async (scores) => {
  const { eCommerceEncryptedScores, financialEncryptedScores } = scores;
  let eCommerceScore = await calculateDomainScore(
    eCommerceEncryptedScores,
    "eCommerce"
  );
  let financialScore = await calculateDomainScore(
    financialEncryptedScores,
    "financial"
  );

  if (isNaN(eCommerceScore)) {
    eCommerceScore = financialScore;
  }

  if (isNaN(financialScore)) {
    financialScore = eCommerceScore;
  }

  const Ce = 0.5,
    Cf = 0.5;
  const urs = Ce * eCommerceScore + Cf * financialScore;
  console.log("Score Production");
  console.log({ unifiedScore: urs, eCommerceScore, financialScore });
  return { unifiedScore: urs, eCommerceScore, financialScore };
};

async function calculateDomainScore(scores, domain) {
  let scoreValue = 0;
  let totalUser = 0;
  const cs = new CryptoSecurity();
  const scoreList = Object.entries(scores);
  // console.log(scoreList);
  for (let [providerIdentifier, encryptedScore] of scoreList) {
    // WE SHOULD USE DECRYPTION!!!
    const score = Number(encryptedScore);
    const { count: numberOfUsers } = (
      await apiCall(userCountQuery, {
        _eq: providerIdentifier,
      })
    )?.data?.ReputationScore_aggregate?.aggregate;
    totalUser += numberOfUsers;
    scoreValue += numberOfUsers * score;
  }
  return scoreValue / totalUser;
}
