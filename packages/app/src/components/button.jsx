import React from "react";

const Button = ({ label, onClick }) => {
    return (
        <div>
            <button className="button" onClick={onClick}>
                {label}
            </button>
        </div>
    )
}

export default Button;