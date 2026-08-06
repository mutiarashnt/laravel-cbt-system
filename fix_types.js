const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = [
  'resources/js/pages/user/exams/session.tsx',
  'resources/js/pages/admin/exams/create.tsx',
  'resources/js/pages/admin/exams/edit.tsx',
  'resources/js/pages/admin/questions/create.tsx',
  'resources/js/pages/admin/questions/edit.tsx',
  'resources/js/pages/admin/questions/index.tsx'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/onChange=\{\(e\) =>/g, "onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>");
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
}
