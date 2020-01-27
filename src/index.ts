import { GraphQLResolveInfo } from "graphql";
import { IMiddlewareFunction } from "graphql-middleware";
import { Logger } from "pino";
const pino = require('pino');

interface MiddlewareOptions {
  logger?: Logger
}

interface HookContext<T, D> {
  logger: Logger;
  resolvedData?: D;
  args: any;
  context: T;
  info: GraphQLResolveInfo;
  err?: Error;
}

type MiddlewareHookFn<T, D> = (
  context: HookContext<T, D>
) => void | Promise<any>;

export enum LifecycleHook {
  PreResolve = "PreResolve",
  PostResolve = "PostResolve"
}

interface MiddlewareHooks<T, D> {
  [lifecycle: string]: Array<MiddlewareHookFn<T, D>>;
}

const defaultLogger = pino();

async function executeHooks<T, D>(
  lifecycle: LifecycleHook,
  lifecycleHooks: MiddlewareHooks<T, D>,
  context: HookContext<T, D>
) {
  const hooks = lifecycleHooks[lifecycle];
  if (!Array.isArray(hooks)) {
    return;
  }
  for (const hook of hooks) {
    if (typeof hook == "function") {
      await hook.apply(null, [context]);
    }
  }
}

type GraphQLMiddleware<T, D> = (
  options: MiddlewareOptions,
  hooks: MiddlewareHooks<T, D>
) => IMiddlewareFunction;

/**
 * GraphQL pino middleware to add pino logger for each resolver request and execute
 * lifecycle hooks before and after resolving Fields
 * @param options The options for the middleware
 * @param hooks Hooks to execute before and after executing the middlewares
 */
const graphqlPinoMiddleware = <T = any, D = any>(
  options: MiddlewareOptions = {},
  hooks: MiddlewareHooks<T, D> = {}
): IMiddlewareFunction => {
  const { logger = defaultLogger } = options;

  return async (resolve, root, args, context, info) => {
    context.logger = logger;

    await executeHooks(LifecycleHook.PreResolve, hooks, context);
    const result = await resolve(root, args, context, info);
    context.resolvedData = result;
    await executeHooks(LifecycleHook.PostResolve, hooks, context);

    return result;
  };
};

export default graphqlPinoMiddleware;
