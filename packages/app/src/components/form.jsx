import React from "react";

const Form = ({ label, value, setValue, type, onSubmit }) => {
  return (
    <div>
      <div>{label}</div>
      <label>
        <input
          className="form"
          type={type} name={label}
          onChange={event => setValue(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              onSubmit();
            }
          }}
          value={value}
        />
      </label>
    </div>
  )
}

export default Form;