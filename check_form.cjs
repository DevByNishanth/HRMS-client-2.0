const fs = require('fs');
const content = fs.readFileSync('src/pages/Dashboards/AdminDashboard/Faculty-Management/AddFacultyForm.jsx', 'utf8');
const start = content.indexOf('{activeStep === 2 && (');
const end = content.indexOf(')}', content.indexOf('activeStep === 3 && ('));
let block = content.slice(start, end);
block = block.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
const stack = [];
const tagRegex = /<\/?([a-zA-Z]+)[^>]*>/g;
let match;
while ((match = tagRegex.exec(block)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[0].endsWith('/> ') || match[0].endsWith('/>\n') || match[0].endsWith('/>"');
  const tagName = match[1];
  if (tagName === 'input' || tagName === 'path' || tagName === 'br' || tagName === 'img' || tagName === 'Field') continue;
  if (!isSelfClosing) {
    if (!isClosing) {
      stack.push(tagName);
    } else {
      if (stack[stack.length - 1] === tagName) {
        stack.pop();
      } else {
        console.log('Mismatch! Expected', stack[stack.length - 1], 'got', tagName);
      }
    }
  }
}
console.log('Remaining in stack AddFacultyForm:', stack);
