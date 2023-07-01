// App.js
import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import FlightSearch from "./components/FlightSearch/FlightSearch";
import axios from "axios";
import Widget from "./components/Widget/Widget";

function App() {
  const [showWidget, setShowWidget] = useState(true);

  // State variables for search parameters and also for loading
  const [isLoading, setIsLoading] = useState(false);
  const [tripType, setTripType] = useState("Return");
  const [currency, setCurrency] = useState("EUR");
  const [goingAirportCode, setGoingAirportCode] = useState("");
  const [returnAirportCode, setReturnAirportCode] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);

  const [travelClass, setTravelClass] = useState("Economy");
  const [stopovers, setStopovers] = useState("Any");
  const [stopoversCustomValue, setStopoversCustomValue] = useState(10);
  const [times, setTimes] = useState({
    departure: { min: 0, max: 23 },
    arrival: { min: 0, max: 23 },
    returnDeparture: { min: 0, max: 23 },
    returnArrival: { min: 0, max: 23 },
  });
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [departureStartDate, setDepartureStartDate] = useState(null);
  const [departureEndDate, setDepartureEndDate] = useState(null);
  const [returnStartDate, setReturnStartDate] = useState(null);
  const [returnEndDate, setReturnEndDate] = useState(null);

  const [flights, setFlights] = useState([]);

  // Define mappings for travel class
  const travelClassMapping = {
    Economy: "M",
    "Premium Economy": "W",
    Business: "C",
    "First Class": "F",
  };

  const selectedCabinValue =
    travelClass !== "Any" ? travelClassMapping[travelClass] : undefined;

  // Function to format a date object to "day/month/year" string format
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
  // Function to format a time to a zero-padded string format
  const formatTime = (time) => {
    return ("0" + time).slice(-2) + ":00";
  };
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  const [areResultsVisible, setAreResultsVisible] = useState(false);

  // Function to search flights using an API call
  const searchFlights = useCallback(async () => {
    setIsLoading(true);
    setShowWidget(false);
    let finalDepartureStartDate = departureStartDate;
    let finalDepartureEndDate = departureEndDate || departureStartDate; // if end date is null, use start date
    let finalReturnStartDate = returnStartDate;
    let finalReturnEndDate = returnEndDate || returnStartDate; // if end date is null, use start date
    try {
      const params = {
        fly_from: goingAirportCode,
        fly_to: returnAirportCode,
        date_from: formatDate(finalDepartureStartDate),
        date_to: formatDate(finalDepartureEndDate),
        dtime_from: formatTime(times.departure.min),
        dtime_to: formatTime(times.departure.max),
        atime_from: formatTime(times.arrival.min),
        atime_to: formatTime(times.arrival.max),

        ...(tripType === "Return" && {
          return_from: formatDate(finalReturnStartDate),
          return_to: formatDate(finalReturnEndDate),
          ret_dtime_from: formatTime(times.returnDeparture.min),
          ret_dtime_to: formatTime(times.returnDeparture.max),
          ret_atime_from: formatTime(times.returnArrival.min),
          ret_atime_to: formatTime(times.returnArrival.max),
        }),
        ...(selectedCabinValue && { selected_cabins: selectedCabinValue }),
        max_stopovers: stopoversCustomValue,
        adults: passengers["adults"],
        children: passengers["children"],
        infants: passengers["infants"],
        curr: currency,
        limit: 1000,
      };
      console.log(
        formatTime(times.departure.min),
        formatTime(times.departure.max),
        " Dates departure start ",
        formatDate(finalDepartureStartDate),
        " Dates departure end ",
        formatDate(finalDepartureEndDate),
        " Dates return start ",
        formatDate(finalReturnStartDate),
        " Dates return end ",
        formatDate(finalReturnEndDate)
      );

      console.log("Request params:", params);
      try {
        const response = await axios.get(
          "https://api.tequila.kiwi.com/v2/search",
          {
            headers: {
              apikey: "ijeqvVp0PrTDU-EwKjyNbf-XkH5ooFUG",
            },
            params,
          }
        );

        console.log("Response ", response.data);
        setFlights(response.data.data);
        console.log("Flights ", flights);
      } catch (error) {
        console.error("Error response:", error.response);
        console.error(error);
      }
      setHasSearchedOnce(true);
    } finally {
      setIsLoading(false);
    }
    setAreResultsVisible(true);
  }, [
    goingAirportCode,
    returnAirportCode,
    departureDate,
    returnDate,
    times,
    tripType,
    stopoversCustomValue,
    passengers,
    currency,
    selectedCabinValue,
    departureStartDate,
    departureEndDate,
    returnStartDate,
    returnEndDate,
    flights,
  ]);

  // State for temporary filters,  used for handling changes
  const [tempTripType, setTempTripType] = useState(tripType);
  const [tempTravelClass, setTempTravelClass] = useState(travelClass);
  const [tempPassengers, setTempPassengers] = useState({ ...passengers });
  const [tempTimes, setTempTimes] = useState({ ...times });
  const [tempCurrency, setTempCurrency] = useState(currency);

  const [tempStopovers, setTempStopovers] = useState(stopovers);
  const [tempStopoversCustomValue, setTempStopoversCustomValue] =
    useState(stopoversCustomValue);

  // Function to reset filters to their default values
  const resetFilters = () => {
    const oldTripType = tempTripType;

    setTripType("Return");
    setTempTripType("Return");
    setPassengers({ adults: 1, children: 0, infants: 0 });
    setTempPassengers({ adults: 1, children: 0, infants: 0 });
    setTravelClass("Economy");
    setTempTravelClass("Economy");
    setTempStopovers("Any");
    setTempStopoversCustomValue(10);
    setStopovers("Any");
    setStopoversCustomValue(10);

    setTempTimes({
      departure: { min: 0, max: 24 },
      arrival: { min: 0, max: 24 },
      returnDeparture: { min: 0, max: 24 },
      returnArrival: { min: 0, max: 24 },
    });
    setTimes({
      departure: { min: 0, max: 24 },
      arrival: { min: 0, max: 24 },
      returnDeparture: { min: 0, max: 24 },
      returnArrival: { min: 0, max: 24 },
    });
    setTempCurrency("EUR");
    setCurrency("EUR");
    setAreResultsVisible(false);
    console.log("DEPARTURE DATE : ", departureDate);
    if (oldTripType === "One way" && departureDate) {
      let newReturnDate = new Date(departureDate);
      newReturnDate.setDate(departureDate.getDate() + 7); // add 7 days to the departure date
      setReturnDate(newReturnDate); // store as Date object
    }
  };

  // Function to open the booking link with the correct data if we have results
  const openSearchResults = () => {
    const startDay = new Date(departureStartDate);
    let endDay;

    if (tripType === "One way") {
      if (departureEndDate) {
        endDay = new Date(departureEndDate);
        console.log("One way trip branch executed");
      } else {
        endDay = new Date(startDay);
        endDay.setDate(startDay.getDate() + 5); // Add 5 days if there is no end date
      }
    } else if (tripType === "Return" && returnStartDate) {
      endDay = new Date(returnStartDate);
      console.log("Return trip branch executed");
    }
    console.log("end day " + endDay);
    if (!endDay) return; // If endDay is still undefined or null, we return
    console.log("end day after");

    const checkinYear = startDay.getFullYear();
    const checkinMonth = startDay.getMonth() + 1; // JavaScript months start at 0
    const checkinMonthday = startDay.getDate();

    const checkoutYear = endDay.getFullYear();
    const checkoutMonth = endDay.getMonth() + 1;
    const checkoutMonthday = endDay.getDate();

    const iata = returnAirportCode;

    const groupAdults = passengers.adults;
    const groupChildren = passengers.children + passengers.infants;

    const url = `https://sp.booking.com/searchresults.html?checkin_year=${checkinYear}&checkin_month=${checkinMonth}&checkin_monthday=${checkinMonthday}&checkout_year=${checkoutYear}&checkout_month=${checkoutMonth}&checkout_monthday=${checkoutMonthday}&iata=${iata}&lang=en&selected_currency=${currency}&group_adults=${groupAdults}${
      groupChildren > 0 ? `&group_children=${groupChildren}` : ""
    }`;

    console.log("Return Start Date: " + returnStartDate);
    console.log("End Day: " + endDay);

    let newTab = window.open();
    console.log("New Tab: " + newTab);
    console.log("URL: " + url);
    // newTab.location = url;
    if (newTab !== null) {
      newTab.location = url;
      newTab.blur();
      console.log("New Tab location: " + newTab.location);
    } else {
      console.log("New Tab location: " + newTab.location);

      console.log("Could not open new window");
      return;
    }
    // window.focus();
    // newTab.blur();
    // window.focus();
  };

  // Rendering the Navbar and FlightSearch with their props as well as
  // having the images responsible for responsiveness and also the widget
  return (
    <>
      <div className="image-container">
        <img
          src="//images.kiwi.com/illustrations/0x400/MobileApp-Q85.png"
          srcSet="//images.kiwi.com/illustrations/0x600/MobileApp-Q85.png 1.25x"
          alt="MobileApp"
          className="image"
        />
        <p className="mobile-text">
          We don't support the mobile version at the moment. But thanks for
          showing your interest; it will help us prioritize this for the future.
        </p>
      </div>
      <div className="App">
        <h1>Flight Search</h1>

        <Navbar
          tripType={tripType}
          setTripType={setTripType}
          currency={currency}
          setCurrency={setCurrency}
          passengers={passengers}
          setPassengers={setPassengers}
          travelClass={travelClass}
          setTravelClass={setTravelClass}
          stopovers={stopovers}
          setStopovers={setStopovers}
          stopoversCustomValue={stopoversCustomValue}
          setStopoversCustomValue={setStopoversCustomValue}
          times={times}
          setTimes={setTimes}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          goingAirportCode={goingAirportCode}
          setGoingAirportCode={setGoingAirportCode}
          returnAirportCode={goingAirportCode}
          setReturnAirportCode={setReturnAirportCode}
          searchFlights={searchFlights}
          travelClassMapping={travelClassMapping}
          selectedCabinValue={selectedCabinValue}
          formatDate={formatDate}
          formatTime={formatTime}
          flights={flights}
          setFlights={setFlights}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsSearchButtonClicked={setIsSearchButtonClicked}
          isSearchButtonClicked={isSearchButtonClicked}
          hasSearchedOnce={hasSearchedOnce}
          areResultsVisible={areResultsVisible}
          setAreResultsVisible={setAreResultsVisible}
          tempTripType={tempTripType}
          setTempTripType={setTempTripType}
          tempTravelClass={tempTravelClass}
          setTempTravelClass={setTempTravelClass}
          tempPassengers={tempPassengers}
          setTempPassengers={setTempPassengers}
          tempTimes={tempTimes}
          setTempTimes={setTempTimes}
          tempCurrency={tempCurrency}
          setTempCurrency={setTempCurrency}
          tempStopovers={tempStopovers}
          setTempStopovers={setTempStopovers}
          tempStopoversCustomValue={tempStopoversCustomValue}
          setTempStopoversCustomValue={setTempStopoversCustomValue}
          resetFilters={resetFilters}
          departureStartDate={departureStartDate}
          setDepartureStartDate={setDepartureStartDate}
          departureEndDate={departureEndDate}
          setDepartureEndDate={setDepartureEndDate}
          returnStartDate={returnStartDate}
          setReturnStartDate={setReturnStartDate}
          returnEndDate={returnEndDate}
          setReturnEndDate={setReturnEndDate}
        />

        <FlightSearch
          tripType={tripType}
          passengers={passengers}
          travelClass={travelClass}
          currency={currency}
          times={times}
          stopoversCustomValue={stopoversCustomValue}
          stopovers={stopovers}
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          goingAirportCode={goingAirportCode}
          setGoingAirportCode={setGoingAirportCode}
          returnAirportCode={returnAirportCode}
          setReturnAirportCode={setReturnAirportCode}
          searchFlights={searchFlights}
          travelClassMapping={travelClassMapping}
          selectedCabinValue={selectedCabinValue}
          formatDate={formatDate}
          formatTime={formatTime}
          flights={flights}
          setFlights={setFlights}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsSearchButtonClicked={setIsSearchButtonClicked}
          isSearchButtonClicked={isSearchButtonClicked}
          areResultsVisible={areResultsVisible}
          setAreResultsVisible={setAreResultsVisible}
          departureStartDate={departureStartDate}
          setDepartureStartDate={setDepartureStartDate}
          departureEndDate={departureEndDate}
          setDepartureEndDate={setDepartureEndDate}
          returnStartDate={returnStartDate}
          setReturnStartDate={setReturnStartDate}
          returnEndDate={returnEndDate}
          setReturnEndDate={setReturnEndDate}
          openSearchResults={openSearchResults}
        />

        {showWidget && <Widget />}
      </div>
    </>
  );
}
export default App;
