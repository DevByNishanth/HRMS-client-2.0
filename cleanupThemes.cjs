const fs = require('fs');
const path = require('path');

const targetFiles = [
  'FacultyManagementPage.jsx',
  'AddFacultyForm.jsx',
  'EditFacultyCanvas.jsx'
];

const basePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard/Faculty-Management';

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/dark:bg-white dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-slate-100 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-gray-100 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-gray-50 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:border-slate-300 dark:border-\[/g, 'dark:border-[');
  content = content.replace(/dark:border-slate-200 dark:border-\[/g, 'dark:border-[');
  content = content.replace(/dark:placeholder:text-slate-400 dark:placeholder:text-\[/g, 'dark:placeholder:text-[');
  content = content.replace(/dark:placeholder:text-slate-400 dark:text-\[/g, 'dark:text-[');
  content = content.replace(/dark:hover:bg-slate-100 dark:bg-\[/g, 'dark:hover:bg-[');
  content = content.replace(/dark:hover:bg-gray-100 dark:hover:bg-\[/g, 'dark:hover:bg-[');
  content = content.replace(/dark:hover:text-slate-900 dark:hover:text-white/g, 'dark:hover:text-white');
  content = content.replace(/dark:text-slate-900 dark:text-white/g, 'dark:text-white');
  content = content.replace(/dark:text-slate-900 dark:text-\[/g, 'dark:text-[');
  content = content.replace(/dark:hover:bg-slate-100 dark:hover:bg-\[/g, 'dark:hover:bg-[');

  // In FacultyManagementPage.jsx button
  content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-100 dark:bg-\[\#132b49\]/g, 'hover:bg-slate-50 dark:hover:bg-[#132b49]');
  content = content.replace(/hover:bg-slate-100 dark:bg-\[\#132b49\]/g, 'hover:bg-slate-100 dark:hover:bg-[#132b49]'); // if there's any typo

  // For Add department button, `hover:bg-slate-100 dark:bg-[#132b49]` -> `hover:bg-slate-100 dark:hover:bg-[#132b49]`
  content = content.replace(/hover:bg-slate-100 dark:bg-\[\#132b49\]/g, 'hover:bg-slate-100 dark:hover:bg-[#132b49]');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${filePath}`);
  }
}

for (const file of targetFiles) {
  processFile(path.join(basePath, file));
}
console.log('Done');
