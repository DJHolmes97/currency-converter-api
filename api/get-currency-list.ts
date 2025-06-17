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

  if (API_TOKEN !== process.env.API_TOKEN) {
    return res.status(401).send({
      error: "Unauthorized",
    })
  }

  const list = await fetchCurrencyList()
  return res.status(200).send(list)
}
