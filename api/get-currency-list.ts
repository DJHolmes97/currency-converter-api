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

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log("Fetching currency list...")
  const list = fetchCurrencyList().then((data) => {
    console.log(data)
  })
  return res.json(list)
}
