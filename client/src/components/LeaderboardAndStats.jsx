import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeaderboardAndStats = ({ leaderboard, stats }) => {
  // Emojis for leaderboard positions
  const getMedalEmoji = (position) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return `#${position}`;
  };

  // Preparing data for the bar chart
  const statsData = {
    labels: stats.map((item) => `Answer: ${item.answer}`),
    datasets: [
      {
        label: "Number of responses",
        data: stats.map((item) => item.count),
        backgroundColor: [
          "#4caf50", // Green
          "#2196f3", // Blue
          "#ff9800", // Orange
          "#f44336", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  const statsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Answer Distribution",
      },
    },
  };

  return (
    <div className="text-center mt-6">
      {/* Leaderboard */}
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Leaderboard</h3>
      <ul className="space-y-3">
        {leaderboard.map((player, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-md font-medium text-gray-800 bg-gray-100 py-2 px-4 rounded-lg shadow-md"
          >
            <span>
              {getMedalEmoji(index + 1)} {player.username}
            </span>
            <span>{player.score} points</span>
          </li>
        ))}
      </ul>

      {/* Stats - Bar Graph */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quiz Stats</h3>
        <Bar data={statsData} options={statsOptions} />
      </div>
    </div>
  );
};

export default LeaderboardAndStats;
