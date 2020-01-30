# graphql-pino-middleware 🚀

[![NPM](https://nodei.co/npm/graphql-pino-middleware.png)](https://npmjs.org/package/graphql-pino-middleware)

GraphQL middleware to instrument resolvers with pino logger. This middleware intends to remove cross-cutting concerns from the application by providing logger in the resolver context.

![Publish](https://github.com/addityasingh/graphql-pino-middleware/workflows/Publish/badge.svg)
[![downloads](https://img.shields.io/npm/dt/graphql-pino-middleware.svg)](https://npmjs.org/package/graphql-pino-middleware?cacheSeconds=3600)
[![version](https://img.shields.io/npm/v/graphql-pino-middleware.svg)](https://npmjs.org/package/graphql-pino-middleware?cacheSeconds=3600)


## Table of contents

- [Getting started](#getting-started)
- [API](#api)
- [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Contributing](#contributing)
  - [Good first issues](#good-first-issues)
- [License](#licence)

## Getting started

1. Install the `graphql-pino-middleware` and `graphql-middleware` packages

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

## API

### middleware = graphqlPinoMiddleware([options])

- `options`
  - `logger`: An optional `pino` logger
  - `hooks`: Lost of `PreResolve` and `PostResolve` hooks

Refer the [examples](./examples) for more usage examples

## Contributing

`graphql-pino-middleware` package intends to support contribution and support and thanks the open source community to making it better. Read below to learn how you can improve this repository and package

### Code of Conduct

Please check the [CODE OF CONDUCT](./CODE_OF_CONDUCT) which we have in place to ensure safe and supportive environment for contributors

### Contributing

Feel free to create issues and bugs in the issues section using issues and bugs template. Please also ensure that there are not existing issues created on the same topic

### Good first issues

Please check issues labeled [#good-first-issues](https://github.com/addityasingh/graphql-pino-middleware/labels/good%20first%20issue) under the issues section

## Licence

`graphql-pino-middleware` uses [MIT Licence](./LICENCE)
