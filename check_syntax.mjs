import fs from 'fs';
import { parse } from '@babel/parser';

function checkFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  try {
    parse(content, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    console.log(filepath, 'OK');
  } catch (err) {
    console.error(filepath, 'Error:', err.message);
  }
}

checkFile('src/pages/Dashboards/AdminDashboard/Faculty-Management/AddFacultyForm.jsx');
checkFile('src/pages/Profile/ProfileHero.jsx');
