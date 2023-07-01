// CurrencyOptions.js
import React from "react";

// Currency array and rendering function for currency options.
const currencies = [
  "AMD",
  "AUD",
  "BHD",
  "BRL",
  "BGN",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JOD",
  "JPY",
  "KGS",
  "KRW",
  "KWD",
  "KZT",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "OMR",
  "PEN",
  "PHP",
  "PLN",
  "QAR",
  "RON",
  "RSD",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "TWD",
  "USD",
  "UZS",
  "YER",
  "ZAR",
];
export const CurrencyOptions = ({ tempCurrency, setTempCurrency }) => {
  return currencies.map((currency) => (
    <div
      key={currency}
      className={`currency-option${
        tempCurrency === currency ? " selected" : ""
      }`}
      onClick={() => {
        setTempCurrency(currency);
      }}
    >
      <span className="currency-name">{currency}</span>
    </div>
  ));
};

export default CurrencyOptions;
