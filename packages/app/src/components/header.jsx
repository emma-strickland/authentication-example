import React from "react";

import { Link } from "react-router-dom";

const Header = ({ token, onLogOut }) => {
    return (
        <div className="header">
            <div className="header-left">
                <Link className="header-link" to="/">Home </Link>
            </div>
            <div className="header-center">Authentication Example</div>
            <div className="header-right">
                {!token ?
                    (
                        <>
                            <Link className="header-link" to="/register">Register </Link>
                            <Link className="header-link" to="/login"> Log in </Link>
                        </>
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