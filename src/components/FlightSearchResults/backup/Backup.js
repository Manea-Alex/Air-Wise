import React, { useState } from "react";
import "./FlightSearchResults.css";
import airlines from "../../AirportsData/airline.json";
import moment from "moment";
import {
  formatDuration,
  extractTime,
  formatDate,
  formatTimeFromISOString,
  formatDateFromISOString,
} from "../functions/utils";

const FlightSearchResults = ({
  flights,
  tripType,
  currency,
  areResultsVisible,
  passengers,
  travelClassMapping,
  isSearchButtonClicked,
}) => {
  // Function to format the duration of flights into a more readable format
  const formatDuration = (duration) => {
    const days = Math.floor(duration / 86400);
    const hours = Math.floor((duration % 86400) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return days > 0
      ? `${days}d ${hours}h ${minutes}m`
      : `${hours}h ${minutes}m`;
  };
  const [showDetails, setShowDetails] = useState({});
  const [visible, setVisible] = useState(5);

  // find and return airline details using the airlineCode, creates 2 more fields to the airline
  const findAirlineDetails = (airlineCode) => {
    const airline = airlines.find((a) => a.id === airlineCode);
    return airline ? { name: airline.name, logo: airline.logo } : null;
  };

  // extract the hours and minutes for the flights
  const extractTime = (timeString) => {
    const timeComponents = timeString.split("T")[1].split(":");
    const hours = String(timeComponents[0]).padStart(2, "0");
    const minutes = String(timeComponents[1]).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = dayAbbreviations[date.getDay()];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const dayOfMonth = date.getDate();
    return `${day}, ${dayOfMonth} ${month}`;
  };

  // // Format date function for strings (not Date object) so i get the correct time
  const formatTimeFromISOString = (dateString) => {
    const date = moment.parseZone(dateString);
    return date.format("HH:mm");
  };

  const formatDateFromISOString = (dateString) => {
    const date = moment.parseZone(dateString);
    return date.format("ddd, D MMM");
  };

  //divide the  route into two parts, going and return
  const separateLayovers = (route) => {
    const goingLayovers = [];
    const returnLayovers = [];

    let processingReturn = false;
    //If the 'cityFrom' of the stop is the same as the destination city of the first flight it means we reached the return journey.
    for (const stop of route) {
      if (!processingReturn && stop.cityFrom === flights[0].cityTo) {
        processingReturn = true;
      }

      if (!processingReturn) {
        goingLayovers.push(stop);
      } else {
        returnLayovers.push(stop);
      }
    }

    return { goingLayovers, returnLayovers };
  };

  //calculates the entire duration of a route
  const calculateTotalDuration = (layovers) => {
    let totalDuration = 0;

    for (let i = 0; i < layovers.length; i++) {
      const currentStop = layovers[i];
      const currentDeparture = new Date(currentStop.utc_departure);
      const currentArrival = new Date(currentStop.utc_arrival);

      const currentDuration = (currentArrival - currentDeparture) / 1000;

      totalDuration += currentDuration;

      if (i < layovers.length - 1) {
        const nextStop = layovers[i + 1];
        const nextDeparture = new Date(nextStop.utc_departure);

        //The waiting time is the difference between the arrival of the current flight and the departure of the next flight
        const waitingTime = (nextDeparture - currentArrival) / 1000;
        totalDuration += waitingTime;
      }
    }

    return totalDuration;
  };

  // State variables for the sorting options
  const [sortOrder, setSortOrder] = useState("Cheapest");
  const [selectedOption, setSelectedOption] = useState("Cheapest");

  // Array of sorting options for flights
  const sortOptions = [
    {
      label: "Cheapest",
      sortFunction: () => {
        setSelectedOption("Cheapest");
        setSortOrder("Cheapest");
      },
      displayData: () => {
        if (!isSearchButtonClicked || !flights || flights.length === 0) {
          return "";
        }

        // Map each flight to a new object that includes total duration
        const flightsWithTotalDuration = flights.map((flight) => {
          const { goingLayovers, returnLayovers } = separateLayovers(
            flight.route
          );

          // Calculate durations of going and returning layovers
          const goingDuration = calculateTotalDuration(goingLayovers);
          const returnDuration = calculateTotalDuration(returnLayovers);
          const totalDuration = goingDuration + returnDuration;

          // Return new object that includes total duration
          return {
            ...flight,
            totalDuration,
          };
        });

        //Store a flight object which has the lowest price among all the flights
        const cheapestFlight = flightsWithTotalDuration.reduce(
          (prevFlight, currentFlight) => {
            //failsafe check
            return (prevFlight?.conversion[currency] || Infinity) <
              (currentFlight?.conversion[currency] || Infinity)
              ? prevFlight
              : currentFlight;
          }
        );

        const cheapestFlightDuration = cheapestFlight.totalDuration;

        const cheapestFlightPrice = cheapestFlight.conversion[currency];
        return `${cheapestFlightPrice} ${currency} - ${formatDuration(
          cheapestFlightDuration
        )}`;
      },
    },
    {
      label: "Fastest",
      sortFunction: () => {
        setSelectedOption("Fastest");
        setSortOrder("Fastest");
      },
      displayData: () => {
        if (!isSearchButtonClicked || !flights || flights.length === 0) {
          return "";
        }

        // Map each flight to a new object that includes total duration
        const flightsWithTotalDuration = flights.map((flight) => {
          const { goingLayovers, returnLayovers } = separateLayovers(
            flight.route
          );

          // Calculate durations of going and returning layovers
          const goingDuration = calculateTotalDuration(goingLayovers);
          const returnDuration = calculateTotalDuration(returnLayovers);
          const totalDuration = goingDuration + returnDuration;

          // Return new object that includes total duration
          return {
            ...flight,
            totalDuration,
          };
        });

        // Find the shortest duration among all flights
        const fastestFlightDuration = Math.min(
          ...flightsWithTotalDuration.map((flight) => flight.totalDuration)
        );

        // Get all flights with the shortest duration
        const fastestFlights = flightsWithTotalDuration.filter(
          (flight) => flight.totalDuration === fastestFlightDuration
        );

        // Among the fastest flights, find the cheapest one
        const cheapestAmongFastest = fastestFlights.reduce(
          (prevFlight, currentFlight) => {
            return (prevFlight?.conversion[currency] || Infinity) <
              (currentFlight?.conversion[currency] || Infinity)
              ? prevFlight
              : currentFlight;
          }
        );

        const cheapestFastestFlightPrice =
          cheapestAmongFastest.conversion[currency];
        return `${cheapestFastestFlightPrice} ${currency} - ${formatDuration(
          fastestFlightDuration
        )}`;
      },
    },
  ];

  // render flight layovers
  const renderLayovers = (layovers, isReturn = false, duration = 0) => {
    // Use different container class based on whether its a return or a departure layover
    return (
      <div className={isReturn ? "return-container" : "departure-container"}>
        <h3 className="city-names">
          {isReturn
            ? `${flights[0].cityTo} → ${flights[0].cityFrom}`
            : `${flights[0].cityFrom} → ${flights[0].cityTo}`}
        </h3>
        {/* Show duration of this part of the journey*/}
        <p className="details-duration">Duration: {formatDuration(duration)}</p>
        {/* For each layover render the details */}
        {layovers.map((stop, index) => {
          const currentDeparture = stop.local_departure;
          const currentArrival = stop.local_arrival;
          const currentDuration =
            (new Date(stop.utc_arrival) - new Date(stop.utc_departure)) / 1000;

          /* If this is not the last layover, calculate waiting time until next flight */

          let waitingTime = 0;
          if (index < layovers.length - 1) {
            const nextStop = layovers[index + 1];
            const nextDeparture = new Date(nextStop.utc_departure);
            waitingTime = (nextDeparture - new Date(stop.utc_arrival)) / 1000;
          }

          /*Get airline logo and name */

          const airlineCode = stop.airline;
          const airlineDetails = findAirlineDetails(airlineCode);
          const airlineLogo = airlineDetails ? airlineDetails.logo : "";
          const airlineName = airlineDetails ? airlineDetails.name : "";

          return (
            <React.Fragment key={index}>
              <div className="flight-container">
                <div className="vertical-line">
                  <i className="material-icons flight">flight</i>
                </div>
                <div className="flight-details">
                  {/*Display departure time and date, and city of departure */}
                  <div className="info-departure">
                    <div className="info">
                      <p>{formatTimeFromISOString(currentDeparture)}</p>
                      <p>{formatDateFromISOString(currentDeparture)}</p>
                    </div>
                    <div className="departure">
                      <p>{stop.cityFrom}</p>
                      <p>({stop.flyFrom})</p>
                    </div>
                  </div>
                  {/*Display flight duration and airline logo */}
                  <div className="logo-and-duration">
                    <div className="duration">
                      <p>Duration: {formatDuration(currentDuration)}</p>
                    </div>
                    <div className="logo">
                      {airlineLogo && (
                        <>
                          <img src={airlineLogo} alt={`${airlineName} logo`} />
                          <p>{airlineName}</p>
                          {console.log(airlineLogo)}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="info-arrival">
                    {/*Display arrival time and date, and city of arrival */}
                    <div className="info">
                      <p>{formatTimeFromISOString(currentArrival)}</p>
                      <p>{formatDateFromISOString(currentArrival)}</p>
                    </div>
                    <div className="arrival">
                      <p>{stop.cityTo}</p>
                      <p>({stop.flyTo})</p>
                    </div>
                  </div>
                </div>
              </div>
              {/*If its not the last layover display the waiting time */}
              {index < layovers.length - 1 && (
                <div className="waiting-time">
                  <p className="layover">
                    <span className="material-symbols-outlined schedule">
                      schedule
                    </span>
                    {formatDuration(waitingTime)} layover
                  </p>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  {
    /*Function to render flights*/
  }
  const renderFlights = () => {
    // Map over each flight, calculate the total duration and separate the layovers for the going and return flights
    const flightsWithTotalDuration = flights.map((flight) => {
      const { goingLayovers, returnLayovers } = separateLayovers(flight.route);
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

    // Sorting the flights based on the sortOrder state value
    switch (sortOrder) {
      case "Cheapest":
        sortedFlights.sort(
          (a, b) => a.conversion[currency] - b.conversion[currency]
        );
        break;
      case "Fastest":
        sortedFlights.sort(
          (a, b) =>
            a.goingDuration +
            a.returnDuration -
            (b.goingDuration + b.returnDuration)
        );
        break;
      default:
        break;
    }
    return sortedFlights.slice(0, visible).map((flight, index) => {
      // Separate the flight routes into going and returning layovers
      const { goingLayovers, returnLayovers } = separateLayovers(flight.route);
      // Get the first and last flights in the layovers (for display of departure and arrival times)
      const firstGoingFlight = goingLayovers[0];
      const lastGoingFlight = goingLayovers[goingLayovers.length - 1];

      // same for return flights, if there are any
      const firstReturnFlight = returnLayovers.length
        ? returnLayovers[0]
        : null;
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
                            {flight.cityTo} ({flight.flyTo}) → {flight.cityFrom}{" "}
                            ({flight.flyFrom})
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
                  {availableSeats} {availableSeats > 1 ? "seats" : "seat"} left
                  at this price
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
              {renderLayovers(goingLayovers, false, goingDuration)}
              {tripType === "Return" && (
                <>{renderLayovers(returnLayovers, true, returnDuration)}</>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  {
    /*Container for flight search results */
  }
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
        {areResultsVisible && renderFlights()}
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

// import React, { useState } from "react";
// import "./FlightSearchResults.css";
// import airlines from "../../airport/airline.json";
// import {
//   formatDuration,
//   extractTime,
//   formatDate,
//   formatTimeFromISOString,
//   formatDateFromISOString,
//   separateLayovers,
//   calculateTotalDuration,
//   findAirlineDetails,
// } from "./utils";

// const FlightSearchResults = ({
//   flights,
//   tripType,
//   currency,
//   areResultsVisible,
//   passengers,
//   travelClassMapping,
//   isSearchButtonClicked,
// }) => {
//   const [showDetails, setShowDetails] = useState({});
//   const [visible, setVisible] = useState(5);

//   // find and return airline details using the airlineCode, creates 2 more fields to the airline
//   // const findAirlineDetails = (airlineCode) => {
//   //   const airline = airlines.find((a) => a.id === airlineCode);
//   //   return airline ? { name: airline.name, logo: airline.logo } : null;
//   // };

//   // //divide the  route into two parts, going and return
//   // const separateLayovers = (route) => {
//   //   const goingLayovers = [];
//   //   const returnLayovers = [];

//   //   let processingReturn = false;
//   //   //If the 'cityFrom' of the stop is the same as the destination city of the first flight it means we reached the return journey.
//   //   for (const stop of route) {
//   //     if (!processingReturn && stop.cityFrom === flights[0].cityTo) {
//   //       processingReturn = true;
//   //     }

//   //     if (!processingReturn) {
//   //       goingLayovers.push(stop);
//   //     } else {
//   //       returnLayovers.push(stop);
//   //     }
//   //   }

//   //   return { goingLayovers, returnLayovers };
//   // };

//   // //calculates the entire duration of a route
//   // const calculateTotalDuration = (layovers) => {
//   //   let totalDuration = 0;

//   //   for (let i = 0; i < layovers.length; i++) {
//   //     const currentStop = layovers[i];
//   //     const currentDeparture = new Date(currentStop.utc_departure);
//   //     const currentArrival = new Date(currentStop.utc_arrival);

//   //     const currentDuration = (currentArrival - currentDeparture) / 1000;

//   //     totalDuration += currentDuration;

//   //     if (i < layovers.length - 1) {
//   //       const nextStop = layovers[i + 1];
//   //       const nextDeparture = new Date(nextStop.utc_departure);

//   //       //The waiting time is the difference between the arrival of the current flight and the departure of the next flight
//   //       const waitingTime = (nextDeparture - currentArrival) / 1000;
//   //       totalDuration += waitingTime;
//   //     }
//   //   }

//   //   return totalDuration;
//   // };

//   // State variables for the sorting options
//   const [sortOrder, setSortOrder] = useState("Cheapest");
//   const [selectedOption, setSelectedOption] = useState("Cheapest");

//   // Array of sorting options for flights
//   const sortOptions = [
//     {
//       label: "Cheapest",
//       sortFunction: () => {
//         setSelectedOption("Cheapest");
//         setSortOrder("Cheapest");
//       },
//       displayData: () => {
//         if (!isSearchButtonClicked || !flights || flights.length === 0) {
//           return "";
//         }

//         // Map each flight to a new object that includes total duration
//         const flightsWithTotalDuration = flights.map((flight) => {
//           const { goingLayovers, returnLayovers } = separateLayovers(
//             flight.route
//           );

//           // Calculate durations of going and returning layovers
//           const goingDuration = calculateTotalDuration(goingLayovers);
//           const returnDuration = calculateTotalDuration(returnLayovers);
//           const totalDuration = goingDuration + returnDuration;

//           // Return new object that includes total duration
//           return {
//             ...flight,
//             totalDuration,
//           };
//         });

//         //Store a flight object which has the lowest price among all the flights
//         const cheapestFlight = flightsWithTotalDuration.reduce(
//           (prevFlight, currentFlight) => {
//             //failsafe check
//             return (prevFlight?.conversion[currency] || Infinity) <
//               (currentFlight?.conversion[currency] || Infinity)
//               ? prevFlight
//               : currentFlight;
//           }
//         );

//         const cheapestFlightDuration = cheapestFlight.totalDuration;

//         const cheapestFlightPrice = cheapestFlight.conversion[currency];
//         return `${cheapestFlightPrice} ${currency} - ${formatDuration(
//           cheapestFlightDuration
//         )}`;
//       },
//     },
//     {
//       label: "Fastest",
//       sortFunction: () => {
//         setSelectedOption("Fastest");
//         setSortOrder("Fastest");
//       },
//       displayData: () => {
//         if (!isSearchButtonClicked || !flights || flights.length === 0) {
//           return "";
//         }

//         // Map each flight to a new object that includes total duration
//         const flightsWithTotalDuration = flights.map((flight) => {
//           const { goingLayovers, returnLayovers } = separateLayovers(
//             flight.route
//           );

//           // Calculate durations of going and returning layovers
//           const goingDuration = calculateTotalDuration(goingLayovers);
//           const returnDuration = calculateTotalDuration(returnLayovers);
//           const totalDuration = goingDuration + returnDuration;

//           // Return new object that includes total duration
//           return {
//             ...flight,
//             totalDuration,
//           };
//         });

//         // Find the shortest duration among all flights
//         const fastestFlightDuration = Math.min(
//           ...flightsWithTotalDuration.map((flight) => flight.totalDuration)
//         );

//         // Get all flights with the shortest duration
//         const fastestFlights = flightsWithTotalDuration.filter(
//           (flight) => flight.totalDuration === fastestFlightDuration
//         );

//         // Among the fastest flights, find the cheapest one
//         const cheapestAmongFastest = fastestFlights.reduce(
//           (prevFlight, currentFlight) => {
//             return (prevFlight?.conversion[currency] || Infinity) <
//               (currentFlight?.conversion[currency] || Infinity)
//               ? prevFlight
//               : currentFlight;
//           }
//         );

//         const cheapestFastestFlightPrice =
//           cheapestAmongFastest.conversion[currency];
//         return `${cheapestFastestFlightPrice} ${currency} - ${formatDuration(
//           fastestFlightDuration
//         )}`;
//       },
//     },
//   ];

//   // render flight layovers
//   const renderLayovers = (layovers, isReturn = false, duration = 0) => {
//     // Use different container class based on whether its a return or a departure layover
//     return (
//       <div className={isReturn ? "return-container" : "departure-container"}>
//         <h3 className="city-names">
//           {isReturn
//             ? `${flights[0].cityTo} → ${flights[0].cityFrom}`
//             : `${flights[0].cityFrom} → ${flights[0].cityTo}`}
//         </h3>
//         {/* Show duration of this part of the journey*/}
//         <p className="details-duration">Duration: {formatDuration(duration)}</p>
//         {/* For each layover render the details */}
//         {layovers.map((stop, index) => {
//           const currentDeparture = stop.local_departure;
//           const currentArrival = stop.local_arrival;
//           const currentDuration =
//             (new Date(stop.utc_arrival) - new Date(stop.utc_departure)) / 1000;

//           /* If this is not the last layover, calculate waiting time until next flight */

//           let waitingTime = 0;
//           if (index < layovers.length - 1) {
//             const nextStop = layovers[index + 1];
//             const nextDeparture = new Date(nextStop.utc_departure);
//             waitingTime = (nextDeparture - new Date(stop.utc_arrival)) / 1000;
//           }

//           /*Get airline logo and name */

//           const airlineCode = stop.airline;
//           const airlineDetails = findAirlineDetails(airlineCode);
//           const airlineLogo = airlineDetails ? airlineDetails.logo : "";
//           const airlineName = airlineDetails ? airlineDetails.name : "";

//           return (
//             <React.Fragment key={index}>
//               <div className="flight-container">
//                 <div className="vertical-line">
//                   <i className="material-icons flight">flight</i>
//                 </div>
//                 <div className="flight-details">
//                   {/*Display departure time and date, and city of departure */}
//                   <div className="info-departure">
//                     <div className="info">
//                       <p>{formatTimeFromISOString(currentDeparture)}</p>
//                       <p>{formatDateFromISOString(currentDeparture)}</p>
//                     </div>
//                     <div className="departure">
//                       <p>{stop.cityFrom}</p>
//                       <p>({stop.flyFrom})</p>
//                     </div>
//                   </div>
//                   {/*Display flight duration and airline logo */}
//                   <div className="logo-and-duration">
//                     <div className="duration">
//                       <p>Duration: {formatDuration(currentDuration)}</p>
//                     </div>
//                     <div className="logo">
//                       {airlineLogo && (
//                         <>
//                           <img src={airlineLogo} alt={`${airlineName} logo`} />
//                           <p>{airlineName}</p>
//                           {console.log(airlineLogo)}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <div className="info-arrival">
//                     {/*Display arrival time and date, and city of arrival */}
//                     <div className="info">
//                       <p>{formatTimeFromISOString(currentArrival)}</p>
//                       <p>{formatDateFromISOString(currentArrival)}</p>
//                     </div>
//                     <div className="arrival">
//                       <p>{stop.cityTo}</p>
//                       <p>({stop.flyTo})</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/*If its not the last layover display the waiting time */}
//               {index < layovers.length - 1 && (
//                 <div className="waiting-time">
//                   <p className="layover">
//                     <span className="material-symbols-outlined schedule">
//                       schedule
//                     </span>
//                     {formatDuration(waitingTime)} layover
//                   </p>
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>
//     );
//   };

//   {
//     /*Function to render flights*/
//   }
//   const renderFlights = () => {
//     // Map over each flight, calculate the total duration and separate the layovers for the going and return flights
//     const flightsWithTotalDuration = flights.map((flight) => {
//       const { goingLayovers, returnLayovers } = separateLayovers(flight.route);
//       const goingDuration = calculateTotalDuration(goingLayovers);
//       const returnDuration = calculateTotalDuration(returnLayovers);
//       const totalDuration = formatDuration(goingDuration + returnDuration);

//       return {
//         ...flight,
//         goingDuration,
//         returnDuration,
//         totalDuration,
//         goingLayovers,
//         returnLayovers,
//       };
//     });

//     let sortedFlights = [...flightsWithTotalDuration];

//     // Sorting the flights based on the sortOrder state value
//     switch (sortOrder) {
//       case "Cheapest":
//         sortedFlights.sort(
//           (a, b) => a.conversion[currency] - b.conversion[currency]
//         );
//         break;
//       case "Fastest":
//         sortedFlights.sort(
//           (a, b) =>
//             a.goingDuration +
//             a.returnDuration -
//             (b.goingDuration + b.returnDuration)
//         );
//         break;
//       default:
//         break;
//     }
//     return sortedFlights.slice(0, visible).map((flight, index) => {
//       // Separate the flight routes into going and returning layovers
//       const { goingLayovers, returnLayovers } = separateLayovers(flight.route);
//       // Get the first and last flights in the layovers (for display of departure and arrival times)
//       const firstGoingFlight = goingLayovers[0];
//       const lastGoingFlight = goingLayovers[goingLayovers.length - 1];

//       // same for return flights, if there are any
//       const firstReturnFlight = returnLayovers.length
//         ? returnLayovers[0]
//         : null;
//       const lastReturnFlight = returnLayovers.length
//         ? returnLayovers[returnLayovers.length - 1]
//         : null;

//       // Calculate total duration of the flight, including layovers
//       const goingDuration = calculateTotalDuration(goingLayovers);
//       const returnDuration = calculateTotalDuration(returnLayovers);

//       // Get data from flight response
//       const nightsInDestination = flight.nightsInDest;
//       const availableSeats = flight.availability.seats;
//       const price = flight.conversion[currency];
//       const bookingLink = flight.deep_link;

//       // Get fare classes (e.g., economy, business) for each layover
//       const getFareClasses = (layovers) => {
//         return layovers.map((stop) => {
//           const fareCategory = stop.fare_category;
//           const className = Object.keys(travelClassMapping).find(
//             (key) => travelClassMapping[key] === fareCategory
//           );
//           return className || fareCategory;
//         });
//       };

//       let fareClasses = [
//         ...getFareClasses(goingLayovers),
//         ...getFareClasses(returnLayovers),
//       ];

//       // Filter out duplicate classes
//       fareClasses = [...new Set(fareClasses)];

//       // Join unique fare classes into a string
//       const fareClassesStr = fareClasses.join(" + ");

//       return (
//         /*Main flight result container */
//         <div className="flight-result" key={index}>
//           {/* Different rendering if the ticket its one way */}
//           <div
//             className={`ticket-content ${
//               tripType === "One way" ? "ticket-content-one-way" : ""
//             }`}
//           >
//             <div
//               className={`flight-result-content ${
//                 tripType === "One way" ? "flight-result-content-one-way" : ""
//               }`}
//             >
//               {/*  Display the departure and arrival times and the departure and arrival cities */}
//               <div className="flight-info">
//                 <div className="flight-date-duration">
//                   <p className="date">
//                     {formatDate(firstGoingFlight.local_departure)}
//                   </p>
//                   <p className="time">
//                     {extractTime(firstGoingFlight.local_departure)} -{" "}
//                     {extractTime(lastGoingFlight.local_arrival)}
//                   </p>
//                 </div>
//                 <div className="flight-time-details">
//                   <p className="duration">{formatDuration(goingDuration)}</p>
//                   <p className="departure-arrival">
//                     {flight.cityFrom} ({flight.flyFrom}) → {flight.cityTo} (
//                     {flight.flyTo})
//                   </p>
//                 </div>
//               </div>
//               {/*Display baggage limit if there is a hand bag limit for the flight*/}
//               {flight.baglimit.hand_weight > 0 && (
//                 <div
//                   className={`hand-bag ${
//                     tripType === "One way"
//                       ? "hand-bag-one-way"
//                       : "hand-bag-return"
//                   }`}
//                 >
//                   <span className="material-symbols-outlined luggage">
//                     luggage
//                   </span>
//                   {/*Display the baggage limit based on the number of passengers and weight limit*/}
//                   <span className="bag-limit">
//                     {passengers["adults"] +
//                       passengers["children"] +
//                       passengers["infants"]}{" "}
//                     x {flight.baglimit.hand_weight} kg
//                   </span>
//                   <div className="tooltip">Cabin bags included</div>
//                 </div>
//               )}
//               <div
//                 className={`travel-class ${
//                   tripType === "One way"
//                     ? "travel-class-one-way"
//                     : "travel-class-return"
//                 }`}
//               >
//                 {/*Display fare classes, and nights in destination if its a return flight*/}
//                 <span>{fareClassesStr}</span>
//                 <div className="tooltip">Travel Class</div>
//               </div>
//               {tripType === "Return" && (
//                 <>
//                   <p className="nights-in-destination">
//                     {nightsInDestination} night(s) in {flight.cityTo}
//                   </p>
//                   <div className="flight-info">
//                     {firstReturnFlight && lastReturnFlight && (
//                       <>
//                         <div className="flight-date-duration">
//                           {/*Format and display the return flights departure date and time */}
//                           <p className="date">
//                             {formatDate(firstReturnFlight.local_departure)}
//                           </p>
//                           <p className="time">
//                             {extractTime(firstReturnFlight.local_departure)} -{" "}
//                             {extractTime(lastReturnFlight.local_arrival)}
//                           </p>
//                         </div>
//                         <div className="flight-time-details">
//                           {/*Calculate and display the total duration of the return flight */}
//                           <p className="duration">
//                             {formatDuration(returnDuration)}
//                           </p>
//                           <p className="arrival-departure">
//                             {flight.cityTo} ({flight.flyTo}) → {flight.cityFrom}{" "}
//                             ({flight.flyFrom})
//                           </p>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </>
//               )}
//               <hr className="flight-result-divider" />
//             </div>

//             {/* A container for price and booking details*/}
//             <div
//               className={`price-container ${
//                 tripType === "One way" ? "price-container-one-way" : ""
//               }`}
//             >
//               <p className="price">
//                 {price} {currency}
//               </p>
//               {/* Display seats if available */}
//               {availableSeats && (
//                 <p className="seats">
//                   {availableSeats} {availableSeats > 1 ? "seats" : "seat"} left
//                   at this price
//                   <span className="tooltip-seat">
//                     The number of remaining seats is based on our most recent
//                     search. More tickets might be available for this flight, but
//                     at a different price.
//                   </span>
//                 </p>
//               )}
//               <button
//                 className="buy-button"
//                 onClick={() => window.open(bookingLink, "_blank")}
//               >
//                 Book
//               </button>

//               {/* Toggle button for flight details */}
//               <div className="show-details-container">
//                 <span
//                   onClick={() =>
//                     setShowDetails((prevState) => ({
//                       ...prevState,
//                       [index]: !prevState[index],
//                     }))
//                   }
//                 >
//                   {showDetails[index] ? "Close details" : "Show details"}
//                   {showDetails[index] ? (
//                     <i className="material-icons custom-show">expand_less</i>
//                   ) : (
//                     <i className="material-icons custom-show">expand_more</i>
//                   )}
//                 </span>
//               </div>
//             </div>
//           </div>
//           {/*if the flight details are shown render the layovers */}
//           {showDetails[index] && (
//             <div
//               className={`layovers-container ${
//                 tripType === "One way" ? "layovers-container-one-way" : ""
//               }`}
//             >
//               {renderLayovers(goingLayovers, false, goingDuration)}
//               {tripType === "Return" && (
//                 <>{renderLayovers(returnLayovers, true, returnDuration)}</>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   {
//     /*Container for flight search results */
//   }
//   return (
//     <div
//       className="wrapper"
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "column",
//       }}
//     >
//       {/*In case of no result, display the appropriate image and text */}
//       {flights.length === 0 && isSearchButtonClicked && (
//         <div className="no-result">
//           <img
//             src="https://www.kiwi.com/images/results/illustration-no-results_2x.png?v=1"
//             alt="No flights"
//           />
//           <div>We couldn't find your trip.</div>
//           <p>Try selecting different dates or other places.</p>
//         </div>
//       )}
//       {/*Sorting options */}
//       {flights.length > 0 && (
//         <div className="sorting-options">
//           {flights &&
//             areResultsVisible &&
//             sortOptions.map((option, index) => (
//               <div
//                 key={index}
//                 className={`sorting-option ${
//                   selectedOption === option.label ? "selected" : ""
//                 }`}
//                 onClick={option.sortFunction}
//               >
//                 <span className="option-label">{option.label}</span>
//                 <p className="display-data">{option.displayData()}</p>
//               </div>
//             ))}
//         </div>
//       )}

//       {/*Flight results */}
//       <div className="results-container">
//         {areResultsVisible && renderFlights()}
//         {visible < flights.length && areResultsVisible && (
//           <button className="load-more" onClick={() => setVisible(visible + 5)}>
//             Load More
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FlightSearchResults;
