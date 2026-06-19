import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * TaskCountdown
 * Uses createdAt + estimatedHours to count down time remaining.
 * Falls back gracefully when data is missing.
 */
const TaskCountdown = ({
  createdAt,
  dueDate,       // legacy prop, ignored if createdAt is present
  estimatedHours = 0,
  completedHours = 0,
  status,
  showProgress = true,
}) => {
  const [taskState, setTaskState] = useState(null);

  useEffect(() => {
    // DONE — no countdown needed
    if (status === "DONE") {
      setTaskState({ status: "DONE", text: "Task Completed" });
      return;
    }

    // Need createdAt + estimatedHours to calculate countdown
    const startStr = createdAt || dueDate;
    if (!startStr || !estimatedHours || estimatedHours <= 0) {
      // No timer data — show nothing
      setTaskState(null);
      return;
    }

    const updateCountdown = () => {
      const start = new Date(startStr).getTime();
      const now = new Date().getTime();

      // If date parsing failed, bail out
      if (isNaN(start)) {
        setTaskState(null);
        return;
      }

      const elapsedHours = (now - start) / (1000 * 60 * 60);
      const remaining = estimatedHours - elapsedHours;

      if (remaining <= 0) {
        setTaskState({ status: "PENDING", text: "Pending Completion" });
      } else {
        const days = Math.floor(remaining / 24);
        const hours = Math.floor(remaining % 24);
        const minutes = Math.floor((remaining % 1) * 60);

        let text;
        if (days > 0) {
          text = `${days}d ${hours}h Left`;
        } else if (hours > 0) {
          text = `${hours}h ${minutes}m Left`;
        } else {
          text = `${minutes}m Left`;
        }

        setTaskState({ status: "ACTIVE", text });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [createdAt, dueDate, estimatedHours, status]);

  if (!taskState) return null;

  const progress =
    estimatedHours > 0
      ? Math.min(100, ((completedHours || 0) / estimatedHours) * 100)
      : 0;

  // --- DONE ---
  if (taskState.status === "DONE") {
    return (
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
          <CheckCircle size={13} />
          Task Completed
        </div>
        <span className="px-2 py-0.5 rounded bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
          DONE
        </span>
      </div>
    );
  }

  // --- PENDING (time expired) ---
  if (taskState.status === "PENDING") {
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
            <AlertTriangle size={13} />
            Pending Completion
          </div>
          <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
            PENDING
          </span>
        </div>
        {showProgress && (
          <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
            <div className="bg-red-500 h-1.5 rounded w-full" />
          </div>
        )}
      </div>
    );
  }

  // --- ACTIVE ---
  // Color changes based on how much time has elapsed
  const barColor = progress >= 80
    ? "bg-red-500"
    : progress >= 50
      ? "bg-orange-400"
      : "bg-green-400";

  const textColor = progress >= 80
    ? "text-red-400"
    : progress >= 50
      ? "text-orange-400"
      : "text-green-400";

  const badgeBg = progress >= 80
    ? "bg-red-500/20 text-red-400 border-red-500/30"
    : progress >= 50
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 font-bold text-xs ${textColor}`}>
          <Clock size={13} />
          {taskState.text}
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${badgeBg}`}>
          ACTIVE
        </span>
      </div>
      {showProgress && (
        <div className="w-full bg-slate-800 h-1.5 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className={`h-1.5 rounded ${barColor}`}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCountdown;