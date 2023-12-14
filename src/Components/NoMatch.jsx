import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NoMatch(props) {
  const navigate = useNavigate();
  function isSessionStorageItemExists(key) {
    const item = sessionStorage.getItem(key);
    return item !== null;
  }
  // Usage
  const itemExists = isSessionStorageItemExists("username");
  useEffect(() => {
    if (!itemExists) {
      // Item exists in sessionStorage
      navigate("/login");
      // Item does not exist in sessionStorage
    }
  });
  return (
    <div>
      <h1>Default landing page</h1>
      <h1>404 Not Found</h1>
    </div>
  );
}

export default NoMatch;
