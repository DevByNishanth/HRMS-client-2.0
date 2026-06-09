import { ArrowRight } from "lucide-react";

const PrincipalDashboardCard = ({ title, subtitle, icon: Icon, action, onAction, children, className = "" }) => (
  <section
    className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d] shadow-[0_12px_36px_rgba(0,0,0,0.18)] ${className}`}
  >
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-start gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2563eb24] text-[#5d9bff]">
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold leading-5 text-white">{title}</h2>
          {subtitle && <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">{subtitle}</p>}
        </div>
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#3984ff] transition hover:text-white"
        >
          {action}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
    <div className="min-h-0 flex-1 px-4 pb-4">{children}</div>
  </section>
);

export default PrincipalDashboardCard;
