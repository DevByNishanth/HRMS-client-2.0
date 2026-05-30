import React from "react";

const ProfileCard = ({ title, icon: Icon, children, className = "" }) => {
  return (
    <section className={`rounded-xl border border-gray-800 bg-[#111a2d] p-5 ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-white">{title}</h2>
        {Icon && <Icon size={16} className="text-[#8496b5]" />}
      </div>
      {children}
    </section>
  );
};

export default ProfileCard;
