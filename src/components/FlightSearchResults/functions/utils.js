import moment from "moment";
import airlines from "../../../airport/airline.json";

// Function to format the duration of flights into a more readable format
export const formatDuration = (duration) => {
  const days = Math.floor(duration / 86400);
  const hours = Math.floor((duration % 86400) / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
};

// extract the hours and minutes for the flights
export const extractTime = (timeString) => {
  const timeComponents = timeString.split("T")[1].split(":");
  const hours = String(timeComponents[0]).padStart(2, "0");
  const minutes = String(timeComponents[1]).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDate = (dateString) => {
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

// Format date function for strings (not Date object) so i get the correct time
export const formatTimeFromISOString = (dateString) => {
  const date = moment.parseZone(dateString);
  return date.format("HH:mm");
};

export const formatDateFromISOString = (dateString) => {
  const date = moment.parseZone(dateString);
  return date.format("ddd, D MMM");
};

//calculates the entire duration of a route
export const calculateTotalDuration = (layovers) => {
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

// find and return airline details using the airlineCode, creates 2 more fields to the airline
export const findAirlineDetails = (airlineCode) => {
  const airline = airlines.find((a) => a.id === airlineCode);
  return airline ? { name: airline.name, logo: airline.logo } : null;
};
