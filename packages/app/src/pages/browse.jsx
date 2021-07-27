import React, { useEffect, useState } from "react";
import config from '../config';

import { get } from "../tools/api";
import Listing from "../components/listing"

const Browse = () => {
  const [error, setError] = useState('');
  const [listings, setListings] = useState([]);

  useEffect(() => {
    get("browse", (error) => {
      setError(error)
    }, (response) => {
      console.log(response)
      setListings(response.listings)
    })
  }, []);

  return (
    <div>
      <h1>
        Browse Items
      </h1>
      <div className="listing-container">
        {listings && listings.map((listing, idx) => {
          return <Listing key={idx} title={listing.title} description={listing.description} price={listing.price} />
        })}
      </div>
      <div className="error-message">{error}</div>
    </div >
  )
}

export default Browse;