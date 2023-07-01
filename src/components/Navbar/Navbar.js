import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import ReturnDropdown from "./dropdown/ReturnDropdown";
import PassengerDropdown from "./dropdown/PassengersDropdown";
import CabinTypeDropdown from "./dropdown/CabinTypeDropdown";
import StopoversDropdown from "./dropdown/StopoversDropdown";
import TimesDropdown from "./dropdown/TimesDropdown";
import CurrencyDropdown from "./dropdown/CurrencyDropdown";

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
  setReturnDate,
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
}) => {
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

  return (
    <nav className="navbar">
      <ReturnDropdown
        tripType={tripType}
        setTripType={setTripType}
        setAreResultsVisible={setAreResultsVisible}
        setReturnDate={setReturnDate}
        departureDate={departureDate}
      />
      {/*Passengers dropdown has counts for adults, children, infants. Visible if passengersDropdown is true*/}
      <PassengerDropdown
        passengers={passengers}
        setPassengers={setPassengers}
        incrementPassenger={incrementPassenger}
        decrementPassenger={decrementPassenger}
        tempPassengers={tempPassengers}
        setTempPassengers={setTempPassengers}
      />
      {/*Travel Class options include different travel classes. Visible if cabinTypeDropdown is true*/}
      <CabinTypeDropdown
        travelClass={travelClass}
        setTravelClass={setTravelClass}
      />
      {/* Stopovers dropdown options include different stopover preferences. Visible if stopoversDropdown is true */}
      <StopoversDropdown
        stopovers={stopovers}
        setStopovers={setStopovers}
        tempStopovers={tempStopovers}
        setTempStopovers={setTempStopovers}
        stopoversCustomValue={stopoversCustomValue}
        setStopoversCustomValue={setStopoversCustomValue}
        tempStopoversCustomValue={tempStopoversCustomValue}
        setTempStopoversCustomValue={setTempStopoversCustomValue}
        incrementStopovers={incrementStopovers}
        decrementStopovers={decrementStopovers}
      />
      {/* Times dropdown -  Allows to set desired time ranges for departure, arrival, return departure, and return arrival */}
      <TimesDropdown
        times={times}
        setTimes={setTimes}
        tempTimes={tempTimes}
        setTempTimes={setTempTimes}
        tripType={tripType}
      />
      {/* Currency - updates the value of the chosen currency and resets the results visibility */}
      <CurrencyDropdown
        currency={currency}
        setCurrency={setCurrency}
        tempCurrency={tempCurrency}
        setTempCurrency={setTempCurrency}
        setAreResultsVisible={setAreResultsVisible}
      />
      {/*Filters - resets the filters applied by the user*/}
      <div className="navbar-item" onClick={resetFilters}>
        Clear filters
      </div>
    </nav>
  );
};

export default Navbar;
