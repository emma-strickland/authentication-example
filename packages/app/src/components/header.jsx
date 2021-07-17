import React from "react";

import { Link } from "react-router-dom";

const Header = ({ token, onLogOut }) => {
    return (
        <div className="header">
            <Link className="header-link" to="/">Home </Link>
            <div className="header-right">
                {!token ?
                    (
                        <div>
                            <Link className="header-link" to="/register">Register </Link>
                            <Link className="header-link" to="/login"> Log in </Link>
                        </div>
                    )
                    :
                    (
                        <Link className="header-link" onClick={onLogOut} >Log out</Link>
                    )
                }
            </div>
        </div>
    )
}

export default Header;