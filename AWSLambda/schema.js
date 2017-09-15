// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

// import { find, filter } from 'lodash';
// import { makeExecutableSchema } from 'graphql-tools';
const { find, filter } = require("lodash"),
    { makeExecutableSchema } = require("graphql-tools");

// Go deeper with : http://dev.apollodata.com/tools/graphql-tools/generate-schema.html
const typeDefs = `
type Author {
    id: Int!
    firstName: String
    lastName: String
}
# the schema allows the following query:
type Query {
    author(id: Int!): Author
}
`;

// example data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
];
const resolvers = {
  Query: {
    author: (_, { id }) => find(authors, { id: id }),
  },
};

// TODO : export
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
