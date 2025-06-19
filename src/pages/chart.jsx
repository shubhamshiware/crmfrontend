import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SalesGraph = () => {
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const [selectedMonth, setSelectedMonth] = useState(0); // index 0 = Jan
  const [salesValue, setSalesValue] = useState("");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = () => {
    axios
      .get("https://crmback-tjvw.onrender.com/Chart")
      .then((res) => {
        setMonthlySales(res.data.data.monthlySalesBreakdown);
      })
      .catch((err) => console.error("Error fetching sales data:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseInt(salesValue);

    if (isNaN(value)) return alert("Please enter a valid number");

    try {
      const response = await axios.put(
        "https://crmback-tjvw.onrender.com/Chart/update",
        {
          monthIndex: selectedMonth,
          value: value,
        }
      );
      console.log(response.data, "backend response of chart salse ");
      alert(response.data.message);
      setSalesValue("");
      fetchSalesData(); // refresh graph
    } catch (err) {
      alert("Error updating sales");
      console.error(err);
    }
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Sales",
        data: monthlySales,
        borderColor: "#42a5f5",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <h2>📊 Monthly Sales Graph</h2>
      <Line data={chartData} />

      <h3 style={{ marginTop: "30px" }}>➕ Update Monthly Sales</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", alignItems: "center" }}
      >
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((m, index) => (
            <option key={index} value={index}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter sales value"
          value={salesValue}
          onChange={(e) => setSalesValue(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SalesGraph;
