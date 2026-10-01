const fs = require('fs');
const path = require('path');

function fixAddFacultyForm() {
  const filePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard/Faculty-Management/AddFacultyForm.jsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix header and footer bg
  content = content.replace(/bg-\[\#08182a\]/g, 'bg-white dark:bg-[#08182a]');
  content = content.replace(/border-\[\#173150\]/g, 'border-slate-200 dark:border-[#173150]');
  
  // Fix header texts
  content = content.replace(/text-\[\#e4e9ff\]/g, 'text-slate-900 dark:text-[#e4e9ff]');
  content = content.replace(/text-\[\#a9c7ff\]/g, 'text-blue-600 dark:text-[#a9c7ff]');

  // Fix progress bar steps
  content = content.replace(/bg-\[\#354158\] hover:bg-\[\#596782\]/g, 'bg-slate-200 dark:bg-[#354158] hover:bg-slate-300 dark:hover:bg-[#596782]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed AddFacultyForm.jsx');
}

function fixDatePicker() {
  const filePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/components/FacultyDatePicker.jsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-\[\#0d2138\]/g, 'bg-white dark:bg-[#0d2138]');
  content = content.replace(/bg-\[\#0a1a2d\]/g, 'bg-white dark:bg-[#0a1a2d]');
  content = content.replace(/bg-\[\#071425\]/g, 'bg-white dark:bg-[#071425]');
  
  // Hovers
  content = content.replace(/hover:bg-\[\#183052\]/g, 'hover:bg-slate-100 dark:hover:bg-[#183052]');
  content = content.replace(/hover:bg-\[\#132b49\]/g, 'hover:bg-slate-100 dark:hover:bg-[#132b49]');

  // Borders
  content = content.replace(/border-\[\#244061\]/g, 'border-slate-300 dark:border-[#244061]');
  content = content.replace(/border-\[\#183052\]/g, 'border-slate-200 dark:border-[#183052]');
  content = content.replace(/border-\[\#132944\]/g, 'border-slate-200 dark:border-[#132944]');

  // Text
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  // Fix primary button text that shouldn't have changed
  content = content.replace(/bg-\[\#2563EB\](.*?)text-slate-900 dark:text-white/g, 'bg-[#2563EB]$1text-white');
  content = content.replace(/bg-blue-600(.*?)text-slate-900 dark:text-white/g, 'bg-blue-600$1text-white');

  content = content.replace(/text-\[\#9eb0cc\]/g, 'text-slate-500 dark:text-[#9eb0cc]');
  content = content.replace(/text-\[\#cad7eb\]/g, 'text-slate-700 dark:text-[#cad7eb]');
  content = content.replace(/text-\[\#6f839f\]/g, 'text-slate-400 dark:text-[#6f839f]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed FacultyDatePicker.jsx');
}

fixAddFacultyForm();
fixDatePicker();
