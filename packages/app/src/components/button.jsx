import React, { useEffect, useState } from "react";

const LOADER_TIMEOUT_MS = 2500;

const Button = ({ label, onClick, isLoading }) => {
  const [showButtonLoader, setShowButtonLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowButtonLoader(true);
    }

    if (!isLoading && showButtonLoader) {
      const timeout = setTimeout(() => {
        setShowButtonLoader(false);
      }, LOADER_TIMEOUT_MS);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isLoading, showButtonLoader]);

  return (
    <button type="submit" className="button" onClick={onClick}>
      {/* TODO: we shouldn't need both of these containers */}
      <div className="button-inner-container">
        {showButtonLoader && <div className="button-loader" />}
        {!showButtonLoader && (<div className="button-label">{label}</div>)}
      </div>
    </button>
  )
}

export default Button;