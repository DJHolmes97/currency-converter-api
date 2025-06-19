type HandleCurrencyConversionProps = {
  amount: number
  from: string
  to: string
}

const handleCurrencyConversion = async ({
  amount,
  from,
  to,
}: HandleCurrencyConversionProps) => {
  const response = await fetch(
    `https://api.vatcomply.com/rates?base=${from.toUpperCase()}&symbols=${to.toUpperCase()}`
  ).then((res) => res.json())

  // Throw an error if the amount is not a number
  if (isNaN(amount)) {
    return {
      statusCode: 400,
      body: { error: "Invalid amount" },
    }
  }

  // Throw an error if the from or to currency is not valid
  if (response.status === 422) {
    return {
      statusCode: 422,
      body: { error: response.error },
    }
  }

  // Calculate the converted amount
  const convertedAmount = amount * response.rates[to.toUpperCase()]
  return {
    statusCode: 200,
    body: {
      original: amount,
      converted: convertedAmount.toFixed(2),
      from,
      to,
    },
  }
}

export default async function handler(req, res) {
  // Get the currencys being converted from the query parameters
  const { amount, from, to } = req.query
  const API_TOKEN = req.headers["x-api-token"]

  if (API_TOKEN !== process.env.API_TOKEN) {
    return res.status(401).json({
      statusCode: 401,
      body: { error: "Unauthorized" },
    })
  }

  // Use the new function to handle conversion and response
  const response = await handleCurrencyConversion({
    amount: parseFloat(amount),
    from: from,
    to: to,
  })
  return res.status(response.statusCode).json(response.body)
}
