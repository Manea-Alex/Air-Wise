import React, { useState, useEffect, useRef } from "react";

const StopoversDropdown = ({
  stopovers,
  setStopovers,
  tempStopovers,
  setTempStopovers,
  stopoversCustomValue,
  setStopoversCustomValue,
  tempStopoversCustomValue,
  setTempStopoversCustomValue,
  incrementStopovers,
  decrementStopovers,
}) => {
  const [stopoversDropdown, setStopoversDropdown] = useState(false);
  const stopoversRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        stopoversDropdown &&
        stopoversRef.current &&
        !stopoversRef.current.contains(e.target)
      ) {
        setStopoversDropdown(false);
        setTempStopovers(stopovers);
        setTempStopoversCustomValue(stopoversCustomValue);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [stopoversDropdown, stopovers, stopoversCustomValue]);

  // Here goes your component JSX...
  return (
    <div className="navbar-item" ref={stopoversRef}>
      <span onClick={() => setStopoversDropdown(!stopoversDropdown)}>
        Stopovers
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {stopoversDropdown && (
        <div className="dropdown">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setStopoversDropdown(false);
                setTempStopovers(stopovers);
                setTempStopoversCustomValue(stopoversCustomValue);
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setStopoversDropdown(false);
                setStopovers(tempStopovers);
                setStopoversCustomValue(tempStopoversCustomValue);
              }}
            >
              Done
            </button>
          </div>
          <div className="dropdown-item-any">
            <div className="radio-wrapper">
              <input
                type="radio"
                name="stopovers"
                value="Any"
                checked={tempStopovers === "Any"}
                onChange={() => {
                  setTempStopovers("Any");
                  setTempStopoversCustomValue(10);
                }}
              />
              <label>Any</label>
            </div>
          </div>
          <div className="dropdown-item-nonstop">
            <div className="radio-wrapper">
              <input
                type="radio"
                name="stopovers"
                value="Non-stop"
                checked={tempStopovers === "Non-stop"}
                onChange={() => {
                  setTempStopovers("Non-stop");
                  setTempStopoversCustomValue(0);
                }}
              />
              <label>Non-stop (direct flights)</label>
            </div>
          </div>
          <div className="dropdown-item-up-to">
            <div className="radio-wrapper-up-to">
              <input
                type="radio"
                name="stopovers"
                value="Up to"
                checked={tempStopovers === "Up to"}
                onChange={() => setTempStopovers("Up to")}
                readOnly={tempStopovers !== "Up to"}
                max={10}
              />
              <label>Up to</label>
            </div>
            <div className="stopovers-up-to">
              <div
                className={`stopovers-input ${
                  tempStopovers !== "Up to" && "disabled"
                }`}
              >
                <button
                  className="stopover-substract"
                  onClick={() => {
                    decrementStopovers();
                  }}
                  disabled={tempStopovers !== "Up to"}
                >
                  <i className="material-symbols-sharp substract-stopover">
                    remove
                  </i>
                </button>
                <input
                  className="input"
                  type="number"
                  value={tempStopoversCustomValue}
                  readOnly={tempStopovers !== "Up to"}
                  onChange={(e) =>
                    setTempStopoversCustomValue(parseInt(e.target.value, 10))
                  }
                />
                <button
                  className="stopover-add"
                  onClick={() => {
                    incrementStopovers();
                  }}
                  disabled={tempStopovers !== "Up to"}
                >
                  <i className="material-symbols-sharp add-stopover">add</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopoversDropdown;
