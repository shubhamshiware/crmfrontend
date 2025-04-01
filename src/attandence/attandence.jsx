import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getDistance } from "geolib";

const localizer = momentLocalizer(moment);

const Attendance = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [attendanceEvents, setAttendanceEvents] = useState([]); // Stores attendance records
  const threshold = 500; // 500 meters accuracy threshold

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded?.id;
      setId(userId);
      console.log(userId, "kkkk");
    }
  }, []);

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

        // Check if the user is within the allowed range
        const referenceLocation = { latitude: 22.0591, longitude: 78.9299 };
        const distance = getDistance(
          { latitude, longitude },
          referenceLocation
        );

        if (distance > threshold) {
          alert("You are outside the allowed attendance range.");
          return;
        }

        try {
          const response = await axios.post(
            "https://crmback-tjvw.onrender.com/attendence/attendance",
            { latitude, longitude, id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          console.log(response, "Backend response");
          setStatus(response.data.message);

          // Add attendance to calendar events
          const today = new Date();
          setAttendanceEvents([
            ...attendanceEvents,
            {
              start: today,
              end: today,
              title: "Present",
            },
          ]);
        } catch (error) {
          setStatus(
            "Error: " +
              (error.response?.data?.message || "Something went wrong.")
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
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      >
        Mark Attendance
      </button>
      <p>{status}</p>

      {latitude && longitude && (
        <p>
          Current Location: {latitude}, {longitude}
        </p>
      )}

      <h3>Attendance Calendar</h3>
      <div style={{ height: 500, width: "80%", margin: "auto" }}>
        <BigCalendar
          localizer={localizer}
          events={attendanceEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
};

export default Attendance;
