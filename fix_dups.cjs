const fs = require('fs');
const files = [
  'src/pages/Dashboards/AdminDashboard/Faculty-Management/EditFacultyCanvas.jsx',
  'src/components/AddDepartmentModal.jsx',
  'src/components/AddDesignationModal.jsx',
  'src/pages/Dashboards/AdminDashboard/Faculty-Management/AddFacultyForm.jsx',
  'src/pages/Profile/ProfileHero.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (i < lines.length - 1 && lines[i].trim() === lines[i+1].trim() && lines[i].trim() !== '') {
      continue;
    }
    if (i < lines.length - 2 && lines[i].trim() === lines[i+2].trim() && lines[i+1].trim() === '' && lines[i].trim() !== '') {
      continue;
    }
    newLines.push(lines[i]);
  }
  
  let newContent = newLines.join('\n');
  
  const badStr = 'className={`flex items-center gap-3 border-b border-slate-200 dark:border-[#132944] px-4 py-3 transition last:border-b-0 ${className = {`flex items-center gap-3 border-b border-slate-200 dark:border-[#132944] px-4 py-3 transition last:border-b-0 ${isAwaitingDelete';
  const goodStr = 'className={`flex items-center gap-3 border-b border-slate-200 dark:border-[#132944] px-4 py-3 transition last:border-b-0 ${isAwaitingDelete';
  
  newContent = newContent.replace(badStr, goodStr);
  newContent = newContent.replace(badStr, goodStr);
  
  const badClassStr = 'className={`h-11 w-full rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-[13px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"\n      className={`h-11 w-full rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-[13px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"';
  const goodClassStr = 'className={`h-11 w-full rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-[13px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"';
  
  newContent = newContent.replace(badClassStr, goodClassStr);
  newContent = newContent.replace(badClassStr, goodClassStr);
  
  const badClassStr2 = 'className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-left text-[13px] text-slate-900 dark:text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"\n        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-left text-[13px] text-slate-900 dark:text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"';
  const goodClassStr2 = 'className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white dark:bg-[#0d2138] px-3 text-left text-[13px] text-slate-900 dark:text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-slate-300 dark:border-[#244061]"';
  
  newContent = newContent.replace(badClassStr2, goodClassStr2);
  newContent = newContent.replace(badClassStr2, goodClassStr2);

  fs.writeFileSync(file, newContent);
}
console.log('Fixed files');
