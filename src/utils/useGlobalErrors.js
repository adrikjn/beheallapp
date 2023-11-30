import { useState } from "react";

const useGlobalErrors = () => {
  const [globalErrors, setGlobalErrors] = useState([]);

  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return { globalErrors, addGlobalError, closeAlert };
};

export default useGlobalErrors;
