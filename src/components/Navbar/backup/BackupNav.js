import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import Slider from "@mui/material/Slider";

const Navbar = ({
  tripType,
  setTripType,
  currency,
  setCurrency,
  passengers,
  setPassengers,
  travelClass,
  setTravelClass,
  stopovers,
  setStopovers,
  stopoversCustomValue,
  setStopoversCustomValue,
  times,
  setTimes,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  goingAirportCode,
  setGoingAirportCode,
  returnAirportCode,
  setReturnAirportCode,
  setIsSearchActive,
  searchFlights,
  travelClassMapping,
  selectedCabinValue,
  formatDate,
  formatTime,
  flights,
  setFlights,
  isLoading,
  setIsLoading,
  hasSearchedOnce,
  areResultsVisible,
  setAreResultsVisible,
  tempTripType,
  setTempTripType,
  tempTravelClass,
  setTempTravelClass,
  tempPassengers,
  setTempPassengers,
  tempTimes,
  setTempTimes,
  tempCurrency,
  setTempCurrency,
  tempStopovers,
  setTempStopovers,
  tempStopoversCustomValue,
  setTempStopoversCustomValue,
  resetFilters,
  departureStartDate,
  setDepartureStartDate,
  departureEndDate,
  setDepartureEndDate,
  returnStartDate,
  setReturnStartDate,
  returnEndDate,
  setReturnEndDate,
}) => {
  // state variables for different dropdown visibility states
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const currencyRef = useRef(null);

  const [returnDropdown, setReturnDropdown] = useState(false);
  const [passengersDropdown, setPassengersDropdown] = useState(false);
  const [cabinTypeDropdown, setCabinTypeDropdown] = useState(false);

  const [stopoversDropdown, setStopoversDropdown] = useState(false);

  const [timesDropdown, setTimesDropdown] = useState(false);
  const returnRef = useRef(null);
  const passengersRef = useRef(null);
  const cabinTypeRef = useRef(null);

  const stopoversRef = useRef(null);
  const timesRef = useRef(null);
  // Effect hook for console logging state changes
  useEffect(() => {
    console.log("Departure time: ", times.departure);
    console.log("Arrrival time: ", times.arrival);
    console.log("Return Departure time: ", times.returnDeparture);
    console.log("Return Arrival time: ", times.returnArrival);
    console.log("Currency: ", currency);
    console.log("Clasa: ", travelClass);
    console.log(
      "Valoarea din passengers ",
      passengers.adults,
      passengers.children,
      passengers.infants
    );
    console.log("Valoarea din Stopovers ", stopovers, stopoversCustomValue);
  }, [
    times,
    currency,
    travelClass,
    passengers,
    stopovers,
    stopoversCustomValue,
  ]);

  // hook for handling outside clicks on dropdowns
  // ref is being used to detect if a user has clicked outside of the dropdown menu. The contains method is used to check if the clicked element (event.target) is a child of the referenced dropdown menu. If its not (meaning the click happened outside of the dropdown), the dropdown is closed
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        returnRef.current &&
        !returnRef.current.contains(event.target) &&
        returnDropdown
      ) {
        setReturnDropdown(false);
        setTempTripType(tripType);
      }

      if (
        passengersRef.current &&
        !passengersRef.current.contains(event.target) &&
        passengersDropdown
      ) {
        setPassengersDropdown(false);
        setTempPassengers({ ...passengers });
      }

      if (
        cabinTypeRef.current &&
        !cabinTypeRef.current.contains(event.target) &&
        cabinTypeDropdown
      ) {
        setCabinTypeDropdown(false);
        setTempTravelClass(travelClass);
      }

      if (
        stopoversRef.current &&
        !stopoversRef.current.contains(event.target) &&
        stopoversDropdown
      ) {
        setStopoversDropdown(false);
        setTempStopovers(stopovers);
        setTempStopoversCustomValue(stopoversCustomValue);
      }
      if (
        timesRef.current &&
        !timesRef.current.contains(event.target) &&
        timesDropdown
      ) {
        setTimesDropdown(false);
        setTempTimes(times);
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target) &&
        currencyDropdown
      ) {
        setCurrencyDropdown(false);
        setTempCurrency(currency);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    tripType,
    returnDropdown,
    passengersDropdown,
    cabinTypeDropdown,
    stopoversDropdown,
    passengers,
    travelClass,
    stopovers,
    timesDropdown,
    currency,
    currencyDropdown,
    stopoversCustomValue,
    times,
  ]);

  // Local functions to increment/decrement passenger and stopover counts
  const incrementPassenger = (type) => {
    setTempPassengers({ ...tempPassengers, [type]: tempPassengers[type] + 1 });
  };

  const decrementPassenger = (type) => {
    if (tempPassengers[type] > 0) {
      setTempPassengers({
        ...tempPassengers,
        [type]: tempPassengers[type] - 1,
      });
    }
  };

  const incrementStopovers = () => {
    if (tempStopoversCustomValue < 10) {
      setTempStopoversCustomValue(tempStopoversCustomValue + 1);
    }
  };

  const decrementStopovers = () => {
    if (tempStopoversCustomValue > 0) {
      setTempStopoversCustomValue(tempStopoversCustomValue - 1);
    }
  };

  // hooks for logging passengers and stopovers state changes
  useEffect(() => {
    console.log(
      "Valoarea din passengers ",
      passengers.adults,
      passengers.children,
      passengers.infants
    );
  }, [passengers]);

  useEffect(() => {
    console.log("Valoarea din Stopovers ", stopovers, stopoversCustomValue);
  }, [stopoversCustomValue, stopovers]);

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

  const renderCurrencyOptions = () => {
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

  return (
    <nav className="navbar">
      <div className="navbar-item" ref={returnRef}>
        {/*"Return" dropdown. Toggles on click, visible if returnDropdown is true */}

        <span onClick={() => setReturnDropdown(!returnDropdown)}>
          {tripType}
          <i className="material-symbols-outlined custom-expand">expand_more</i>
        </span>
        {returnDropdown && (
          <div className="dropdown-return">
            <div className="dropdown-actions">
              <button
                className="dropdown-action cancel"
                onClick={() => {
                  setReturnDropdown(false);
                  setTempTripType(tripType);
                }}
              >
                Cancel
              </button>
              <button
                className="dropdown-action done"
                onClick={() => {
                  setReturnDropdown(false);
                  setTripType(tempTripType);
                  setAreResultsVisible(false);
                  if (tempTripType === "One way") {
                    setReturnDate(null); // clear the return date when trip type is One way
                  }

                  if (tempTripType === "Return" && departureDate) {
                    let newReturnDate = new Date(departureDate);
                    newReturnDate.setDate(departureDate.getDate() + 7); // add 7 days to the departure date
                    setReturnDate(newReturnDate); // store as Date object
                  }
                }}
              >
                Done
              </button>
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                setTempTripType("One way");
              }}
            >
              <span className="item-content">
                {tempTripType === "One way" && (
                  <span className="checkmark">✓</span>
                )}{" "}
                One way
              </span>
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                setTempTripType("Return");
              }}
            >
              <span className="item-content">
                {tempTripType === "Return" && (
                  <span className="checkmark">✓</span>
                )}{" "}
                Return
              </span>
            </div>
          </div>
        )}
      </div>
      {/*Passengers dropdown has counts for adults, children, infants. Visible if passengersDropdown is true*/}
      <div className="navbar-item" ref={passengersRef}>
        <span onClick={() => setPassengersDropdown(!passengersDropdown)}>
          Passengers{" "}
          <i className="material-symbols-outlined custom-expand">expand_more</i>
        </span>
        {passengersDropdown && (
          <div className="dropdown passengers-dropdown">
            <div className="dropdown-actions">
              <button
                className="dropdown-action cancel"
                onClick={() => {
                  setPassengersDropdown(false);

                  setTempPassengers({ ...passengers });
                }}
              >
                Cancel
              </button>
              <button
                className="dropdown-action done"
                onClick={() => {
                  setPassengers({ ...tempPassengers });
                  setPassengersDropdown(false);
                }}
              >
                Done
              </button>
            </div>
            <div className="passenger-row">
              <div className="passenger-info">
                <i className="material-symbols-sharp adult">person</i>
                <div>
                  <span>Adults</span>
                  <p>Over 11</p>
                </div>
              </div>
              <button
                className="substract"
                onClick={() => decrementPassenger("adults")}
              >
                <i className="material-symbols-sharp substract">remove</i>
              </button>
              <input type="number" value={tempPassengers.adults} readOnly />
              <button
                className="add"
                onClick={() => incrementPassenger("adults")}
              >
                <i className="material-symbols-sharp add">add</i>
              </button>
            </div>
            <div className="passenger-row">
              <div className="passenger-info">
                <i className="material-symbols-sharp child">
                  sentiment_satisfied
                </i>
                <div>
                  <span>Children</span>
                  <p className="children-p">2-11</p>
                </div>
              </div>
              <button
                className="substract"
                onClick={() => decrementPassenger("children")}
              >
                <i className="material-symbols-sharp substract">remove</i>
              </button>
              <input type="number" value={tempPassengers.children} readOnly />
              <button
                className="add"
                onClick={() => incrementPassenger("children")}
              >
                <i className="material-symbols-sharp add">add</i>
              </button>
            </div>
            <div className="passenger-row">
              <div className="passenger-info">
                <i className="material-symbols-sharp infant">child_care</i>
                <div>
                  <span>Infants</span>
                  <p>Under 2</p>
                </div>
              </div>
              <button
                className="substract"
                onClick={() => decrementPassenger("infants")}
              >
                <i className="material-symbols-sharp substract">remove</i>
              </button>
              <input type="number" value={tempPassengers.infants} readOnly />
              <button
                className="add"
                onClick={() => incrementPassenger("infants")}
              >
                <i className="material-symbols-sharp add">add</i>
              </button>
            </div>
          </div>
        )}
      </div>
      {/*Travel Class options include different travel classes. Visible if cabinTypeDropdown is true*/}
      <div className="navbar-item" ref={cabinTypeRef}>
        <span onClick={() => setCabinTypeDropdown(!cabinTypeDropdown)}>
          {travelClass}
          <i className="material-symbols-outlined custom-expand">expand_more</i>
        </span>
        {cabinTypeDropdown && (
          <div className="dropdown">
            <div className="dropdown-actions">
              <button
                className="dropdown-action cancel"
                onClick={() => {
                  setCabinTypeDropdown(false);
                  setTempTravelClass(travelClass);
                }}
              >
                Cancel
              </button>
              <button
                className="dropdown-action done"
                onClick={() => {
                  setCabinTypeDropdown(false);
                  setTravelClass(tempTravelClass);
                }}
              >
                Done
              </button>
            </div>
            {[
              "Any",
              "Economy",
              "Premium Economy",
              "Business",
              "First Class",
            ].map((type) => (
              <div
                key={type}
                className="dropdown-item"
                onClick={() => {
                  setTempTravelClass(type);
                }}
              >
                <span className="item-content">
                  {tempTravelClass === type && (
                    <span className="checkmark">✓</span>
                  )}{" "}
                  {type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Stopovers dropdown options include different stopover preferences. Visible if stopoversDropdown is true */}
      <div className="navbar-item" ref={stopoversRef}>
        <span onClick={() => setStopoversDropdown(!stopoversDropdown)}>
          Stopovers
          <i className="material-symbols-outlined custom-expand">expand_more</i>
        </span>
        {stopoversDropdown && (
          <div className="dropdown">
            <div className="dropdown-actions">
              <button
                className="dropdown-action cancel"
                onClick={() => {
                  setStopoversDropdown(false);
                  setTempStopovers(stopovers);
                  setTempStopoversCustomValue(stopoversCustomValue);
                }}
              >
                Cancel
              </button>
              <button
                className="dropdown-action done"
                onClick={() => {
                  setStopoversDropdown(false);
                  setStopovers(tempStopovers);
                  setStopoversCustomValue(tempStopoversCustomValue);
                }}
              >
                Done
              </button>
            </div>
            <div className="dropdown-item-any">
              <div className="radio-wrapper">
                <input
                  type="radio"
                  name="stopovers"
                  value="Any"
                  checked={tempStopovers === "Any"}
                  onChange={() => {
                    setTempStopovers("Any");
                    setTempStopoversCustomValue(10);
                  }}
                />
                <label>Any</label>
              </div>
            </div>
            <div className="dropdown-item-nonstop">
              <div className="radio-wrapper">
                <input
                  type="radio"
                  name="stopovers"
                  value="Non-stop"
                  checked={tempStopovers === "Non-stop"}
                  onChange={() => {
                    setTempStopovers("Non-stop");
                    setTempStopoversCustomValue(0);
                  }}
                />
                <label>Non-stop (direct flights)</label>
              </div>
            </div>
            <div className="dropdown-item-up-to">
              <div className="radio-wrapper-up-to">
                <input
                  type="radio"
                  name="stopovers"
                  value="Up to"
                  checked={tempStopovers === "Up to"}
                  onChange={() => setTempStopovers("Up to")}
                  readOnly={tempStopovers !== "Up to"}
                  max={10}
                />
                <label>Up to</label>
              </div>
              <div className="stopovers-up-to">
                <div
                  className={`stopovers-input ${
                    tempStopovers !== "Up to" && "disabled"
                  }`}
                >
                  <button
                    className="stopover-substract"
                    onClick={() => {
                      decrementStopovers();
                    }}
                    disabled={tempStopovers !== "Up to"}
                  >
                    <i className="material-symbols-sharp substract-stopover">
                      remove
                    </i>
                  </button>
                  <input
                    className="input"
                    type="number"
                    value={tempStopoversCustomValue}
                    readOnly={tempStopovers !== "Up to"}
                    onChange={(e) =>
                      setTempStopoversCustomValue(parseInt(e.target.value, 10))
                    }
                  />
                  <button
                    className="stopover-add"
                    onClick={() => {
                      incrementStopovers();
                    }}
                    disabled={tempStopovers !== "Up to"}
                  >
                    <i className="material-symbols-sharp add-stopover">add</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Times dropdown -  Allows to set desired time ranges for departure, arrival, return departure, and return arrival */}
      <div className="navbar-item" ref={timesRef}>
        <span onClick={() => setTimesDropdown(!timesDropdown)}>
          Times
          <i className="material-symbols-outlined custom-expand">expand_more</i>
        </span>
        {timesDropdown && (
          <div className="dropdown times-dropdown">
            <div className="dropdown-actions">
              <button
                className="dropdown-action cancel"
                onClick={() => {
                  setTimesDropdown(false);
                  setTempTimes(times);
                }}
              >
                Cancel
              </button>
              <button
                className="dropdown-action done"
                onClick={() => {
                  setTimesDropdown(false);
                  setTimes(tempTimes);
                }}
              >
                Done
              </button>
            </div>
            <div className="slider-container">
              <label>Departure</label>
              <Slider
                className="thin-slider"
                value={[tempTimes.departure.min, tempTimes.departure.max]}
                min={0}
                max={24}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}:00`}
                sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                onChange={(event, newValue) => {
                  setTempTimes({
                    ...tempTimes,
                    departure: {
                      min: newValue[0],
                      max: newValue[1],
                    },
                  });
                }}
              />
            </div>
            <div className="slider-container">
              <label>Arrival</label>
              <Slider
                className="thin-slider"
                value={[tempTimes.arrival.min, tempTimes.arrival.max]}
                min={0}
                max={24}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}:00`}
                sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                onChange={(event, newValue) => {
                  setTempTimes({
                    ...tempTimes,
                    arrival: {
                      min: newValue[0],
                      max: newValue[1],
                    },
                  });
                }}
              />
            </div>
            {tripType === "Return" && (
              <>
                <div className="slider-container">
                  <label>Return Departure</label>
                  <Slider
                    className="thin-slider"
                    value={[
                      tempTimes.returnDeparture.min,
                      tempTimes.returnDeparture.max,
                    ]}
                    min={0}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}:00`}
                    sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                    onChange={(event, newValue) => {
                      setTempTimes({
                        ...tempTimes,
                        returnDeparture: {
                          min: newValue[0],
                          max: newValue[1],
                        },
                      });
                    }}
                  />
                </div>
                <div className="slider-container">
                  <label>Return Arrival</label>
                  <Slider
                    className="thin-slider"
                    value={[
                      tempTimes.returnArrival.min,
                      tempTimes.returnArrival.max,
                    ]}
                    min={0}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}:00`}
                    sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                    onChange={(event, newValue) => {
                      setTempTimes({
                        ...tempTimes,
                        returnArrival: {
                          min: newValue[0],
                          max: newValue[1],
                        },
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Currency - updates the value of the chosen currency and resets the results visibility */}
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
              {renderCurrencyOptions()}
            </div>
          </div>
        )}
      </div>
      {/*Filters - resets the filters applied by the user*/}
      <div className="navbar-item" onClick={resetFilters}>
        Clear filters
      </div>
    </nav>
  );
};

export default Navbar;

// import React, { useState, useRef, useEffect } from "react";
// import "./Navbar.css";
// // import Slider from "@mui/material/Slider";
// import { CurrencyOptions } from "./CurrencyOptions";
// import ReturnDropdown from "./ReturnDropdown";
// import PassengerDropdown from "./PassengersDropdown";
// import CabinTypeDropdown from "./CabinTypeDropdown";
// import StopoversDropdown from "./StopoversDropdown";
// import TimesDropdown from "./TimesDropdown";

// const Navbar = ({
//   tripType,
//   setTripType,
//   currency,
//   setCurrency,
//   passengers,
//   setPassengers,
//   travelClass,
//   setTravelClass,
//   stopovers,
//   setStopovers,
//   stopoversCustomValue,
//   setStopoversCustomValue,
//   times,
//   setTimes,
//   departureDate,
//   setReturnDate,
//   setAreResultsVisible,
//   tempTripType,
//   setTempTripType,
//   tempTravelClass,
//   setTempTravelClass,
//   tempPassengers,
//   setTempPassengers,
//   tempTimes,
//   setTempTimes,
//   tempCurrency,
//   setTempCurrency,
//   tempStopovers,
//   setTempStopovers,
//   tempStopoversCustomValue,
//   setTempStopoversCustomValue,
//   resetFilters,
// }) => {
//   // state variables for different dropdown visibility states
//   const [currencyDropdown, setCurrencyDropdown] = useState(false);
//   const currencyRef = useRef(null);

//   const [returnDropdown, setReturnDropdown] = useState(false);
//   const [passengersDropdown, setPassengersDropdown] = useState(false);
//   const [cabinTypeDropdown, setCabinTypeDropdown] = useState(false);

//   const [stopoversDropdown, setStopoversDropdown] = useState(false);

//   const [timesDropdown, setTimesDropdown] = useState(false);
//   const returnRef = useRef(null);
//   const passengersRef = useRef(null);
//   const cabinTypeRef = useRef(null);

//   const stopoversRef = useRef(null);
//   const timesRef = useRef(null);

//   // hook for handling outside clicks on dropdowns
//   // ref is being used to detect if a user has clicked outside of the dropdown menu. The contains method is used to check if the clicked element (event.target) is a child of the referenced dropdown menu. If its not (meaning the click happened outside of the dropdown), the dropdown is closed
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         returnRef.current &&
//         !returnRef.current.contains(event.target) &&
//         returnDropdown
//       ) {
//         setReturnDropdown(false);
//         setTempTripType(tripType);
//       }

//       if (
//         passengersRef.current &&
//         !passengersRef.current.contains(event.target) &&
//         passengersDropdown
//       ) {
//         setPassengersDropdown(false);
//         setTempPassengers({ ...passengers });
//       }

//       if (
//         cabinTypeRef.current &&
//         !cabinTypeRef.current.contains(event.target) &&
//         cabinTypeDropdown
//       ) {
//         setCabinTypeDropdown(false);
//         setTempTravelClass(travelClass);
//       }

//       if (
//         stopoversRef.current &&
//         !stopoversRef.current.contains(event.target) &&
//         stopoversDropdown
//       ) {
//         setStopoversDropdown(false);
//         setTempStopovers(stopovers);
//         setTempStopoversCustomValue(stopoversCustomValue);
//       }
//       if (
//         timesRef.current &&
//         !timesRef.current.contains(event.target) &&
//         timesDropdown
//       ) {
//         setTimesDropdown(false);
//         setTempTimes(times);
//       }
//       if (
//         currencyRef.current &&
//         !currencyRef.current.contains(event.target) &&
//         currencyDropdown
//       ) {
//         setCurrencyDropdown(false);
//         setTempCurrency(currency);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [
//     tripType,
//     returnDropdown,
//     passengersDropdown,
//     cabinTypeDropdown,
//     stopoversDropdown,
//     passengers,
//     travelClass,
//     stopovers,
//     timesDropdown,
//     currency,
//     currencyDropdown,
//     stopoversCustomValue,
//     times,
//   ]);

//   // Local functions to increment/decrement passenger and stopover counts
//   const incrementPassenger = (type) => {
//     setTempPassengers({ ...tempPassengers, [type]: tempPassengers[type] + 1 });
//   };

//   const decrementPassenger = (type) => {
//     if (tempPassengers[type] > 0) {
//       setTempPassengers({
//         ...tempPassengers,
//         [type]: tempPassengers[type] - 1,
//       });
//     }
//   };

//   const incrementStopovers = () => {
//     if (tempStopoversCustomValue < 10) {
//       setTempStopoversCustomValue(tempStopoversCustomValue + 1);
//     }
//   };

//   const decrementStopovers = () => {
//     if (tempStopoversCustomValue > 0) {
//       setTempStopoversCustomValue(tempStopoversCustomValue - 1);
//     }
//   };

//   // hooks for logging passengers and stopovers state changes
//   useEffect(() => {
//     console.log(
//       "Valoarea din passengers ",
//       passengers.adults,
//       passengers.children,
//       passengers.infants
//     );
//   }, [passengers]);

//   useEffect(() => {
//     console.log("Valoarea din Stopovers ", stopovers, stopoversCustomValue);
//   }, [stopoversCustomValue, stopovers]);

//   return (
//     <nav className="navbar">
//       <ReturnDropdown
//         tripType={tripType}
//         setTripType={setTripType}
//         setAreResultsVisible={setAreResultsVisible}
//         setReturnDate={setReturnDate}
//         departureDate={departureDate}
//       />
//       {/*Passengers dropdown has counts for adults, children, infants. Visible if passengersDropdown is true*/}
//       <PassengerDropdown
//         passengers={passengers}
//         setPassengers={setPassengers}
//         incrementPassenger={incrementPassenger}
//         decrementPassenger={decrementPassenger}
//         tempPassengers={tempPassengers}
//         setTempPassengers={setTempPassengers}
//       />
//       {/*Travel Class options include different travel classes. Visible if cabinTypeDropdown is true*/}
//       <CabinTypeDropdown
//         travelClass={travelClass}
//         setTravelClass={setTravelClass}
//       />
//       {/* Stopovers dropdown options include different stopover preferences. Visible if stopoversDropdown is true */}
//       <StopoversDropdown
//         stopovers={stopovers}
//         setStopovers={setStopovers}
//         tempStopovers={tempStopovers}
//         setTempStopovers={setTempStopovers}
//         stopoversCustomValue={stopoversCustomValue}
//         setStopoversCustomValue={setStopoversCustomValue}
//         tempStopoversCustomValue={tempStopoversCustomValue}
//         setTempStopoversCustomValue={setTempStopoversCustomValue}
//         incrementStopovers={incrementStopovers}
//         decrementStopovers={decrementStopovers}
//       />
//       {/* Times dropdown -  Allows to set desired time ranges for departure, arrival, return departure, and return arrival */}
//       <TimesDropdown
//         times={times}
//         setTimes={setTimes}
//         tempTimes={tempTimes}
//         setTempTimes={setTempTimes}
//         tripType={tripType}
//       />
//       {/* Currency - updates the value of the chosen currency and resets the results visibility */}
//       <div className="navbar-item" ref={currencyRef}>
//         <span onClick={() => setCurrencyDropdown(!currencyDropdown)}>
//           Currency
//           <i className="material-symbols-outlined custom-expand">expand_more</i>
//         </span>
//         {currencyDropdown && (
//           <div className="dropdown-currency">
//             <div className="dropdown-actions">
//               <button
//                 className="dropdown-action cancel"
//                 onClick={() => {
//                   setCurrencyDropdown(false);
//                   setTempCurrency(currency);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="dropdown-action done"
//                 onClick={() => {
//                   setCurrencyDropdown(false);
//                   setCurrency(tempCurrency);
//                   setAreResultsVisible(false);
//                 }}
//               >
//                 Done
//               </button>
//             </div>
//             <div className="currency-options-container">
//               <CurrencyOptions
//                 tempCurrency={tempCurrency}
//                 setTempCurrency={setTempCurrency}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//       {/*Filters - resets the filters applied by the user*/}
//       <div className="navbar-item" onClick={resetFilters}>
//         Clear filters
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
