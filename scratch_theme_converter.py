import os
import re

directory = r'c:\ddrive\DharshanGithub\HRMS-client-3.0\HRMS-client-2.0\src\pages\Dashboards\AdminDashboard'

replacements = [
    (r'(?<!dark:)bg-\[\#051424\]', r'bg-white dark:bg-[#051424]'),
    (r'(?<!dark:)bg-\[\#071425\]', r'bg-[#f8fafc] dark:bg-[#071425]'),
    (r'(?<!dark:)bg-\[\#0a1a2d\]', r'bg-white dark:bg-[#0a1a2d]'),
    (r'(?<!dark:)border-\[\#183052\]', r'border-slate-200 dark:border-[#183052]'),
    (r'(?<!dark:)text-\[\#9eb0cc\]', r'text-slate-500 dark:text-[#9eb0cc]'),
    (r'(?<!dark:)bg-\[\#0d2138\]', r'bg-white dark:bg-[#0d2138]'),
    (r'(?<!dark:)border-\[\#244061\]', r'border-slate-300 dark:border-[#244061]'),
    (r'(?<!dark:)text-\[\#6f839f\]', r'text-slate-400 dark:text-[#6f839f]'),
    (r'(?<!dark:)bg-\[\#172c46\]', r'bg-gray-100 dark:bg-[#172c46]'),
    (r'(?<!dark:)text-\[\#9aacc7\]', r'text-slate-600 dark:text-[#9aacc7]'),
    (r'(?<!dark:)text-\[\#cad7eb\]', r'text-slate-700 dark:text-[#cad7eb]'),
    (r'(?<!dark:)border-\[\#132944\]', r'border-slate-200 dark:border-[#132944]'),
    (r'(?<!dark:)bg-\[\#132b49\]', r'bg-slate-50 dark:bg-[#132b49]'),
    (r'(?<!dark:)bg-\[\#0D213B\]', r'bg-slate-100 dark:bg-[#0D213B]'),
    (r'(?<!dark:)text-\[\#8ca1bd\]', r'text-slate-600 dark:text-[#8ca1bd]'),
    
    # Text colors - tricky
    # If text-white is used where it should be dark mode text (e.g., headings)
    # We can use a regex that looks for text-white NOT inside a button-like class.
    # Actually, replacing text-white generally is risky. We'll do it contextually if possible or skip and do manually.
    # Let's replace 'text-white' with 'text-slate-900 dark:text-white' but ONLY if it's not next to a bright background like bg-blue-600 or bg-[#4F46E5]
    # Let's do this: if we see 'text-white' and we don't see 'bg-blue', 'bg-[#', 'bg-red' in the same className string, we replace it.
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    # special handling for text-white
    def text_white_replacer(match):
        class_str = match.group(0)
        if re.search(r'bg-(blue|red|green|purple|indigo|orange|yellow|pink)', class_str) or re.search(r'bg-\[\#(?!051424|071425|0a1a2d|0d2138|172c46|132b49|0D213B)[0-9a-fA-F]{6}\]', class_str):
            return class_str
        # If it already has dark:text-white or text-slate-900, skip
        if 'dark:text-white' in class_str or 'text-slate-900' in class_str:
            return class_str
        return class_str.replace('text-white', 'text-slate-900 dark:text-white')

    content = re.sub(r'className=["\'](.*?)["\']', text_white_replacer, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            if "FacultyManagementPage" in file: # skip as it's already ok
                continue
            process_file(os.path.join(root, file))

print("Done")
