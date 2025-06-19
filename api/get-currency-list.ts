import type { VercelRequest, VercelResponse } from "@vercel/node"

const fetchCurrencyList = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
  ).then((res) => res.json())
  if (!response) {
    const secondResponse = await fetch(
      "https://latest.currency-api.pages.dev/v1/currencies.json"
    ).then((res) => res.json())
    return secondResponse
  }
  return response
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_TOKEN = req.headers["x-api-token"]

  if (req.method === "OPTIONS") {
    return res.status(200).send("Preflight response")
  }

  const envApiToken = process.env.NEXT_PUBLIC_API_TOKEN

  if (API_TOKEN !== envApiToken && req.method !== "OPTIONS") {
    return res.status(401).json({
      error: "Unauthorized",
    })
  }

  const list = await fetchCurrencyList()
  return res.status(200).json(list)
}
