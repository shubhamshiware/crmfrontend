import React, { useEffect, useState } from "react";

const Fetch = () => {
  const [data, setData] = useState(null); // State to hold fetched data
  const [error, setError] = useState(null); // State to hold any errors
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    // Replace <port> and <endpoint> with your API details
    const API_URL = "http://localhost:8089/";

    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result); // Set the data into state
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchData();
  }, []);

  // Render UI based on state
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Pretty print JSON
      )}
    </div>
  );
};

export default Fetch;
