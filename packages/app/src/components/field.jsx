import React from "react";

import { useField } from 'formik';

const Field = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <input className="field-input" {...field} {...props} />
      {
        meta.touched && meta.error
          ? (<div className="field-error" >{meta.error}</div>)
          : (<div className="field-error-space" />)
      }
    </div>
  )
}

export default Field;