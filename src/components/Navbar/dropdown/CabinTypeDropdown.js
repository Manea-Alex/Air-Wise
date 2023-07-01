import React, { useState, useEffect, useRef } from "react";

const CabinTypeDropdown = ({ travelClass, setTravelClass }) => {
  const [cabinTypeDropdown, setCabinTypeDropdown] = useState(false);
  const [tempTravelClass, setTempTravelClass] = useState(travelClass);
  const cabinTypeRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        cabinTypeDropdown &&
        cabinTypeRef.current &&
        !cabinTypeRef.current.contains(e.target)
      ) {
        setCabinTypeDropdown(false);
        setTempTravelClass(travelClass);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [cabinTypeDropdown, travelClass]);

  return (
    <div className="navbar-item" ref={cabinTypeRef}>
      <span onClick={() => setCabinTypeDropdown(!cabinTypeDropdown)}>
        {travelClass}
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {cabinTypeDropdown && (
        <div className="dropdown">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setCabinTypeDropdown(false);
                setTempTravelClass(travelClass);
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setCabinTypeDropdown(false);
                setTravelClass(tempTravelClass);
              }}
            >
              Done
            </button>
          </div>
          {["Any", "Economy", "Premium Economy", "Business", "First Class"].map(
            (type) => (
              <div
                key={type}
                className="dropdown-item"
                onClick={() => {
                  setTempTravelClass(type);
                }}
              >
                <span className="item-content">
                  {tempTravelClass === type && (
                    <span className="checkmark">✓</span>
                  )}{" "}
                  {type}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CabinTypeDropdown;
