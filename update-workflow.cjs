const fs = require('fs');
const files = [
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/PRINCIPAL-Dashboard/PrincipalRegularizationListPage.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/PRINCIPAL-Dashboard/PrincipalPermissionTable.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/PRINCIPAL-Dashboard/PrincipalLeaveRequestPage.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/DEAN-Dashboard/PermissionDetailsPopup.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/DEAN-Dashboard/OdApprovalsPage.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/FacultyDashboard/RegularizationDetailsPopup.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/FacultyDashboard/PermissionDetailsPopup.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/FacultyDashboard/LeaveDetailsPopup.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/FacultyDashboard/HodLeaveRequestTable.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/DEAN-Dashboard/LeaveDetailsPopup.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Dashboards/DEAN-Dashboard/HodLeaveRequestTable.jsx',
  'd:/QPT/HRMS-client-2.0/src/pages/Common/RegularaizationListPage.jsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace line
  newContent = newContent.replace(
    /top-\[50px\]\s+w-\[2px\]\s+h-\[60px\]/g,
    'top-10 bottom-0 w-[2px]'
  );
  
  newContent = newContent.replace(
    /bg-\[#444c63\]/g,
    'bg-slate-200 dark:bg-[#444c63]'
  );

  // Replace pb-4 with pb-6 for step content
  newContent = newContent.replace(
    /className=\`?\"?relative flex gap-3 pb-4/g,
    'className="relative flex gap-3 pb-6'
  );

  // Replace circle styling
  const circleRegex = /className=\{\`flex h-10 w-10 items-center justify-center rounded-full border-2[^\}]+\}\`/g;
  newContent = newContent.replace(circleRegex, 'className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400" : isRejected ? "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-600 dark:text-red-400" : "bg-amber-50 dark:bg-[#f59e0b15] border-amber-500 dark:border-[#f59e0b50] text-amber-600 dark:text-amber-500"}`}');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
}
