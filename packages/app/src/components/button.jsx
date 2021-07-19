import React from "react";
import Loader from "react-loader-spinner";

const Button = ({ label, onClick }) => {
  return (
    <div className="button">
      <button onClick={onClick}>
        {label}
      </button>
    </div>
  )
}

export default Button;