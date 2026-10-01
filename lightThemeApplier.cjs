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

  // Backgrounds
  content = content.replace(/bg-\[#051424\]/g, 'bg-white dark:bg-[#051424]');
  content = content.replace(/bg-\[#071425\]/g, 'bg-[#f8fafc] dark:bg-[#071425]');
  content = content.replace(/bg-\[#0d2138\]/g, 'bg-white dark:bg-[#0d2138]');
  content = content.replace(/bg-\[#0a1a2d\]/g, 'bg-white dark:bg-[#0a1a2d]');
  content = content.replace(/bg-\[#0c2038\]/g, 'bg-white dark:bg-[#0c2038]');
  content = content.replace(/bg-\[#132b49\]/g, 'bg-slate-100 dark:bg-[#132b49]');
  content = content.replace(/bg-\[#102640\]/g, 'bg-gray-100 dark:bg-[#102640]');
  content = content.replace(/bg-\[#132944\]/g, 'bg-gray-50 dark:bg-[#132944]');
  
  // Hovers
  content = content.replace(/hover:bg-\[#132b49\]/g, 'hover:bg-slate-100 dark:hover:bg-[#132b49]');
  content = content.replace(/hover:bg-\[#102640\]/g, 'hover:bg-gray-100 dark:hover:bg-[#102640]');

  // Borders
  content = content.replace(/border-\[#183052\]/g, 'border-slate-200 dark:border-[#183052]');
  content = content.replace(/border-\[#244061\]/g, 'border-slate-300 dark:border-[#244061]');

  // Text
  // Be careful with text-white since some buttons (like primary blue buttons) should remain text-white
  // So we only replace text-white when it's not inside a primary button, or we can just replace text-white and fix primary buttons if needed
  // Instead of a global replace for text-white, let's look for specific patterns or just do it and the user can check
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  // Fix primary buttons that really should be text-white in both modes
  content = content.replace(/bg-\[#2563EB\](.*?)text-slate-900 dark:text-white/g, 'bg-[#2563EB]$1text-white');
  content = content.replace(/bg-blue-600(.*?)text-slate-900 dark:text-white/g, 'bg-blue-600$1text-white');

  content = content.replace(/text-\[#9eb0cc\]/g, 'text-slate-500 dark:text-[#9eb0cc]');
  content = content.replace(/text-\[#cad7eb\]/g, 'text-slate-700 dark:text-[#cad7eb]');
  content = content.replace(/text-\[#6f839f\]/g, 'text-slate-400 dark:text-[#6f839f]');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

for (const file of targetFiles) {
  processFile(path.join(basePath, file));
}

console.log('Done');
