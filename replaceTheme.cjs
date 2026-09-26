const fs = require('fs');
const path = require('path');

const targetDirs = [
  'Attendance',
  'AttendanceOverride',
  'AttendanceReport',
  'Faculty-Management',
  'Holiday',
  'LeaveBalance',
  'LeaveType',
  'Payroll',
  'Requests',
  'Teams',
  'shift'
];

const basePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // thead bg and text
  content = content.replace(/bg-\[#172c46\]/g, 'bg-gray-100 dark:bg-[#172c46]');
  content = content.replace(/text-\[#9aacc7\]/g, 'text-slate-600 dark:text-[#9aacc7]');
  
  // tbody text
  content = content.replace(/text-\[#cad7eb\]/g, 'text-slate-700 dark:text-[#cad7eb]');

  // tr border
  content = content.replace(/border-\[#132944\]/g, 'border-slate-200 dark:border-[#132944]');

  // td text colors
  content = content.replace(/text-\[#8ca1bd\]/g, 'text-slate-600 dark:text-[#8ca1bd]');
  // Also some might use text-[#9eb0cc], which is similar to #9aacc7
  content = content.replace(/text-\[#9eb0cc\]/g, 'text-slate-600 dark:text-[#9eb0cc]');

  // For specific background colors in active rows
  content = content.replace(/bg-\[#132944\]/g, 'bg-gray-50 dark:bg-[#132944]');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

for (const dir of targetDirs) {
  const dirPath = path.join(basePath, dir);
  if (fs.existsSync(dirPath)) {
    traverse(dirPath);
  } else {
    console.log(`Directory not found: ${dirPath}`);
  }
}

console.log('Done');
