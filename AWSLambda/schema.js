// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo
var config = require('./config.js');

// import { find, filter } from 'lodash';
// import { makeExecutableSchema } from 'graphql-tools';
const { find, filter } = require("lodash"),
    { makeExecutableSchema } = require("graphql-tools");

// Go deeper with : http://dev.apollodata.com/tools/graphql-tools/generate-schema.html
// import Schema from './schema.graphql'; // FOR ES6 compiled code, cf below for require methode

// es6 mongo connect :
// import {MongoClient, ObjectId} from 'mongodb'
// const MONGO_URL = 'mongodb://localhost:27017/blog'
// const db = await MongoClient.connect(MONGO_URL)


// example with mongoose
var mongoose = require('mongoose');
mongoose.connect(config.mongo_url, {
    useMongoClient: true,
});
// Set Promise to avoid warning : (node:65561) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userSchema = mongoose.Schema({
    _id: String,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    roles: [ String ],
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
userSchema.methods.speak = function () {
  var greeting = this.name
    ? "User name is " + this.firstname
    : "I don't have a name";
  console.log(greeting);
}

var userModel = mongoose.model('User', userSchema);

const resolvers = {
  Query: {
      userByEmail: async (_, { email }) => await userModel.find({ email: email }),
      users: async (_, { }) => await userModel.find(),
  },
};


// userModel.find({ name: /^fluff/ }, callback); // get all user starting with fluff

// example with raw data :
// const users = [
//     { _id: "UAX", firstname: 'Tom', lastname: 'Coleman', email: 'Tom@Coleman.com',
//     password: "not set", roles:['master']},
// ];
// const resolvers = {
//   Query: {
//       userByEmail: (_, { email }) => find(users, { email: email }),
//       users: (_, { }) => users,
//   },
// };

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
