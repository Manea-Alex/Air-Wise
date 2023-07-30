import React, { useState } from "react";
import "./FlightSearchResults.css";
import SortOptions from "./flight options/SortOptions";
import RenderFlights from "./flight processing/RenderFlights";
import { extractTime, formatDate } from "./functions/utils";

const FlightSearchResults = ({
  flights,
  tripType,
  currency,
  areResultsVisible,
  passengers,
  travelClassMapping,
  isSearchButtonClicked,
}) => {
  const [showDetails, setShowDetails] = useState({});
  const [visible, setVisible] = useState(5);
  const [sortOrder, setSortOrder] = React.useState("Cheapest");

  const { sortOptions, selectedOption } = SortOptions({
    setSortOrder,
    flights,
    currency,
    isSearchButtonClicked,
  });

  return (
    <div
      className="wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/*In case of no result, display the appropriate image and text */}
      {flights.length === 0 && isSearchButtonClicked && (
        <div className="no-result">
          <img
            src="https://www.kiwi.com/images/results/illustration-no-results_2x.png?v=1"
            alt="No flights"
          />
          <div>We couldn't find your trip.</div>
          <p>Try selecting different dates or other places.</p>
        </div>
      )}
      {/*Sorting options */}
      {flights.length > 0 && (
        <div className="sorting-options">
          {flights &&
            areResultsVisible &&
            sortOptions.map((option, index) => (
              <div
                key={index}
                className={`sorting-option ${
                  selectedOption === option.label ? "selected" : ""
                }`}
                onClick={option.sortFunction}
              >
                <span className="option-label">{option.label}</span>
                <p className="display-data">{option.displayData()}</p>
              </div>
            ))}
        </div>
      )}

      {/*Flight results */}
      <div className="results-container">
        {areResultsVisible && (
          <RenderFlights
            flights={flights}
            sortOrder={sortOrder}
            currency={currency}
            visible={visible}
            travelClassMapping={travelClassMapping}
            tripType={tripType}
            formatDate={formatDate}
            extractTime={extractTime}
            passengers={passengers}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        )}
        {visible < flights.length && areResultsVisible && (
          <button className="load-more" onClick={() => setVisible(visible + 5)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default FlightSearchResults;
