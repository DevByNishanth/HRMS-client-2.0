import React from "react";
import { Pencil } from "lucide-react";

const ProfileCard = ({ title, icon: Icon, children, className = "", canEdit, onEdit }) => {
  return (
    <section className={`rounded-xl border border-gray-800 bg-[#111a2d] p-5 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-blue-600 transition hover:text-blue-500 cursor-pointer"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
          {Icon && <Icon size={16} className="text-[#8496b5]" />}
        </div>
      </div>
      {children}
    </section>
  );
};

export default ProfileCard;
