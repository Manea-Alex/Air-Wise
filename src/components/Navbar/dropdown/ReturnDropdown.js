import React, { useRef, useState, useEffect } from "react";

const ReturnDropdown = ({
  tripType,
  setTripType,
  setAreResultsVisible,
  setReturnDate,
  departureDate,
}) => {
  const [returnDropdown, setReturnDropdown] = useState(false);
  const [tempTripType, setTempTripType] = useState(tripType);
  const returnRef = useRef();

  // Handle click outside to close the dropdown
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu, then close it
      if (
        returnDropdown &&
        returnRef.current &&
        !returnRef.current.contains(e.target)
      ) {
        setReturnDropdown(false);
        setTempTripType(tripType);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [returnDropdown, tripType]);

  return (
    <div className="navbar-item" ref={returnRef}>
      <span onClick={() => setReturnDropdown(!returnDropdown)}>
        {tripType}
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {returnDropdown && (
        <div className="dropdown-return">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setReturnDropdown(false);
                setTempTripType(tripType);
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setReturnDropdown(false);
                setTripType(tempTripType);
                setAreResultsVisible(false);
                if (tempTripType === "One way") {
                  setReturnDate(null); // clear the return date when trip type is One way
                }

                if (tempTripType === "Return" && departureDate) {
                  let newReturnDate = new Date(departureDate);
                  newReturnDate.setDate(departureDate.getDate() + 7); // add 7 days to the departure date
                  setReturnDate(newReturnDate); // store as Date object
                }
              }}
            >
              Done
            </button>
          </div>
          <div
            className="dropdown-item"
            onClick={() => {
              setTempTripType("One way");
            }}
          >
            <span className="item-content">
              {tempTripType === "One way" && (
                <span className="checkmark">✓</span>
              )}{" "}
              One way
            </span>
          </div>
          <div
            className="dropdown-item"
            onClick={() => {
              setTempTripType("Return");
            }}
          >
            <span className="item-content">
              {tempTripType === "Return" && (
                <span className="checkmark">✓</span>
              )}{" "}
              Return
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnDropdown;
