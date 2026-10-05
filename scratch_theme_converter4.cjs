const fs = require('fs');

// Fix AttendanceDropdown.jsx remaining hover items
let dropdownFile = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/components/AttendanceDropdown.jsx';
let dropdownContent = fs.readFileSync(dropdownFile, 'utf8');
dropdownContent = dropdownContent.replace(/className=\"px-4 py-2 hover:bg-\[\#3984ff\] cursor-pointer text-white\"/g, 'className=\"px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#3984ff] cursor-pointer text-slate-900 dark:text-white\"');
fs.writeFileSync(dropdownFile, dropdownContent);
console.log('Fixed AttendanceDropdown.jsx');

// Fix AttendanceReportManagementOverride.jsx
let reportFile = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard/AttendanceReport/AttendanceReportManagementOverride.jsx';
let reportContent = fs.readFileSync(reportFile, 'utf8');

reportContent = reportContent.replace(/const tableHeadCellBase = \`\$\{tableCellBase\} sticky top-0 z-10 bg-\[\#f8fafc\] dark:bg-\[\#071425\] font-bold text-white\`;/, 'const tableHeadCellBase = \`\$\{tableCellBase\} sticky top-0 z-10 bg-[#f8fafc] dark:bg-[#071425] font-bold text-slate-900 dark:text-white\`;');

reportContent = reportContent.replace(/const defaultBackground = isAlternateRow \? \"bg-\[\#f8fafc\] dark:bg-\[\#0a1a2e\]\" : \"bg-white dark:bg-\[\#1a2847\]\";\s+\/\/ Override takes highest priority\s+if \(isOverridden\) \{\s+return \`\$\{baseClass\} bg-orange-400\`;\s+\}/, 
`const defaultBackground = isAlternateRow ? "bg-[#f8fafc] dark:bg-[#0a1a2e]" : "bg-white dark:bg-[#1a2847]";
  // Override takes highest priority
  if (isOverridden) {
    return \`\${baseClass} bg-orange-400 text-white\`;
  }`);

reportContent = reportContent.replace(/if \(regularization\) \{\s+return \`\$\{baseClass\} bg-yellow-400\`;\s+\}/,
`if (regularization) {
    return \`\${baseClass} bg-yellow-400 text-white\`;
  }`);
  
reportContent = reportContent.replace(/if \(normalizedStatus === \"A\"\) return \`\$\{baseClass\} bg-\[\#85444C\]\`;/, 'if (normalizedStatus === \"A\") return \`\$\{baseClass\} bg-[#85444C] text-white\`;');
reportContent = reportContent.replace(/if \(normalizedStatus === \"P\"\) return \`\$\{baseClass\} bg-\[\#0A5D4D\]\`;/, 'if (normalizedStatus === \"P\") return \`\$\{baseClass\} bg-[#0A5D4D] text-white\`;');
reportContent = reportContent.replace(/if \(normalizedStatus === \"OFF\"\) return \`\$\{baseClass\} bg-gray-100 dark:bg-\[\#0f1e36\]\`;/, 'if (normalizedStatus === \"OFF\") return \`\$\{baseClass\} bg-gray-100 dark:bg-[#0f1e36] text-slate-900 dark:text-white\`;');
reportContent = reportContent.replace(/if \(normalizedStatus === \"OD\"\) return \`\$\{baseClass\} bg-\[\#8b5cf6\]\`;/, 'if (normalizedStatus === \"OD\") return \`\$\{baseClass\} bg-[#8b5cf6] text-white\`;');
reportContent = reportContent.replace(/if \(normalizedStatus\.includes\(\":\"\)\) return \`\$\{baseClass\} bg-\[\#3b82f6\]\`;/, 'if (normalizedStatus.includes(\":\")) return \`\$\{baseClass\} bg-[#3b82f6] text-white\`;');
reportContent = reportContent.replace(/return \`\$\{baseClass\} \$\{isWeekend \? \"bg-gray-100 dark:bg-\[\#0f1e36\]\" : defaultBackground\}\`;/, 'return \`\$\{baseClass\} \$\{isWeekend ? \"bg-gray-100 dark:bg-[#0f1e36]\" : defaultBackground\} text-slate-900 dark:text-white\`;');

reportContent = reportContent.replace(/className=\"\$\{tableCellBase\}\s+sticky top-0 z-\[15\] h-10 w-10 min-w-10 bg-\[\#f8fafc\] dark:bg-\[\#071425\] font-bold text-white\"/g, 'className=\"\$\{tableCellBase\}  sticky top-0 z-[15] h-10 w-10 min-w-10 bg-[#f8fafc] dark:bg-[#071425] font-bold text-slate-900 dark:text-white\"');

reportContent = reportContent.replace(/className=\"\$\{tableCellBase\} h-\[120px\] bg-white dark:bg-\[\#1a2847\] text-sm font-bold\s+text-white\"/g, 'className=\"\$\{tableCellBase\} h-[120px] bg-white dark:bg-[#1a2847] text-sm font-bold text-slate-900 dark:text-white\"');

reportContent = reportContent.replace(/className=\"\$\{tableCellBase\} sticky \$\{summaryRightClasses\[index\]\} z-\[25\]\s+w-\[38px\] min-w-\[38px\] \$\{\s+employeeIndex \% 2 === 1\s+\? \"bg-\[\#f8fafc\] dark:bg-\[\#0a1a2e\]\"\s+: \"bg-white dark:bg-\[\#1a2847\]\"\s+\} font-bold text-white\"/g, 'className=\"\$\{tableCellBase\} sticky \$\{summaryRightClasses[index]\} z-[25]  w-[38px] min-w-[38px] \$\{ employeeIndex % 2 === 1 ? \\\'bg-[#f8fafc] dark:bg-[#0a1a2e]\\\' : \\\'bg-white dark:bg-[#1a2847]\\\' \} font-bold text-slate-900 dark:text-white\"');

fs.writeFileSync(reportFile, reportContent);
console.log('Fixed AttendanceReportManagementOverride.jsx');
