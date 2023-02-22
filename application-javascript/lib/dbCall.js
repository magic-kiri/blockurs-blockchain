// import fetch from "node-fetch";q

const fetch = require("node-fetch");

const apiCall = async (query, variables) => {
  //  Bad Practice! Urls should be used as a env variable!

  console.log("API CALL WITH", variables);
  const response = await fetch("https://blockurs.hasura.app/v1/graphql", {
    method: "post",
    body: JSON.stringify({ query, variables }),
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "blockursdb",
    },
  });
  return await response.json();
};

module.exports = apiCall;
