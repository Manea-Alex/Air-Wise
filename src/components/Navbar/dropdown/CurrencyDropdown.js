import React, { useState, useEffect, useRef } from "react";
import CurrencyOptions from "./CurrencyOptions"; // Make sure to import from the correct location

const CurrencyDropdown = ({
  currency,
  setCurrency,
  tempCurrency,
  setTempCurrency,
  setAreResultsVisible,
}) => {
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const currencyRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        currencyDropdown &&
        currencyRef.current &&
        !currencyRef.current.contains(e.target)
      ) {
        setCurrencyDropdown(false);
        setTempCurrency(currency);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [currencyDropdown, currency]);

  return (
    <div className="navbar-item" ref={currencyRef}>
      <span onClick={() => setCurrencyDropdown(!currencyDropdown)}>
        Currency
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {currencyDropdown && (
        <div className="dropdown-currency">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setCurrencyDropdown(false);
                setTempCurrency(currency);
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setCurrencyDropdown(false);
                setCurrency(tempCurrency);
                setAreResultsVisible(false);
              }}
            >
              Done
            </button>
          </div>
          <div className="currency-options-container">
            <CurrencyOptions
              tempCurrency={tempCurrency}
              setTempCurrency={setTempCurrency}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
