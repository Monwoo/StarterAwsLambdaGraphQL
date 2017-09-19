// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo
const CORS_ORIGIN = "https://example.com";

var server = require("apollo-server-lambda"),
    myGraphQLSchema = require("./schema");

exports.graphqlHandler = function(event, context, callback)  {

    // http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log(event);
    console.log(context);

    const headers = event.headers,
        functionName = context.functionName,
        requestOrigin = event.headers ? event.headers.origin || "*" : "*";

    console.log(requestOrigin);

    const callbackFilter = function(error, output) {
        // output = {
        //     'statusCode': statusCode,
        //     'headers': headers,
        //     'body': gqlResponse,
        // },
        console.log(output);

        // For production with credentials checkings :
        // if (requestOrigin === CORS_ORIGIN) {
        //     output.headers['Access-Control-Allow-Origin'] = CORS_ORIGIN;
        //     output.headers['Access-Control-Allow-Credentials'] = 'true';
        // }

        // For Dev without credentials checkings
        // output.headers['Access-Control-Allow-Origin'] = '*';
        output.headers['Access-Control-Allow-Origin'] = requestOrigin;
        output.headers['Access-Control-Allow-Credentials'] = 'true';
        output.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        output.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept';
        output.statusCode = 200;

        callback(error, output);
    };
    const handler = server.graphqlLambda({
        schema: myGraphQLSchema,
        context: {
            headers,
            functionName,
            event,
            context
        },
        endpointURL: '/demoBeta/graphql',
        debug: true, // enable debug infos
    });

    return handler(event, context, callbackFilter);
};

exports.graphiqlHandler = server.graphiqlLambda({
    endpointURL: '/demoBeta/graphiql'
});
