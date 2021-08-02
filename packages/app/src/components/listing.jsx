import React from "react";
import Chair from "../assets/chair.jpg"

// TODO: style this
const Listing = ({ title, description, price }) => {
  return (
    <div className="listing">
      <img className="chair-image" src={Chair} alt="chair" />
      <div className="listing-header">{title}</div>
      <div className="listing-description">{description}</div>
      <div className="listing-price">${price}</div>
    </div>
  )
}

export default Listing;