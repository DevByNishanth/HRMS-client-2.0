import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddShiftForm({ onClose }) {
  const [formData, setFormData] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    graceTime: "",
    workingHours: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);

    // API Call Here

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[#071a35] w-[500px] rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b border-blue-900 px-6 py-5">
          <div>
            <p className="text-blue-400 text-xs uppercase tracking-widest">
              Shift Management
            </p>

            <h2 className="text-white text-xl font-semibold">
              Create Shift
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          {/* Shift Name */}

          <div>
            <label className="text-white block mb-2">
              Shift Name
            </label>

            <input
              type="text"
              name="shiftName"
              value={formData.shiftName}
              onChange={handleChange}
              placeholder="Enter Shift Name"
              className="w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white"
            />
          </div>

          {/* Start End */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white block mb-2">
                Start Time
              </label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white"
              />
            </div>

            <div>
              <label className="text-white block mb-2">
                End Time
              </label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white"
              />
            </div>
          </div>

          {/* Grace Time & Working Hours */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white block mb-2">
                Grace Time
              </label>

              <input
                type="number"
                name="graceTime"
                value={formData.graceTime}
                onChange={handleChange}
                placeholder="Minutes"
                className="w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white"
              />
            </div>

            <div>
              <label className="text-white block mb-2">
                Working Hours
              </label>

              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                placeholder="Hours"
                className="w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white"
              />
            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-blue-900 p-5 flex justify-between  gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Create Shift
          </button>

        </div>

      </div>

    </div>
  );
}