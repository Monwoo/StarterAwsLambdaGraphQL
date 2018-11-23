// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo
const CORS_ORIGIN = 'https://example.com'

var server = require('apollo-server-lambda'),
	myGraphQLSchema = require('./schema.js')

exports.graphqlHandler = function(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false
	// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
	console.log('[graphqlHandler] event received : ', event)
	console.log('[graphqlHandler] context received : ', context)

	const headers = event.headers,
		functionName = context.functionName,
		requestOrigin = event.headers ? event.headers.origin || '*' : '*'

	console.log('[graphqlHandler] from requestOrigin : ', requestOrigin)

	const callbackFilter = function(error, output) {
		// output = {
		//     'statusCode': statusCode,
		//     'headers': headers,
		//     'body': gqlResponse,
		// },
		console.log('[graphqlHandler] callbackFilter output :', output)

		// For production with credentials checkings :
		// if (requestOrigin === CORS_ORIGIN) {
		//     output.headers['Access-Control-Allow-Origin'] = CORS_ORIGIN;
		//     output.headers['Access-Control-Allow-Credentials'] = 'true';
		// }

		// For Dev without credentials checkings
		// output.headers['Access-Control-Allow-Origin'] = '*';
		if (output.headers) {
			// TODO : tested from get directly, no headers is available, normal ?
			// trying https://t4n3k2xzbe.execute-api.us-east-1.amazonaws.com/prod/graphql => no headers set ?
			output.headers['Access-Control-Allow-Origin'] = requestOrigin
			output.headers['Access-Control-Allow-Credentials'] = 'true'
			output.headers['Access-Control-Allow-Methods'] =
				'GET, POST, OPTIONS'
			output.headers['Access-Control-Allow-Headers'] =
				'Content-Type, Accept'
			output.statusCode = 200
		}

		callback(error, output)
	}
	const handler = server.graphqlLambda({
		schema: myGraphQLSchema,
		context: {
			headers,
			functionName,
			event,
			context
		},
		debug: true // enable debug infos
	})

	return handler(event, context, callbackFilter)
}

exports.graphiqlHandler = function(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false
	// const query = '{ countryByName(name:"united") { name, slug } }'
	const query =
		'query GitsByThailand($name: String!) { gitsByCountryName(name: $name) { _id name slug status firstDate lastDate code duration minDaysNotice countries { name slug code } age { min max child infant } pax { min max current maybe } price { pax supSgl minXBed1 minChild supInfant commission description currency { name code symbol } } information { kind value } dynamicInformation { title value } } } '

	const handler = server.graphiqlLambda({
		// provide path to graphql, in aws :
		// /<aws:stage>/<template.yaml:graphqlPath>
		endpointURL: '/Prod/graphql',
		query: query
	})
	const callbackFilter = function(error, output) {
		const parsedOutput = output.body.split('</head>')
		injectScript =
			"const opName = ['GetUsers'];const vars = [{name: 'miguel'}, ];const getUsers = 'query GetUsers($name: String!){ users(name:$name) { firstname } }';let queries = [getUsers].map((q, k) => { return { query: q, operationName: opName[k], variables: JSON.stringify(vars[k]) } });localStorage.setItem('graphiql:queries', JSON.stringify({queries: queries})); localStorage.setItem('graphiql:historyPaneOpen', JSON.stringify(true)); localStorage.setItem('graphiql:variables', JSON.stringify(vars[0])); localStorage.setItem('graphiql:docExplorerOpen', JSON.stringify(true));  localStorage.setItem('graphiql:operationName', opName[0]);"
		parsedOutput.splice(1, 0, [
			'<script>' + injectScript + '</script></head>'
		])
		output.body = parsedOutput.join('')
		callback(error, output)
	}
	return handler(event, context, callbackFilter)
}
