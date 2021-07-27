import React from "react";

import { Link } from "react-router-dom";

const Header = ({ isLoggedIn, onLogOut }) => {
  return (
    <div className="header">
      <div className="header-left">
        <Link className="header-link" to="/">Home </Link>
      </div>
      <div className="header-center">Authentication Example</div>
      <div className="header-right">
        {isLoggedIn === true ?
          (
            <>
              <Link className="header-link" to="/browse">Browse</Link>
              <Link className="header-link" to="/post">Sell</Link>
              <Link className="header-link" onClick={onLogOut} to="/">Log out</Link>
            </>
          )
          :
          (
            <>
              <Link className="header-link" to="/browse">Browse</Link>
              <Link className="header-link" to="/register">Register </Link>
              <Link className="header-link" to="/login">Log in</Link>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Header;