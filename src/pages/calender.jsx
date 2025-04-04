import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { jwtDecode } from "jwt-decode";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  const fetchEvents = () => {
    fetch("https://crmback-tjvw.onrender.com/task/tasks")
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = (Array.isArray(data.data) ? data.data : []).map(
          (event) => ({
            id: event._id,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: event.allDay || false,
          })
        );
        setEvents(formattedEvents);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  // Fetch Events on Mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Adding New Events
  const handleSelectSlot = ({ start, end }) => {
    if (userRole !== "author" && userRole !== "admin") {
      alert("Only authors can add events.");
      return;
    }
    const title = window.prompt("Enter a new event title");
    if (title) {
      const newEvent = { title, start, end, allDay: false };

      fetch("https://crmback-tjvw.onrender.com/task/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })
        .then((response) => response.json())
        .then(() => {
          fetchEvents(); // Re-fetch events from backend
        })
        .catch((error) => console.error("Error saving event:", error));
    }
  };

  // Handle Deleting Events
  const handleDeleteEvent = (event) => {
    if (userRole !== "author" && userRole !== "admin") {
      alert("Only authors and admins can delete events.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );
    if (!confirmDelete) return;

    fetch("https://crmback-tjvw.onrender.com/task/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: event.id }),
    })
      .then((response) => {
        if (response.ok) {
          fetchEvents(); // Re-fetch events from backend
          alert("Event deleted successfully");
        } else {
          alert("Failed to delete the event");
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div style={{ height: "90vh", margin: "30px" }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        selectable={userRole === "author" || userRole === "admin"}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar;

//crud tasks
//fetch the data from task rout
//delay in status update
//implemented attandence task
