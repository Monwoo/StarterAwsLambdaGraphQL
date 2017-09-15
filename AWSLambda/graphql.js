// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

var server = require("apollo-server-lambda"),
    myGraphQLSchema = require("./schema");

exports.graphqlHandler = function(event, context, callback)  {
    const headers = event.headers,
        functionName = context.functionName;

    const callbackFilter = function(error, output) {
        // For Dev without credentials checkings
        output.headers['Access-Control-Allow-Origin'] = '*';
        // For production with credentials checkings :
        // if (requestOrigin === CORS_ORIGIN) {
        //     output.headers['Access-Control-Allow-Origin'] = CORS_ORIGIN;
        //     output.headers['Access-Control-Allow-Credentials'] = 'true';
        // }
        callback(error, output);
    };
    const handler = server.graphqlLambda({
        schema: myGraphQLSchema,
        context: {
            headers,
            functionName,
            event,
            context
        }
    });

    return handler(event, context, callbackFilter);
};

exports.graphiqlHandler = server.graphiqlLambda({
    endpointURL: '/Prod/graphql'
});
