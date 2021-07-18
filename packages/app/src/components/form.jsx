import React from "react";

const Form = ({ label, value, setValue, type }) => {
    return (
        <div className="form">
            <div>{label}</div>
            <form>
                <label>
                    <input
                        type={type} name={label}
                        onChange={event => setValue(event.target.value)}
                        value={value}
                    />
                </label>
            </form>
        </div>
    )
}

export default Form;