const fs = require('fs');

let content = fs.readFileSync('src/pages/LoginPage.jsx', 'utf8');

// 1. Update main wrapper
content = content.replace(
  /<main className="grid min-h-screen overflow-x-hidden bg-\[#0F172A\] lg:h-screen lg:grid-cols-2 lg:overflow-hidden">/,
  `<main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] p-4 sm:p-6 lg:p-8">\n      <div className="w-full max-w-[1300px] grid lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[85vh] min-h-[600px]">`
);

// 2. Update Left Section Wrapper
content = content.replace(
  /<section className="flex min-h-screen flex-col bg-\[#020817\] lg:min-h-0">/,
  `<section className="flex flex-col bg-white rounded-[2rem] shadow-xl lg:min-h-0 relative overflow-hidden">`
);
content = content.replace(
  /<div className="flex min-h-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:py-6">/,
  `<div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12">`
);

// 3. Update Text and Input classes for Light Theme
// Headings
content = content.replace(/text-white/g, 'text-gray-900');
// Subtitles
content = content.replace(/text-\[#8b9bb8\]/g, 'text-gray-500');
// Inputs container
content = content.replace(/bg-\[#0b1730\]/g, 'bg-white');
content = content.replace(/border-\[#1b2942\]/g, 'border-gray-200');
content = content.replace(/border-\[#f16868\]/g, 'border-red-500');
// Input fields
content = content.replace(/placeholder:text-\[#6b7a99\]/g, 'placeholder:text-gray-400');
// Errors & Success
content = content.replace(/bg-\[#f1686812\]/g, 'bg-red-50');
content = content.replace(/text-\[#f16868\]/g, 'text-red-500');
content = content.replace(/bg-\[#18d3bf1f\]/g, 'bg-emerald-50');
content = content.replace(/text-\[#18d3bf\]/g, 'text-emerald-600');

// Fix buttons hover states
content = content.replace(/hover:bg-white\/5/g, 'hover:bg-gray-100');

// 4. Update Footer
content = content.replace(
  /<footer className="mx-5 shrink-0 border-t border-\[#1b2942\] px-0 py-4 text-sm text-\[#94A3B8\] ">/,
  `<footer className="mx-8 shrink-0 border-t border-gray-100 px-0 py-4 text-sm text-gray-400">`
);

// 5. Update Right Section Wrapper
content = content.replace(
  /<section className="login-gradient flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:min-h-0 lg:py-6">/,
  `<section className="login-gradient flex flex-col items-center justify-center overflow-hidden rounded-[2rem] shadow-xl bg-[#0F172A] px-5 py-8 sm:px-8 lg:min-h-0 lg:py-6 relative">\n        {/* Revert Right Side Text Colors */}`
);

// Since we did a global replace for text-white, we need to revert it for the right side.
// The right side content is from <section className="login-gradient ..."> to </section>
const rightSideMatch = content.match(/<section className="login-gradient[\s\S]*?<\/section>/);
if (rightSideMatch) {
  let rightSide = rightSideMatch[0];
  rightSide = rightSide.replace(/text-gray-900/g, 'text-white');
  rightSide = rightSide.replace(/text-gray-500/g, 'text-[#94a3b8]');
  content = content.replace(rightSideMatch[0], rightSide);
}

// 6. Close the new grid wrapper at the end
content = content.replace(
  /<\/main>/,
  `  </div>\n    </main>`
);

fs.writeFileSync('src/pages/LoginPage.jsx', content);
console.log("Updated LoginPage.jsx");
