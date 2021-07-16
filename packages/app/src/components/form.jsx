import React from "react";

const Form = ({ label, value, setValue }) => {
    return (
        <div>
            <form>
                <label>
                    {`${label}: `}
                    <input
                        type="text" name={label}
                        onChange={event => setValue(event.target.value)}
                        value={value}
                    />
                </label>
            </form>
        </div>
    )
}

export default Form;