import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Activity } from "lucide-react";

const MobileWidgets = () => {
  const [weather, setWeather] = useState({
    temp: "--",
    desc: "Loading...",
  });

  const [commits, setCommits] = useState("--");

  // -----------------------------
  // 🔥 1. FETCH REALTIME WEATHER
  // -----------------------------
  const fetchWeather = async () => {
    try {
      const apiKey = "25b5d77c66848b45c3994cbc52df78c4"; // << REPLACE THIS
      const city = "Ahmedabad";

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const data = await res.json();

      setWeather({
        temp: Math.round(data.main.temp) + "°C",
        desc: data.weather[0].main,
      });
    } catch (err) {
      console.log("Weather fetch error:", err);
      setWeather({ temp: "--", desc: "Error" });
    }
  };

  // ---------------------------------------
  // 🔥 2. FETCH REALTIME GITHUB COMMITS
  // ---------------------------------------
  const fetchCommits = async () => {
    try {
      const username = "jai-git4209";

      const res = await fetch(
        `https://api.github.com/users/${username}/events/public`
      );

      const events = await res.json();

      // Count push events (each contains commits)
      let commitCount = 0;
      events.forEach((event) => {
        if (event.type === "PushEvent") {
          commitCount += event.payload.commits.length;
        }
      });

      setCommits(commitCount);
    } catch (err) {
      console.log("GitHub fetch error:", err);
      setCommits("--");
    }
  };

  // -------------------------
  // 🔄 Auto Fetch on Mount
  // -------------------------
  useEffect(() => {
    fetchWeather();
    fetchCommits();

    // Optional: refresh every 10 mins
    const interval = setInterval(() => {
      fetchWeather();
      fetchCommits();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  const widgets = [
    {
      title: "Weather",
      icon: <Cloud className="w-6 h-6" />,
      value: weather.temp,
      subtitle: weather.desc,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Activity",
      icon: <Activity className="w-6 h-6" />,
      value: commits,
      subtitle: "GitHub commits (today)",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="px-6 py-4">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-white mb-4"
      >
        Widgets
      </motion.h2>

      <div className="grid grid-cols-2 gap-4">
        {widgets.map((widget, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-5 rounded-3xl bg-gradient-to-br ${widget.color} glass-strong`}
          >
            <div className="mb-3">{widget.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {widget.value}
            </div>
            <div className="text-white/80 text-sm">{widget.subtitle}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileWidgets;
