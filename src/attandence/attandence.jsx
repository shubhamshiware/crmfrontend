import React, { useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");

  const markAttendance = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await axios.post(
            "https://crmback-tjvw.onrender.com/attendence/attendance",
            { latitude, longitude },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          setStatus(response.data.message);
        } catch (error) {
          setStatus(
            "Error: " + error.response?.data?.message || "Something went wrong."
          );
        }
      },
      (error) => {
        alert("Error getting location: " + error.message);
      }
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Mark Attendance</h2>
      <button
        onClick={markAttendance}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Mark Attendance
      </button>
      <p>{status}</p>
      {latitude && longitude && (
        <p>
          Current Location: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
};

export default Attendance;

// 22.05911163145492, 78.92991505636398

//lattitude - 22.05911163145492, longitude - 78.92991505636398
