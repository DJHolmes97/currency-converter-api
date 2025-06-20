import handler from "../api/get-currency-list"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const OLD_ENV = process.env

describe("get-currency-list handler", () => {
  let req: Partial<VercelRequest>
  let res: Partial<VercelResponse>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock
  let sendMock: jest.Mock

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_TOKEN: "test-token" }
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn().mockReturnThis()
    sendMock = jest.fn().mockReturnThis()
    req = {
      headers: {},
      method: "GET",
    }
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    }
    // Mock fetch globally
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ USD: { name: "US Dollar" } }),
    }) as any
  })

  afterAll(() => {
    process.env = OLD_ENV
    jest.resetAllMocks()
  })

  it("should return 200 and preflight response for OPTIONS method", async () => {
    req.method = "OPTIONS"
    await handler(req as VercelRequest, res as VercelResponse)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(sendMock).toHaveBeenCalledWith("Preflight response")
  })

  it("should return 401 if API token is missing", async () => {
    req.headers = {}
    await handler(req as VercelRequest, res as VercelResponse)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(jsonMock).toHaveBeenCalledWith({ error: "Unauthorized" })
  })

  it("should return 401 if API token is incorrect", async () => {
    req.headers = { "x-api-token": "wrong-token" }
    await handler(req as VercelRequest, res as VercelResponse)
    expect(statusMock).toHaveBeenCalledWith(401)
    expect(jsonMock).toHaveBeenCalledWith({ error: "Unauthorized" })
  })

  it("should return 200 and currency list if API token is correct", async () => {
    req.headers = { "x-api-token": "test-token" }
    await handler(req as VercelRequest, res as VercelResponse)
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith({ USD: { name: "US Dollar" } })
  })
})
