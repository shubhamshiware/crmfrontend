import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getDistance } from "geolib";
import { useLocation, useParams } from "react-router-dom";

const localizer = momentLocalizer(moment);

const Attendance = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [attendanceEvents, setAttendanceEvents] = useState([]); // Stores attendance records
  const threshold = 500; // 500 meters accuracy threshold

  const location = useLocation();
  const { userId: routeUserId } = useParams(); // Get userId from URL if available
  const stateUserId = location.state?.userId; // Get userId from state if available

  useEffect(() => {
    let finalUserId = routeUserId || stateUserId; // First check if userId exists from route/state

    if (!finalUserId) {
      // If not from route, get from JWT token
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        finalUserId = decoded?.id;
      }
    }

    if (finalUserId) {
      setId(finalUserId);
      console.log("User ID:", finalUserId);
      fetchAttendance(finalUserId);
    }
  }, [routeUserId, stateUserId]);

  // Fetch past attendance by user ID
  const fetchAttendance = async (userId) => {
    try {
      const response = await axios.get(
        `https://crmback-tjvw.onrender.com/attendence/${userId}`, // Assuming backend supports this route
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      //   console.log(response, "get api response ");

      // Map data to match calendar format
      const formattedAttendance = response.data.map((record) => ({
        start: new Date(record.date),
        end: new Date(record.date),
        title: record.status,
      }));

      setAttendanceEvents(formattedAttendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

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
        console.log(id, "checkid "); // This should now be correctly set

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
            {
              latitude,
              longitude,
              userId: id, // Ensure userId is sent properly
              date: new Date().toISOString(),
              status: "Present",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          console.log("Backend response:", response);
          setStatus(response.data.message);

          // Add attendance to calendar events
          const today = new Date();
          setAttendanceEvents((prevEvents) => [
            ...prevEvents,
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
      <h2> Attendance</h2>
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

//there is work remaining for task page we need to make arrangemnts for the id of user will
// will come with location
