import React from "react";
import { motion } from "motion/react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};
const LeaveSummaryCard = ({ icon: Icon, title, code, used, total, color }) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
<<<<<<< HEAD
      className="rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#0A1929] p-4 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition-colors duration-200"
=======
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:border-gray-800 dark:bg-[#0A1929] dark:shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
>>>>>>> 4ba9e5f6e1ed55af1f67f550c7e9b3025d777984
    >
      <div
        className="mb-5 flex h-8 w-8  items-center justify-center rounded-md"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon size={15} />
      </div>

<<<<<<< HEAD
      <h3 className="text-[12px] -mt-2.5 font-semibold uppercase tracking-wide text-slate-600 dark:text-white">
=======
      <h3 className="-mt-2.5 text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-white">
>>>>>>> 4ba9e5f6e1ed55af1f67f550c7e9b3025d777984
        {title} ({code})
      </h3>

      <div className="mt-1 flex items-center justify-between text-[12px] font-semibold">
        <span className="text-slate-900 dark:text-white">
          {used} / {total} Days
        </span>
      </div>

<<<<<<< HEAD
      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-slate-100 dark:bg-[#1c2d45]">
=======
      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-slate-200 dark:bg-[#1c2d45]">
>>>>>>> 4ba9e5f6e1ed55af1f67f550c7e9b3025d777984
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

export default LeaveSummaryCard;
