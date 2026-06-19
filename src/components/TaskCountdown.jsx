import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const TaskCountdown = ({
  dueDate,
  estimatedHours,
  completedHours,
  status,
  showProgress = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!dueDate) return;

    const calculateTimeLeft = () => {
      const due = new Date(dueDate).getTime();
      const now = new Date().getTime();
      const diff = due - now;

      // DONE
      if (status === "DONE") {
        setTimeLeft({
          status: "DONE",
          text: "Task Completed",
        });
        return;
      }

      // PENDING (time finished)
      if (diff <= 0) {
        const overdueDays = Math.floor(
          Math.abs(diff) / (1000 * 60 * 60 * 24)
        );

        setTimeLeft({
          status: "PENDING",
          text:
            overdueDays > 0
              ? `Pending • ${overdueDays} Day${overdueDays > 1 ? "s" : ""
              } Overdue`
              : "Pending Completion",
        });

        return;
      }

      // Countdown
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) /
        (1000 * 60)
      );

      if (days > 0) {
        setTimeLeft({
          status: "ACTIVE",
          text: `${days}d ${hours}h Left`,
        });
      } else if (hours > 0) {
        setTimeLeft({
          status: "ACTIVE",
          text: `${hours}h Left`,
        });
      } else {
        setTimeLeft({
          status: "ACTIVE",
          text: `${minutes}m Left`,
        });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      60000
    );

    return () => clearInterval(timer);
  }, [dueDate, status]);

  if (!timeLeft) return null;

  let progress = 0;

  if (estimatedHours > 0) {
    progress = Math.min(
      100,
      ((completedHours || 0) / estimatedHours) * 100
    );
  }

  let colorClass = "";
  let badgeClass = "";
  let icon = <Clock size={12} />;

  switch (timeLeft.status) {
    case "ACTIVE":
      colorClass = "text-warning";
      badgeClass =
        "bg-warning/10 text-warning border-warning/20";
      break;

    case "PENDING":
      colorClass = "text-danger";
      badgeClass =
        "bg-danger text-white border-danger";
      icon = <AlertTriangle size={12} />;
      break;

    case "DONE":
      colorClass = "text-success";
      badgeClass =
        "bg-success text-white border-success";
      icon = <CheckCircle size={12} />;
      break;

    default:
      break;
  }

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${colorClass}`}
        >
          {icon}
          <span>{timeLeft.text}</span>
        </div>

        <div
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest border ${badgeClass}`}
        >
          {timeLeft.status}
        </div>
      </div>

      {showProgress &&
        timeLeft.status !== "DONE" && (
          <div className="w-full bg-slate-100 dark:bg-brandSidebar rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 1,
              }}
              className="h-full rounded-full bg-danger"
            />
          </div>
        )}
    </div>
  );
};

export default TaskCountdown;