import React, { useEffect, useState } from "react";

const Fetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = "http://localhost:8089/";

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Fetch;

//three commands which comes in while pushing the code in repo
//git add .
//git commit -m "Updated login API and fixed mobile compatibility"
//git push origin main
//if it is not happening with upper command then
//git pull origin main --rebase
//then git push origin main
//C:\Users\shubham shiware\Downloads\aiinfinite\frontend\my-app\src\home\home.jsx(frontend)
////C:\Users\shubham shiware\Downloads\node\fullstackproject\backend\backauth\main.js(backend)
