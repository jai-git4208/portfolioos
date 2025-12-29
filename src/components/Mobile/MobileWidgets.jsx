import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Activity } from "lucide-react";
import { fetchWithTimeout } from "../../utils/api";

const MobileWidgets = () => {
  const [weather, setWeather] = useState({
    temp: "--",
    desc: "LOADING...",
  });

  const [commits, setCommits] = useState("--");

  // -----------------------------
  // 🔥 1. FETCH REALTIME WEATHER
  // -----------------------------
  const fetchWeather = async () => {
    try {
      const apiKey = "25b5d77c66848b45c3994cbc52df78c4";
      const city = "Ahmedabad";

      const res = await fetchWithTimeout(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
        { timeout: 5000 }
      );

      if (!res.ok) throw new Error("Weather API Error");
      const data = await res.json();

      setWeather({
        temp: Math.round(data.main.temp) + "°C",
        desc: data.weather[0].main.toUpperCase(),
      });
    } catch (err) {
      console.warn("Weather fetch failed (likely network/blocked):", err.message);
      setWeather({ temp: "N/A", desc: "OFFLINE" });
    }
  };

  // ---------------------------------------
  // 🔥 2. FETCH REALTIME GITHUB COMMITS
  // ---------------------------------------
  const fetchCommits = async () => {
    try {
      const username = "jai-git4208";

      const res = await fetchWithTimeout(
        `https://api.github.com/users/${username}/events/public`,
        {
          timeout: 5000,
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (res.status === 403) {
        setCommits("LMTD");
        return;
      }

      if (!res.ok) throw new Error("GitHub API Error");

      const events = await res.json();

      if (!Array.isArray(events)) {
        throw new Error("Invalid response format");
      }

      // Count push events (each contains commits)
      let commitCount = 0;
      events.forEach((event) => {
        if (event.type === "PushEvent" && event.payload && Array.isArray(event.payload.commits)) {
          commitCount += event.payload.commits.length;
        }
      });

      setCommits(commitCount > 0 ? commitCount : "0");
    } catch (err) {
      console.warn("GitHub fetch failed (likely 504/CORS):", err.message);
      setCommits("ERR");
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
    <div className="px-6 py-4 border-b border-[var(--border-dim)]">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm font-mono font-bold text-[var(--accent)] mb-4 uppercase tracking-widest"
      >
        [STATS]
      </motion.h2>

      <div className="grid grid-cols-2 gap-3">
        {widgets.map((widget, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 border border-[var(--border-dim)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="mb-2 text-[var(--text-dim)]">{widget.icon}</div>
            <div className="text-2xl font-bold text-[var(--text-primary)] font-mono mb-1">
              {widget.value}
            </div>
            <div className="text-[var(--text-dim)] text-xs font-mono uppercase tracking-wider">{widget.subtitle}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileWidgets;
