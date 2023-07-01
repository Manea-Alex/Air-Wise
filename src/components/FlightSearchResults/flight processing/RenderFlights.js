import React from "react";
import SeparateLayovers from "./SeparateLayovers";
import RenderLayovers from "./RenderLayovers";
import { findAirlineDetails } from "../functions/utils";
import { calculateTotalDuration, formatDuration } from "../functions/utils";

const RenderFlights = ({
  flights,
  sortOrder,
  currency,
  visible,
  travelClassMapping,
  tripType,
  formatDate,
  extractTime,
  passengers,
  showDetails,
  setShowDetails,
}) => {
  // Map over each flight, calculate the total duration and separate the layovers for the going and return flights
  const flightsWithTotalDuration = flights.map((flight) => {
    const { goingLayovers, returnLayovers } = SeparateLayovers(flight.route);
    const goingDuration = calculateTotalDuration(goingLayovers);
    const returnDuration = calculateTotalDuration(returnLayovers);
    const totalDuration = formatDuration(goingDuration + returnDuration);

    return {
      ...flight,
      goingDuration,
      returnDuration,
      totalDuration,
      goingLayovers,
      returnLayovers,
    };
  });

  let sortedFlights = [...flightsWithTotalDuration];
  console.log("Flights sorted ", sortedFlights);

  // Sorting the flights based on the sortOrder state value
  switch (sortOrder) {
    case "Cheapest":
      sortedFlights.sort(
        (a, b) => a.conversion[currency] - b.conversion[currency]
      );
      break;
    case "Fastest":
      sortedFlights.sort((a, b) => {
        const durationDifference =
          a.goingDuration +
          a.returnDuration -
          (b.goingDuration + b.returnDuration);

        if (durationDifference === 0) {
          return a.conversion[currency] - b.conversion[currency];
        }

        return durationDifference;
      });
      break;
    default:
      break;
  }
  return sortedFlights.slice(0, visible).map((flight, index) => {
    // Separate the flight routes into going and returning layovers
    const { goingLayovers, returnLayovers } = SeparateLayovers(flight.route);
    // Get the first and last flights in the layovers (for display of departure and arrival times)
    const firstGoingFlight = goingLayovers[0];
    const lastGoingFlight = goingLayovers[goingLayovers.length - 1];

    // same for return flights, if there are any
    const firstReturnFlight = returnLayovers.length ? returnLayovers[0] : null;
    const lastReturnFlight = returnLayovers.length
      ? returnLayovers[returnLayovers.length - 1]
      : null;

    // Calculate total duration of the flight, including layovers
    const goingDuration = calculateTotalDuration(goingLayovers);
    const returnDuration = calculateTotalDuration(returnLayovers);

    // Get data from flight response
    const nightsInDestination = flight.nightsInDest;
    const availableSeats = flight.availability.seats;
    const price = flight.conversion[currency];
    const bookingLink = flight.deep_link;

    // Get fare classes (e.g., economy, business) for each layover
    const getFareClasses = (layovers) => {
      return layovers.map((stop) => {
        const fareCategory = stop.fare_category;
        const className = Object.keys(travelClassMapping).find(
          (key) => travelClassMapping[key] === fareCategory
        );
        return className || fareCategory;
      });
    };

    let fareClasses = [
      ...getFareClasses(goingLayovers),
      ...getFareClasses(returnLayovers),
    ];

    // Filter out duplicate classes
    fareClasses = [...new Set(fareClasses)];

    // Join unique fare classes into a string
    const fareClassesStr = fareClasses.join(" + ");

    return (
      /*Main flight result container */
      <div className="flight-result" key={index}>
        {/* Different rendering if the ticket its one way */}
        <div
          className={`ticket-content ${
            tripType === "One way" ? "ticket-content-one-way" : ""
          }`}
        >
          <div
            className={`flight-result-content ${
              tripType === "One way" ? "flight-result-content-one-way" : ""
            }`}
          >
            {/*  Display the departure and arrival times and the departure and arrival cities */}
            <div className="flight-info">
              <div className="flight-date-duration">
                <p className="date">
                  {formatDate(firstGoingFlight.local_departure)}
                </p>
                <p className="time">
                  {extractTime(firstGoingFlight.local_departure)} -{" "}
                  {extractTime(lastGoingFlight.local_arrival)}
                </p>
              </div>
              <div className="flight-time-details">
                <p className="duration">{formatDuration(goingDuration)}</p>
                <p className="departure-arrival">
                  {flight.cityFrom} ({flight.flyFrom}) → {flight.cityTo} (
                  {flight.flyTo})
                </p>
              </div>
            </div>
            {/*Display baggage limit if there is a hand bag limit for the flight*/}
            {flight.baglimit.hand_weight > 0 && (
              <div
                className={`hand-bag ${
                  tripType === "One way"
                    ? "hand-bag-one-way"
                    : "hand-bag-return"
                }`}
              >
                <span className="material-symbols-outlined luggage">
                  luggage
                </span>
                {/*Display the baggage limit based on the number of passengers and weight limit*/}
                <span className="bag-limit">
                  {passengers["adults"] +
                    passengers["children"] +
                    passengers["infants"]}{" "}
                  x {flight.baglimit.hand_weight} kg
                </span>
                <div className="tooltip">Cabin bags included</div>
              </div>
            )}
            <div
              className={`travel-class ${
                tripType === "One way"
                  ? "travel-class-one-way"
                  : "travel-class-return"
              }`}
            >
              {/*Display fare classes, and nights in destination if its a return flight*/}
              <span>{fareClassesStr}</span>
              <div className="tooltip">Travel Class</div>
            </div>
            {tripType === "Return" && (
              <>
                <p className="nights-in-destination">
                  {nightsInDestination} night(s) in {flight.cityTo}
                </p>
                <div className="flight-info">
                  {firstReturnFlight && lastReturnFlight && (
                    <>
                      <div className="flight-date-duration">
                        {/*Format and display the return flights departure date and time */}
                        <p className="date">
                          {formatDate(firstReturnFlight.local_departure)}
                        </p>
                        <p className="time">
                          {extractTime(firstReturnFlight.local_departure)} -{" "}
                          {extractTime(lastReturnFlight.local_arrival)}
                        </p>
                      </div>
                      <div className="flight-time-details">
                        {/*Calculate and display the total duration of the return flight */}
                        <p className="duration">
                          {formatDuration(returnDuration)}
                        </p>
                        <p className="arrival-departure">
                          {flight.cityTo} ({flight.flyTo}) → {flight.cityFrom} (
                          {flight.flyFrom})
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            <hr className="flight-result-divider" />
          </div>

          {/* A container for price and booking details*/}
          <div
            className={`price-container ${
              tripType === "One way" ? "price-container-one-way" : ""
            }`}
          >
            <p className="price">
              {price} {currency}
            </p>
            {/* Display seats if available */}
            {availableSeats && (
              <p className="seats">
                {availableSeats} {availableSeats > 1 ? "seats" : "seat"} left at
                this price
                <span className="tooltip-seat">
                  The number of remaining seats is based on our most recent
                  search. More tickets might be available for this flight, but
                  at a different price.
                </span>
              </p>
            )}
            <button
              className="buy-button"
              onClick={() => window.open(bookingLink, "_blank")}
            >
              Book
            </button>

            {/* Toggle button for flight details */}
            <div className="show-details-container">
              <span
                onClick={() =>
                  setShowDetails((prevState) => ({
                    ...prevState,
                    [index]: !prevState[index],
                  }))
                }
              >
                {showDetails[index] ? "Close details" : "Show details"}
                {showDetails[index] ? (
                  <i className="material-icons custom-show">expand_less</i>
                ) : (
                  <i className="material-icons custom-show">expand_more</i>
                )}
              </span>
            </div>
          </div>
        </div>
        {/*if the flight details are shown render the layovers */}
        {showDetails[index] && (
          <div
            className={`layovers-container ${
              tripType === "One way" ? "layovers-container-one-way" : ""
            }`}
          >
            {
              <RenderLayovers
                layovers={goingLayovers}
                flights={flights}
                isReturn={false}
                duration={goingDuration}
                findAirlineDetails={findAirlineDetails}
              />
            }
            {tripType === "Return" && (
              <>
                <RenderLayovers
                  layovers={returnLayovers}
                  flights={flights}
                  isReturn={true}
                  duration={returnDuration}
                  findAirlineDetails={findAirlineDetails}
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  });
};

export default RenderFlights;
