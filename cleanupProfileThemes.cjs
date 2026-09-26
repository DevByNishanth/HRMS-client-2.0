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
  'src/components/AddDepartmentModal.jsx',
  'src/components/AddDesignationModal.jsx'
];

const basePath = 'c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0';

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Clean duplicates caused by running regex twice on same files or matching dark: classes
  content = content.replace(/dark:bg-white dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-slate-100 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-gray-100 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-gray-50 dark:bg-\[/g, 'dark:bg-[');
  content = content.replace(/dark:bg-slate-50 dark:bg-\[/g, 'dark:bg-[');
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
  content = content.replace(/dark:hover:bg-slate-50 dark:hover:bg-\[/g, 'dark:hover:bg-[');
  content = content.replace(/dark:text-slate-500 dark:text-\[/g, 'dark:text-[');
  content = content.replace(/dark:text-slate-700 dark:text-\[/g, 'dark:text-[');
  content = content.replace(/dark:text-slate-400 dark:text-\[/g, 'dark:text-[');
  content = content.replace(/dark:text-blue-600 dark:text-\[/g, 'dark:text-[');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned ${filePath}`);
  }
}

for (const file of targetFiles) {
  processFile(path.join(basePath, file));
}
console.log('Done');
