// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

// import { find, filter } from 'lodash';
// import { makeExecutableSchema } from 'graphql-tools';
const { find, filter } = require("lodash"),
    { makeExecutableSchema } = require("graphql-tools");

// Go deeper with : http://dev.apollodata.com/tools/graphql-tools/generate-schema.html
// import Schema from './schema.graphql'; // FOR ES6 compiled code, cf below for require methode

// example data : TODO : connect to MongoDB with mongose
const users = [
    { _id: "UAX", firstname: 'Tom', lastname: 'Coleman', email: 'Tom@Coleman.com',
    password: "not set", roles:['master']},
];

const resolvers = {
  Query: {
      userByEmail: (_, { email }) => find(users, { email: email }),
      users: (_, { }) => users,
  },
};

// ES6 way
// const schema = ;

// Regular JS with require and Promise way
// const schemaLoader = require('@creditkarma/graphql-loader')
// schemaLoader.loadDocument('./schema.graphql').then((Schema) => {
//   return makeExecutableSchema({
//       typeDefs: [Schema, ],
//       resolvers: resolvers,
//       // connectors: Connectors,
//   })
// })

// Export sync with require way :
var fs = require('fs');
require.extensions['.graphql'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var typeDefs = require("./schema.graphql");

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, ],
    resolvers: resolvers,
    // connectors: Connectors,
});


// If Es6 or babel enabled, use :
// export default schema;
exports["default"] = schema;
module.exports = exports["default"];
