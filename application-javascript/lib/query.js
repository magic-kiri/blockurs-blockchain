exports.registrationQuery = `
    mutation MyMutation($identifier: String = "user02", $metadata: String = "meta", $privateKey: String = "private02", $publicKey: String = "public02") {
        insert_User_one(object: {identifier: $identifier, metadata: $metadata, privateKey: $privateKey, publicKey: $publicKey}) {
        createdAt
        identifier
        metadata
        privateKey
        publicKey
        index
        }
    }
`;

exports.loginQuery = `
    query MyQuery($_eq: String = "") {
        User(where: {identifier: {_eq: $_eq}}) {
        index
        identifier
        privateKey
        }
    }
`;
