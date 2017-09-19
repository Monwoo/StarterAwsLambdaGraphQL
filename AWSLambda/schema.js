// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

// import { find, filter } from 'lodash';
// import { makeExecutableSchema } from 'graphql-tools';
const { find, filter } = require("lodash"),
    { makeExecutableSchema } = require("graphql-tools");

// Go deeper with : http://dev.apollodata.com/tools/graphql-tools/generate-schema.html
const typeDefs = `
########### DATE ##
scalar Date

########### USER ##
type User {
  _id: String
  firstname: String
  lastname: String
  email: String
  password: String
  roles: [ Role ]
}

type Role {
  value: String
}

# the schema allows the following query:
type Query {
    userByEmail(email: String!): User
}
`;

// example data
const users = [
    { _id: "UAX", firstname: 'Tom', lastname: 'Coleman', email: 'Tom@Coleman.com',
    password: "not set", roles:['master']},
];
const resolvers = {
  Query: {
    userByEmail: (_, { email }) => find(users, { email: email }),
  },
};

// TODO : export
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
