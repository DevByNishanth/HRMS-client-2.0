import React from "react";
import { Edit3, UserRound } from "lucide-react";
import userImg from '../../assets/userImg.svg';

const ProfileHero = () => {
  return (
    <section className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-[#071425] px-4 py-4 rounded-lg ">
      <div className="flex items-center gap-4">
        <div className="flex h-[120] w-[120] shrink-0 items-center justify-center overflow-hidden rounded-lg border-3 border-[#31415d] bg-[#18243a] shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_25%,#52627f_0%,#1f2b3e_32%,#101827_72%)]">
            <img src={userImg} alt="User" />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold leading-tight text-white">
              Dr. Samuel Miller
            </h1>
            <span className="rounded-full bg-[#0f7e59]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#26d39a]">
              Active
            </span>
          </div>
          <p className="mt-1 text-[15px] font-medium text-[#c9d7f2]">
            Asst. Professor • Department of Computer Science
          </p>
          <p className="mt-2 text-[12px] text-[#8092b1]">EMP_CS_2024_004</p>
        </div>
      </div>

      <button className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]">
        <Edit3 size={13} />
        Edit Profile
      </button>
    </section>
  );
};

export default ProfileHero;
