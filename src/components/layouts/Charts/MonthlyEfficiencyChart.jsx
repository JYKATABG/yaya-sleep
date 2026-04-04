import { useSleep } from "../../../contexts/SleepContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export const MonthlyEfficiencyChart = () => {
  const { logs } = useSleep();

  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().split("T")[0]);
  }

  const groupedData = logs.reduce((acc, log) => {
    const dateKey = log.date;
    acc[dateKey] = (acc[dateKey] || 0) + log.duration_min;
    return acc;
  }, {});

  const processedData = last30Days.map((dateStr) => {
    const hours = groupedData[dateStr]
      ? Number((groupedData[dateStr] / 60).toFixed(1))
      : 0;

    return {
      label: new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(new Date(dateStr + "T12:00:00")),
      value: hours > 24 ? 24 : hours,
    };
  });

  const chartData = {
    labels: processedData.map((d) => d.label),
    datasets: [
      {
        fill: true,
        label: "Sleep Hours",
        data: processedData.map((d) => d.value),
        borderColor: "#39c9bb",
        backgroundColor: "rgba(57, 201, 187, 0.2)",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 24,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 250 }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
