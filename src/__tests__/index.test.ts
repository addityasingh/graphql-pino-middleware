const pinoMock = require("pino");
import graphqlPinoMiddleware, { LifecycleHook } from "..";
jest.mock("pino");

describe("graphql-pino-middleware", () => {
  const mockRoot = {};
  const mockArgs = {};
  const mockInfo = {};
  const mockContext: any = {};
  const mockResolve = jest.fn();

  beforeEach(() => {
    mockResolve.mockClear();
  });

  test("should call the resolver with correct options", async () => {
    const mockResolve = jest.fn();
    const middleware: any = graphqlPinoMiddleware();
    await middleware(mockResolve, mockRoot, mockArgs, mockContext, mockInfo);
    expect(mockResolve).toBeCalledWith(
      mockRoot,
      mockArgs,
      mockContext,
      mockInfo
    );
  });

  test("should add a default logger if no logger passed", async () => {
    const mockResolve = jest.fn();
    const middleware: any = graphqlPinoMiddleware();
    await middleware(mockResolve, mockRoot, mockArgs, mockContext, mockInfo);
    expect(mockResolve).toBeCalledWith(
      mockRoot,
      mockArgs,
      mockContext,
      mockInfo
    );
    expect(pinoMock).toHaveBeenCalled();
  });

  describe("hooks::using onion principle", () => {
    test("should execute all `PreResolve` hooks", async () => {
      const mockPreHook = jest.fn();
      const mockHooks = {
        [LifecycleHook.PreResolve]: [mockPreHook]
      };

      const middleware: any = graphqlPinoMiddleware(
        { logger: pinoMock() },
        mockHooks
      );
      await middleware(mockResolve, mockRoot, mockArgs, mockContext, mockInfo);
      expect(mockPreHook).toBeCalled();
      expect(mockPreHook).toBeCalledWith(mockContext);
    });

    test("should execute all `PostResolve` hooks", async () => {
      const mockPostHook = jest.fn();
      const mockHooks = {
        [LifecycleHook.PostResolve]: [mockPostHook]
      };

      const middleware: any = graphqlPinoMiddleware(
        { logger: pinoMock() },
        mockHooks
      );
      await middleware(mockResolve, mockRoot, mockArgs, mockContext, mockInfo);
      expect(mockPostHook).toBeCalled();
      expect(mockPostHook).toBeCalledWith(mockContext);
    });

    test("should execute all hooks", async () => {
      const mockPostHook = jest.fn();
      const mockPreHook = jest.fn();
      const mockResolve = jest.fn(() => "mock value");
      const mockHooks = {
        [LifecycleHook.PreResolve]: [mockPreHook],
        [LifecycleHook.PostResolve]: [mockPostHook]
      };

      const middleware: any = graphqlPinoMiddleware(
        { logger: pinoMock() },
        mockHooks
      );
      await middleware(mockResolve, mockRoot, mockArgs, mockContext, mockInfo);
      expect(mockPreHook).toBeCalled();
      expect(mockPreHook).toBeCalledWith(mockContext);
      expect(mockContext.resolvedData).toBe("mock value");
      expect(mockPostHook).toBeCalled();
      expect(mockPostHook).toBeCalledWith(mockContext);
    });
  });
});
