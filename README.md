# graphql-pino-middleware

GraphQL middleware to instrument resolvers with pino logger

## Usage

1. Install the package and graphql-middleware

```sh
yarn add graphql-pino-middleware
yarn add graphql-middleware
```

2. Create the pino logger and configure the middleware with options

```javascript
import pino from "pino";
import graphqlPinoMiddleware from "graphql-pino-middleware";

const logger = pino();

// create the graphql-pino-middleware
const loggerMiddleware = graphqlPinoMiddleware({
  logger
});
```

4. Apply the middleware to the schema

```javascript
import express from "express";
import graphqlExpressHttp from "express-graphql";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    hello(name: String): String
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      const result = `Hello ${args.name ? args.name : "world"}!`;
      // The logger is available in the context now
      context.logger.info({
        helloResolver: result
      });
      return result;
    }
  }
};

// apply the middleware to the schema
const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  loggerMiddleware
);

// Use the schema in your graphql server
const app = express();
app.use(
  "/graphql",
  graphqlExpressHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  })
);
```

## Development
