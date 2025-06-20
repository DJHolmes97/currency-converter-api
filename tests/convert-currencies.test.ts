import handler from "../api/convert-currencies"

describe("Currency Converter API Handler", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV, NEXT_PUBLIC_API_TOKEN: "test-token" }
    })

    afterEach(() => {
        process.env = OLD_ENV
        jest.clearAllMocks()
    })

    const mockRes = () => {
        const res: any = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        res.send = jest.fn().mockReturnValue(res)
        return res
    }

    it("should return 200 and converted amount for valid request", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: () =>
                Promise.resolve({
                    rates: { EUR: 0.9 },
                }),
        }) as any

        const req: any = {
            method: "GET",
            query: { amount: "100", from: "USD", to: "EUR" },
            headers: { "x-api-token": "test-token" },
        }
        const res = mockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            original: 100,
            converted: "90.00",
            from: "USD",
            to: "EUR",
        })
    })

    it("should return 400 for invalid amount", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ rates: { EUR: 0.9 } }),
        }) as any

        const req: any = {
            method: "GET",
            query: { amount: "not-a-number", from: "USD", to: "EUR" },
            headers: { "x-api-token": "test-token" },
        }
        const res = mockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid amount" })
    })

    it("should return 422 for invalid currency", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: () =>
                Promise.resolve({
                    status: 422,
                    error: "Invalid currency code",
                }),
        }) as any

        const req: any = {
            method: "GET",
            query: { amount: "100", from: "XXX", to: "EUR" },
            headers: { "x-api-token": "test-token" },
        }
        const res = mockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(422)
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid currency code" })
    })

    it("should return 401 for missing or invalid API token", async () => {
        const req: any = {
            method: "GET",
            query: { amount: "100", from: "USD", to: "EUR" },
            headers: { "x-api-token": "wrong-token" },
        }
        const res = mockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            statusCode: 401,
            body: { error: "Unauthorized" },
        })
    })

    it("should handle OPTIONS preflight request", async () => {
        const req: any = {
            method: "OPTIONS",
            query: {},
            headers: {},
        }
        const res = mockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith("Preflight response")
    })
})