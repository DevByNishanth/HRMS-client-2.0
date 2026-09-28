const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let original = fs.readFileSync(filepath, 'utf8');
    let content = original;
    
    // Process className string literals
    content = content.replace(/className=["'`]([\s\S]*?)["'`]/g, (match, classStr) => {
        // Skip specific buttons and bright backgrounds where text MUST be white
        if (/bg-(blue|red|green|purple|indigo|orange|yellow|pink)/.test(classStr) || 
            /bg-\[\#(?!051424|071425|0a1a2d|0d2138|172c46|132b49|0D213B|020817|0f2749|071a2f|071a35|091726|102640|183052|0c2038|0a1a2e|1a2847|0f1e36|173150|142c46|284472|132944|193252|0c1f36|1A1F30|24364D|1f3a5c|223d5f|13263d|102038|0a2742|f8fafc|ffffff)[0-9a-fA-F]{6}\]/.test(classStr) ||
            /bg-\[\#2563EB\]/i.test(classStr) || /bg-\[\#FF4B4B\]/i.test(classStr) || /bg-\[\#4F46E5\]/i.test(classStr) || /bg-\[\#3984ff\]/i.test(classStr) || /bg-\[\#1049c4\]/i.test(classStr) || /bg-\[\#bd3434\]/i.test(classStr)) {
            return match;
        }
        
        // Skip if already handled
        if (classStr.includes('dark:text-white') || classStr.includes('text-slate-900') || classStr.includes('text-slate-700')) {
            return match;
        }
        
        const replaced = classStr.replace(/text-white/g, 'text-slate-900 dark:text-white');
        
        // Also fix any stray borders that were missed
        let finalStr = replaced;
        if(finalStr.includes('border-blue-900') && !finalStr.includes('dark:border-blue-900')) {
            finalStr = finalStr.replace(/border-blue-900/g, 'border-slate-300 dark:border-blue-900');
        }
        
        // Re-wrap with the same quote/backtick
        const quote = match[10]; // character after className=
        const wrapper = match.charAt(10);
        return match.replace(classStr, finalStr);
    });
    
    // Quick replacements for component backgrounds that missed my earlier sweeps
    const replacements = [
        [/(?<!dark:)bg-\[\#0A1A2D\]/gi, 'bg-white dark:bg-[#0A1A2D]'],
        [/(?<!dark:)bg-\[\#132A47\]/gi, 'bg-slate-50 dark:bg-[#132A47]'],
        [/(?<!dark:)bg-\[\#102640\]/gi, 'bg-slate-100 dark:bg-[#102640]'],
        [/(?<!dark:)border-\[\#183052\]/gi, 'border-slate-200 dark:border-[#183052]'],
        [/(?<!dark:)bg-\[\#183052\]/gi, 'bg-slate-100 dark:bg-[#183052]'],
        [/(?<!dark:)bg-\[\#0d2138\]/gi, 'bg-white dark:bg-[#0d2138]'],
        [/(?<!dark:)bg-\[\#0a1a2d\]/gi, 'bg-white dark:bg-[#0a1a2d]'],
        [/(?<!dark:)text-\[\#9eb0cc\]/gi, 'text-slate-500 dark:text-[#9eb0cc]'],
        [/(?<!dark:)border-\[\#244061\]/gi, 'border-slate-300 dark:border-[#244061]'],
        [/(?<!dark:)bg-\[\#020817\](?!\/)/gi, 'bg-black/40 dark:bg-[#020817]'],
        [/(?<!dark:)bg-\[\#020817\]\/70/gi, 'bg-black/50 dark:bg-[#020817]/70'],
    ];

    for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
    }
    
    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            if (file.includes('FacultyManagementPage')) continue;
            processFile(filepath);
        }
    }
}

walk('c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/components');
walk('c:/ddrive/DharshanGithub/HRMS-client-3.0/HRMS-client-2.0/src/pages/Dashboards/AdminDashboard');
console.log("Done");
