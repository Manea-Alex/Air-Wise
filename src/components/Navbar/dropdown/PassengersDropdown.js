import React, { useState, useEffect, useRef } from "react";

const PassengerDropdown = ({
  passengers,
  setPassengers,
  incrementPassenger,
  decrementPassenger,
  tempPassengers,
  setTempPassengers,
}) => {
  const [passengersDropdown, setPassengersDropdown] = useState(false);
  const passengersRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        passengersDropdown &&
        passengersRef.current &&
        !passengersRef.current.contains(e.target)
      ) {
        setPassengersDropdown(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [passengersDropdown]);

  return (
    <div className="navbar-item" ref={passengersRef}>
      <span onClick={() => setPassengersDropdown(!passengersDropdown)}>
        Passengers{" "}
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {passengersDropdown && (
        <div className="dropdown passengers-dropdown">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setPassengersDropdown(false);

                setTempPassengers({ ...passengers });
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setPassengers({ ...tempPassengers });
                setPassengersDropdown(false);
              }}
            >
              Done
            </button>
          </div>
          <div className="passenger-row">
            <div className="passenger-info">
              <i className="material-symbols-sharp adult">person</i>
              <div>
                <span>Adults</span>
                <p>Over 11</p>
              </div>
            </div>
            <button
              className="substract"
              onClick={() => decrementPassenger("adults")}
            >
              <i className="material-symbols-sharp substract">remove</i>
            </button>
            <input type="number" value={tempPassengers.adults} readOnly />
            <button
              className="add"
              onClick={() => incrementPassenger("adults")}
            >
              <i className="material-symbols-sharp add">add</i>
            </button>
          </div>
          <div className="passenger-row">
            <div className="passenger-info">
              <i className="material-symbols-sharp child">
                sentiment_satisfied
              </i>
              <div>
                <span>Children</span>
                <p className="children-p">2-11</p>
              </div>
            </div>
            <button
              className="substract"
              onClick={() => decrementPassenger("children")}
            >
              <i className="material-symbols-sharp substract">remove</i>
            </button>
            <input type="number" value={tempPassengers.children} readOnly />
            <button
              className="add"
              onClick={() => incrementPassenger("children")}
            >
              <i className="material-symbols-sharp add">add</i>
            </button>
          </div>
          <div className="passenger-row">
            <div className="passenger-info">
              <i className="material-symbols-sharp infant">child_care</i>
              <div>
                <span>Infants</span>
                <p>Under 2</p>
              </div>
            </div>
            <button
              className="substract"
              onClick={() => decrementPassenger("infants")}
            >
              <i className="material-symbols-sharp substract">remove</i>
            </button>
            <input type="number" value={tempPassengers.infants} readOnly />
            <button
              className="add"
              onClick={() => incrementPassenger("infants")}
            >
              <i className="material-symbols-sharp add">add</i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDropdown;
