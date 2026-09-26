const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/pages/Profile/DocumentsCard.jsx',
  'src/pages/Profile/EducationQualifications.jsx',
  'src/pages/Profile/PersonalDetails.jsx',
  'src/pages/Profile/ProfessionalInfo.jsx',
  'src/pages/Profile/ProfileBody.jsx',
  'src/pages/Profile/ProfileCard.jsx',
  'src/pages/Profile/ProfileEditDrawer.jsx',
  'src/pages/Profile/ProfileHero.jsx',
  'src/pages/Profile/ReportingManagerCard.jsx',
  'src/pages/ProfilePage.jsx',
];

const basePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0';

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-\[\#051424\]/g, 'bg-white dark:bg-[#051424]');
  content = content.replace(/bg-\[\#071425\]/g, 'bg-slate-50 dark:bg-[#071425]');
  content = content.replace(/bg-\[\#0d2138\]/g, 'bg-white dark:bg-[#0d2138]');
  content = content.replace(/bg-\[\#0a1a2d\]/g, 'bg-white dark:bg-[#0a1a2d]');
  content = content.replace(/bg-\[\#0c2038\]/g, 'bg-white dark:bg-[#0c2038]');
  content = content.replace(/bg-\[\#132b49\]/g, 'bg-slate-100 dark:bg-[#132b49]');
  content = content.replace(/bg-\[\#102640\]/g, 'bg-gray-100 dark:bg-[#102640]');
  content = content.replace(/bg-\[\#132944\]/g, 'bg-gray-50 dark:bg-[#132944]');
  content = content.replace(/bg-\[\#08182a\]/g, 'bg-white dark:bg-[#08182a]');
  content = content.replace(/bg-\[\#132A44\]/g, 'bg-gray-100 dark:bg-[#132A44]');
  content = content.replace(/bg-\[\#182F4B\]/g, 'bg-gray-100 dark:bg-[#182F4B]');
  
  // Hovers
  content = content.replace(/hover:bg-\[\#132b49\]/g, 'hover:bg-slate-100 dark:hover:bg-[#132b49]');
  content = content.replace(/hover:bg-\[\#102640\]/g, 'hover:bg-gray-100 dark:hover:bg-[#102640]');
  content = content.replace(/hover:bg-\[\#183052\]/g, 'hover:bg-slate-100 dark:hover:bg-[#183052]');
  content = content.replace(/hover:bg-\[\#162a42\]/g, 'hover:bg-slate-50 dark:hover:bg-[#162a42]');

  // Borders
  content = content.replace(/border-\[\#183052\]/g, 'border-slate-200 dark:border-[#183052]');
  content = content.replace(/border-\[\#173150\]/g, 'border-slate-200 dark:border-[#173150]');
  content = content.replace(/border-\[\#244061\]/g, 'border-slate-300 dark:border-[#244061]');
  content = content.replace(/border-\[\#1a3250\]/g, 'border-slate-200 dark:border-[#1a3250]');
  content = content.replace(/border-\[\#132944\]/g, 'border-slate-200 dark:border-[#132944]');
  content = content.replace(/border-\[\#102640\]/g, 'border-slate-200 dark:border-[#102640]');
  content = content.replace(/border-\[\#162C47\]/g, 'border-slate-200 dark:border-[#162C47]');

  // Text
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-\[\#e4e9ff\]/g, 'text-slate-900 dark:text-[#e4e9ff]');
  content = content.replace(/text-\[\#9eb0cc\]/g, 'text-slate-500 dark:text-[#9eb0cc]');
  content = content.replace(/text-\[\#cad7eb\]/g, 'text-slate-700 dark:text-[#cad7eb]');
  content = content.replace(/text-\[\#6f839f\]/g, 'text-slate-400 dark:text-[#6f839f]');
  content = content.replace(/text-\[\#a9c7ff\]/g, 'text-blue-600 dark:text-[#a9c7ff]');
  content = content.replace(/text-\[\#8ca1bd\]/g, 'text-slate-500 dark:text-[#8ca1bd]');
  content = content.replace(/text-\[\#93B3E5\]/g, 'text-slate-500 dark:text-[#93B3E5]');
  
  // Fix primary buttons
  content = content.replace(/bg-\[\#2563EB\](.*?)text-slate-900 dark:text-white/g, 'bg-[#2563EB]$1text-white');
  content = content.replace(/bg-blue-600(.*?)text-slate-900 dark:text-white/g, 'bg-blue-600$1text-white');
  content = content.replace(/bg-\[\#FF4B4B\](.*?)text-slate-900 dark:text-white/g, 'bg-[#FF4B4B]$1text-white');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

for (const file of targetFiles) {
  processFile(path.join(basePath, file));
}
console.log('Done');
