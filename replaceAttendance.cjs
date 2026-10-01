const fs = require('fs');
const path = require('path');

const basePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard/AttendanceReport';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // table cell bases
  content = content.replace(/border-r-\[rgba\(255,255,255,0\.12\)\]/g, 'border-slate-200 dark:border-[rgba(255,255,255,0.12)]');
  content = content.replace(/border-b-\[rgba\(255,255,255,0\.12\)\]/g, 'border-slate-200 dark:border-[rgba(255,255,255,0.12)]');
  
  // table head cell base
  content = content.replace(/bg-\[#071425\] font-bold text-white/g, 'bg-gray-100 dark:bg-[#071425] font-bold text-slate-700 dark:text-white');
  content = content.replace(/bg-\[#071425\] text-sm text-\[#1f2937\]/g, 'bg-white dark:bg-[#071425] text-sm text-slate-900 dark:text-[#1f2937]');
  content = content.replace(/bg-\[#071425\]/g, 'bg-white dark:bg-[#071425]');
  
  // cell bg
  content = content.replace(/bg-\[#09192c\]/g, 'bg-gray-50 dark:bg-[#09192c]');

  // toolbars and inputs
  content = content.replace(/border-\[#2c4a75\] bg-\[#0c2038\] px-4 text-sm font-medium text-white/g, 'border-slate-300 dark:border-[#2c4a75] bg-white dark:bg-[#0c2038] px-4 text-sm font-medium text-slate-900 dark:text-white');
  content = content.replace(/placeholder:text-\[#8fa3bf\]/g, 'placeholder:text-slate-400 dark:placeholder:text-[#8fa3bf]');
  
  // text colors
  content = content.replace(/text-\[#8ca1bd\]/g, 'text-slate-600 dark:text-[#8ca1bd]');
  content = content.replace(/text-\[#cad7eb\]/g, 'text-slate-700 dark:text-[#cad7eb]');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const files = fs.readdirSync(basePath);
for (const file of files) {
  if (file.endsWith('.jsx')) {
    processFile(path.join(basePath, file));
  }
}

console.log('Done');
