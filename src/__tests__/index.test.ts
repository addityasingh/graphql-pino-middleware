import graphqlPinoMiddleware, { LifecycleHook } from "..";

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
});
