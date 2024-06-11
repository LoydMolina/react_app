import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";

const TicketFilter = () => {

  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const handleLabelClick = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setFocused(false);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };
  const handleInputChange2 = (e) => {
    const value = e.target.value;
    setInputValue2(value);
    if (value !== "" && !focused) {
      setFocused(true);
    }
  };

  const level = [
    { value: 1, label: "Select Level" },
    { value: 2, label: "Emergency" },
    { value: 3, label: "High" },
    { value: 4, label: "Low" },
    { value: 5, label: "Medium" },
  ];
  const status = [
    { value: 1, label: "Select Level" },
    { value: 2, label: "Pending" },
    { value: 3, label: "Approved" },
    { value: 4, label: "Returned" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  return (
    <>
      <div className="row filter-row">
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div
            className={
              focused || inputValue !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValue}
              onFocus={handleLabelClick}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
            <label className="focus-label" onClick={handleLabelClick}>
              Ticket Id
            </label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div
            className={
              focused || inputValue2 !== ""
                ? "input-block form-focus focused"
                : "input-block form-focus"
            }
          >
            <input
              type="text"
              className="form-control floating"
              value={inputValue2}
              onFocus={handleLabelClick}
              onBlur={handleInputBlur}
              onChange={handleInputChange2}
            />
            <label className="focus-label" onClick={handleLabelClick}>
              Ticket Subject
            </label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <Select
              options={status}
              placeholder="--Select--"
              styles={customStyles}
            />
            <label className="focus-label">Status</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <div className="input-block form-focus select-focus">
            <Select
              options={level}
              placeholder="--Select--"
              styles={customStyles}
            />
            <label className="focus-label">Priority</label>
          </div>
        </div>
        <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
          <Link to="#" className="btn btn-success btn-block w-100">
            {" "}
            Search{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default TicketFilter;
