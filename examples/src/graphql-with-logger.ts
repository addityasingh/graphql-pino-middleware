import express from "express";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from 'graphql-tools';
const graphqlExpressHttp = require("express-graphql");
import graphqlPinoMiddleware from "../../dist/index.js";

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    hello(name: String): String
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      const result = `Hello ${args.name ? args.name : 'world'}!`
      // The logger is available in the context now
      context.logger.info({
        helloResolver: result
      })
      return result;
    },
  }
};

const loggerMiddleware = graphqlPinoMiddleware();

const schema = applyMiddleware(
  makeExecutableSchema({typeDefs, resolvers}),
  loggerMiddleware,
)

const app = express();
app.use("/graphql", graphqlExpressHttp({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}))

app.listen(4001, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});