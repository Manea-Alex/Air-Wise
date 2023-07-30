import React from "react";
import SeparateLayovers from "../flight processing/SeparateLayovers";
import { calculateTotalDuration, formatDuration } from "../functions/utils";

const SortOptions = ({
  setSortOrder,
  flights,
  currency,
  isSearchButtonClicked,
}) => {
  const [selectedOption, setSelectedOption] = React.useState("Cheapest");

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
          const { goingLayovers, returnLayovers } = SeparateLayovers(
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
          const { goingLayovers, returnLayovers } = SeparateLayovers(
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

  return { sortOptions, selectedOption, setSelectedOption };
};

export default SortOptions;
