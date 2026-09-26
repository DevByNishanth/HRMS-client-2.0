import ThemeToggle from "../../../components/ThemeToggle";

const PrincipalDashboardHeader = () => {
 

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-[#5d9bff]">
          Principal Dashboard
        </p>
        <p className="mt-1 text-[13px] text-slate-600 dark:text-[#9eb0cc]">
          Live faculty attendance, workforce mix, and approval workload.
        </p>
      </div>
    </div >
  );
};

export default PrincipalDashboardHeader;
