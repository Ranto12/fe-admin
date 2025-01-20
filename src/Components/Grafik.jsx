import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GrafikDummy() {
  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Data",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders/getOrdersByMonth", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Data fetched:", response.data);
        setDataChart({
          labels: response?.data?.ordersByMonth.map(
            (item) => item?.month
          ),
          datasets: [
            {
              label: "Data",
              data: response?.data?.ordersByMonth.map(
                (item) => item?.totalOrders
              ), 
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching the data", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Grafik</h1>
      {dataChart ? <Line data={dataChart} /> : <p>Loading chart data...</p>}
    </div>
  );
}

export default GrafikDummy;
