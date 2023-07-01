// Import airports data
import airports from "../airport/air.json";

// fetches suggestions based on user input
const fetchSuggestions = async (inputValue) => {
  // If inputValue is less than 3 characters return an empty array
  if (inputValue.length < 3) {
    return [];
  }

  const searchValue = inputValue.toLowerCase();

  // Check if inputValue is in all caps, used later to decide if we should match airport codes
  const isAllCaps = inputValue.toUpperCase() === inputValue;

  // Return matches
  const filteredSuggestions = airports
    .filter((airport) => airport.IATA !== "\\N") // Filter out airports with "\\N" IATA code
    .filter((airport) => {
      const nameMatch = airport.city.toLowerCase().includes(searchValue);
      const countryMatch = airport.country.toLowerCase().includes(searchValue);
      const codeMatch = airport.IATA && airport.IATA.includes(inputValue);

      if (isAllCaps) {
        return codeMatch;
      } else {
        return nameMatch || countryMatch;
      }
    });

  return filteredSuggestions.map((suggestion) => {
    return `${suggestion.city}, ${suggestion.country} - ${suggestion.IATA}`.trim();
  });
};

export default fetchSuggestions;
