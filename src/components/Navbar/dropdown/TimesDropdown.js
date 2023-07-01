import React, { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";

const TimesDropdown = ({
  times,
  setTimes,
  tempTimes,
  setTempTimes,
  tripType,
}) => {
  const [timesDropdown, setTimesDropdown] = useState(false);
  const timesRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        timesDropdown &&
        timesRef.current &&
        !timesRef.current.contains(e.target)
      ) {
        setTimesDropdown(false);
        setTempTimes(times);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [timesDropdown, times]);

  return (
    <div className="navbar-item" ref={timesRef}>
      <span onClick={() => setTimesDropdown(!timesDropdown)}>
        Times
        <i className="material-symbols-outlined custom-expand">expand_more</i>
      </span>
      {timesDropdown && (
        <div className="dropdown times-dropdown">
          <div className="dropdown-actions">
            <button
              className="dropdown-action cancel"
              onClick={() => {
                setTimesDropdown(false);
                setTempTimes(times);
              }}
            >
              Cancel
            </button>
            <button
              className="dropdown-action done"
              onClick={() => {
                setTimesDropdown(false);
                setTimes(tempTimes);
              }}
            >
              Done
            </button>
          </div>
          <div className="slider-container">
            <label>Departure</label>
            <Slider
              className="thin-slider"
              value={[tempTimes.departure.min, tempTimes.departure.max]}
              min={0}
              max={24}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}:00`}
              sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
              onChange={(event, newValue) => {
                setTempTimes({
                  ...tempTimes,
                  departure: {
                    min: newValue[0],
                    max: newValue[1],
                  },
                });
              }}
            />
          </div>
          <div className="slider-container">
            <label>Arrival</label>
            <Slider
              className="thin-slider"
              value={[tempTimes.arrival.min, tempTimes.arrival.max]}
              min={0}
              max={24}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}:00`}
              sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
              onChange={(event, newValue) => {
                setTempTimes({
                  ...tempTimes,
                  arrival: {
                    min: newValue[0],
                    max: newValue[1],
                  },
                });
              }}
            />
          </div>
          {tripType === "Return" && (
            <>
              <div className="slider-container">
                <label>Return Departure</label>
                <Slider
                  className="thin-slider"
                  value={[
                    tempTimes.returnDeparture.min,
                    tempTimes.returnDeparture.max,
                  ]}
                  min={0}
                  max={24}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}:00`}
                  sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                  onChange={(event, newValue) => {
                    setTempTimes({
                      ...tempTimes,
                      returnDeparture: {
                        min: newValue[0],
                        max: newValue[1],
                      },
                    });
                  }}
                />
              </div>
              <div className="slider-container">
                <label>Return Arrival</label>
                <Slider
                  className="thin-slider"
                  value={[
                    tempTimes.returnArrival.min,
                    tempTimes.returnArrival.max,
                  ]}
                  min={0}
                  max={24}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}:00`}
                  sx={{ "& .MuiSlider-thumb": { width: 12, height: 12 } }}
                  onChange={(event, newValue) => {
                    setTempTimes({
                      ...tempTimes,
                      returnArrival: {
                        min: newValue[0],
                        max: newValue[1],
                      },
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TimesDropdown;
