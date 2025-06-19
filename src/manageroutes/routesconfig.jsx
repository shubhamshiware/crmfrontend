import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Orders from "../pages/orders";
import Clients from "../pages/Clients";
import Signup from "../auth/signup.jsx";
import LoginPage from "../auth/login.jsx";
import Addclients from "../pages/addclients.jsx";
import Editclient from "../pages/editclients.jsx";
import AdminDashboard from "../pages/admindashbord.jsx";
import Calendarone from "../pages/employcalender.jsx";
import ClientDetails from "../pages/clientdetails.jsx";
import Profilepage from "../pages/profilepage.jsx";
import Taskssss from "../pages/task.jsx";
import TaskPage from "../pages/taskpage.jsx";
import Attendance from "../attandence/attandence.jsx";
import VideoCall from "../pages/meet.jsx";
import ChatApp from "../pages/chat.jsx";
import EditUserDetails from "../pages/edituser.jsx";
import SalesGraph from "../pages/chart.jsx";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/addclients" element={<Addclients />} />
      <Route path="/editclient/:id" element={<Editclient />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/calanderempl" element={<Calendarone />} />
      <Route path="/clientdetails/:id" element={<ClientDetails />} />
      <Route path="/profilepage" element={<Profilepage />} />
      <Route path="/Taskssss" element={<Taskssss />} />
      <Route path="/Taskpage" element={<TaskPage />} />
      <Route path="/att" element={<Attendance />} />
      <Route path="/chat" element={<ChatApp />} />
      <Route path="/video-call/:room" element={<VideoCall />} />
      <Route path="/edituser" element={<EditUserDetails />} />
      <Route path="/Chart" element={<SalesGraph />} />
    </Routes>
  );
};

export default RoutesConfig;
