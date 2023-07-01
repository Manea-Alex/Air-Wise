import React, { useState, useEffect } from "react";
import fetchSuggestions from "../../functions/fetchSuggestions";
import "./FlightSearch.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FlightSearchResults from "../FlightSearchResults/FlightSearchResults";
import Loader from "../LoaderAnimation/Loader";
import {
  SearchContainer,
  InputGroup,
  Input,
  Button,
  ButtonContainer,
} from "./style";

const FlightSearch = ({
  tripType,
  passengers,
  currency,
  goingAirportCode,
  setGoingAirportCode,
  returnAirportCode,
  setReturnAirportCode,
  searchFlights,
  travelClassMapping,
  flights,
  isLoading,
  areResultsVisible,
  isSearchButtonClicked,
  setIsSearchButtonClicked,
  departureStartDate,
  setDepartureStartDate,
  departureEndDate,
  setDepartureEndDate,
  returnStartDate,
  setReturnStartDate,
  returnEndDate,
  setReturnEndDate,
  openSearchResults,
}) => {
  // Local state for managing suggestions
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(null);
  const [selectedToSuggestion, setSelectedToSuggestion] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Effect hook to close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".input-container")) {
        return;
      }
      setFromSuggestions([]);
      setToSuggestions([]);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if the fields are completed
  const isFormValid = () => {
    if (!from || !to || !departureStartDate || !tripType) {
      return false;
    }

    // If it's a return trip, check the returnDate as well
    if (tripType === "Return" && !returnStartDate) {
      return false;
    }

    return true;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill in all required fields!");
      return;
    } else if (from === to) {
      alert("The departure and arrival destination should be different!");
      return;
    }
    searchFlights();

    setIsSearchButtonClicked(true);
  };
  useEffect(() => {
    console.log("Going airport code ", goingAirportCode);
  }, [goingAirportCode]);

  useEffect(() => {
    console.log("Return airport code ", returnAirportCode);
  }, [returnAirportCode]);

  // Open booking link when flights updated
  useEffect(() => {
    if (flights.length > 0) {
      openSearchResults();
    }
  }, [flights]);

  let today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <SearchContainer>
        <form onSubmit={handleSubmit}>
          {/*Departure input */}
          <InputGroup>
            <div className="input-container">
              <div className="input-wrapper">
                <Input
                  placeholder="From"
                  className={from ? "input-typing" : ""}
                  type="text"
                  value={selectedFromSuggestion ? "" : from}
                  onChange={async (e) => {
                    // When a change event occurs on the input, set the state accordingly
                    // and fetch suggestions based on the input
                    const newValue = e.target.value;
                    setFrom(newValue);
                    setSelectedFromSuggestion(null);
                    const suggestions = await fetchSuggestions(newValue);
                    setFromSuggestions(suggestions);
                  }}
                />
                {selectedFromSuggestion && (
                  <div className="selected-text">
                    {/* Display selected 'from' suggestion and clear button */}
                    {`${selectedFromSuggestion.city} - ${selectedFromSuggestion.IATA}`}
                    <button
                      className="clear-button"
                      onClick={() => {
                        setFrom("");
                        setSelectedFromSuggestion(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <ul className="suggestions-list">
                {/* Map over the list of suggestions and display each one */}
                {fromSuggestions.slice(0, 10).map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      const [cityCountry, selectedCode] =
                        suggestion.split(" - ");
                      const [city] = cityCountry.split(", ");
                      setSelectedFromSuggestion({ city, IATA: selectedCode });
                      setFrom(`${city} - ${selectedCode}`);
                      setGoingAirportCode(selectedCode);
                      setFromSuggestions([]);
                    }}
                  >
                    <i className="material-icons">flight</i>
                    <span className="suggestion-text">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="input-container">
              {/* Similar logic to the 'From' input field*/}
              {/*Arrival input */}
              <div className="input-wrapper">
                <Input
                  type="text"
                  className={to ? "input-typing" : ""}
                  placeholder="To"
                  value={selectedToSuggestion ? "" : to}
                  onChange={async (e) => {
                    const newValue = e.target.value;
                    setTo(newValue);
                    setSelectedToSuggestion(null);
                    const suggestions = await fetchSuggestions(newValue);
                    setToSuggestions(suggestions);
                  }}
                />
                {selectedToSuggestion && (
                  <div className="selected-text">
                    {`${selectedToSuggestion.city} - ${selectedToSuggestion.IATA}`}
                    <button
                      className="clear-button"
                      onClick={() => {
                        setTo("");
                        setSelectedToSuggestion(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <ul className="suggestions-list">
                {toSuggestions.slice(0, 10).map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      const [cityCountry, selectedCod] =
                        suggestion.split(" - ");
                      const [city] = cityCountry.split(", ");
                      setSelectedToSuggestion({ city, IATA: selectedCod });
                      setTo(`${city} - ${selectedCod}`);
                      setReturnAirportCode(selectedCod);
                      setToSuggestions([]);
                    }}
                  >
                    <i className="material-icons">flight</i>
                    <span className="suggestion-text">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="input-container">
              {/* Datepicker for  departure date */}
              <ReactDatePicker
                placeholderText="Departure Date"
                shouldCloseOnSelect={false}
                startDate={departureStartDate}
                endDate={departureEndDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  if (start && end && start.getTime() === end.getTime()) {
                    setDepartureStartDate(start);
                    setDepartureEndDate(null);
                  } else {
                    setDepartureStartDate(start);
                    setDepartureEndDate(end);
                  }
                }}
                onCalendarClose={() => {
                  console.log("Departure Start Date:", departureStartDate);
                  console.log("Departure End Date:", departureEndDate);
                }}
                selectsRange
                minDate={today}
                maxDate={tripType === "Return" ? returnStartDate : undefined}
                dateFormat="EEE MMM d"
                monthsShown={2}
              />
              {(departureStartDate || departureEndDate) && (
                <>
                  <button
                    className="clear-date"
                    onClick={() => {
                      setDepartureStartDate(null);
                      setDepartureEndDate(null);
                    }}
                  >
                    ×
                  </button>
                  {departureEndDate == null && <div className="white"></div>}
                </>
              )}
            </div>

            {tripType === "Return" && (
              <div className="input-container">
                {/* If the trip type is return, provide an additional datepicker for the return date */}
                <ReactDatePicker
                  shouldCloseOnSelect={false}
                  selected={returnStartDate}
                  startDate={returnStartDate}
                  placeholderText="Return Date"
                  endDate={returnEndDate}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    if (start && end && start.getTime() === end.getTime()) {
                      setReturnStartDate(start);
                      setReturnEndDate(null);
                    } else {
                      setReturnStartDate(start);
                      setReturnEndDate(end);
                    }
                  }}
                  onCalendarClose={() => {
                    console.log("Return Start Date:", returnStartDate);
                    console.log("Return End Date:", returnEndDate);
                  }}
                  selectsRange
                  minDate={departureEndDate || departureStartDate}
                  dateFormat="EEE MMM d"
                  monthsShown={2}
                />
                {(returnStartDate || returnEndDate) && (
                  <>
                    <button
                      className="clear-date"
                      onClick={() => {
                        setReturnStartDate(null);
                        setReturnEndDate(null);
                      }}
                    >
                      ×
                    </button>
                    {returnEndDate === 0 && <div className="white"> </div>}
                  </>
                )}
              </div>
            )}

            <ButtonContainer>
              <Button type="submit">Search Flights</Button>
            </ButtonContainer>
          </InputGroup>
        </form>
      </SearchContainer>

      {/* If loading, show a loader */}
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        /* If its not loading show the  search results */
        <FlightSearchResults
          flights={flights}
          tripType={tripType}
          currency={currency}
          areResultsVisible={areResultsVisible}
          passengers={passengers}
          travelClassMapping={travelClassMapping}
          isSearchButtonClicked={isSearchButtonClicked}
        />
      )}
    </div>
  );
};

export default FlightSearch;
