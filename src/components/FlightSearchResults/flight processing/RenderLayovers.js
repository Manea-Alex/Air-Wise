import React from "react";
import {
  formatDuration,
  formatTimeFromISOString,
  formatDateFromISOString,
} from "../functions/utils";

// render flight layovers

const RenderLayovers = ({
  layovers,
  flights,
  isReturn = false,
  duration = 0,
  findAirlineDetails,
}) => {
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

export default RenderLayovers;
