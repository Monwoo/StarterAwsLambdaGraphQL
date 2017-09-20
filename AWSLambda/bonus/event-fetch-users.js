module.exports = {
    queryStringParameters: {
        query: '{ users { firstname } }'
    },
    httpMethod: 'GET', // graphql-server-lambda methode checking with httpMethod
    method: 'GET', // AWS methode (TODO : remap in server side or AWS ok ?)
};
