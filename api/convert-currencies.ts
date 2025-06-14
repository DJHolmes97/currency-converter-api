const getCurrencyListWithEurBase = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
  ).then((res) => res.json())

  if (!response) {
    const secondResponse = await fetch(
      "https://latest.currency-api.pages.dev/v1/currencies/eur.json"
    ).then((res) => res.json())
    return secondResponse
  }
  return response
}

type HandleCurrencyConversionProps = {
  amount: number
  from: string
  to: string
  list: {
    date: string
    eur: Record<string, number>
  }
}

const handleCurrencyConversion = async ({
  amount,
  from,
  to,
  list,
}: HandleCurrencyConversionProps) => {
  // Throw an error if the amount is not a number
  if (isNaN(amount)) {
    return {
      status: 400,
      body: { error: "Invalid amount" },
    }
  }

  // Throw an error if the from or to currency is not in the list
  if (!list.eur[from] || !list.eur[to]) {
    return {
      status: 400,
      body: { error: "Invalid currency code" },
    }
  }

  // Convert the from amount to Euro
  const amountInEur = amount / list.eur[from]
  // Convert the Euro amount to the to currency
  const convertedAmount = amountInEur * list.eur[to]
  return {
    status: 200,
    body: {
      original: amount,
      converted: convertedAmount,
      from,
      to,
    },
  }
}

export default async function handler(req, res) {
  const list = await getCurrencyListWithEurBase()
  // Get the currencys being converted from the query parameters
  const { amount, from, to } = req.query

  // Use the new function to handle conversion and response
  const response = await handleCurrencyConversion({
    amount: parseFloat(amount),
    from: from,
    to: to,
    list,
  })
  return res.json(response)
}
