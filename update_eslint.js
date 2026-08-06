const fs = require('fs');

let content = fs.readFileSync('eslint.config.js', 'utf8');

if (!content.includes("import unusedImports")) {
  content = content.replace("import importPlugin from 'eslint-plugin-import';", "import importPlugin from 'eslint-plugin-import';\nimport unusedImports from 'eslint-plugin-unused-imports';");
}

const importOrderRule = `
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
            ],
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: '@inertiajs/**',
                            group: 'external',
                            position: 'after',
                        },
                        {
                            pattern: 'lucide-react',
                            group: 'external',
                            position: 'after',
                        },
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['react', 'type'],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],`;

content = content.replace(/plugins: \{\n\s*import: importPlugin,\n\s*\}/, "plugins: {\n            import: importPlugin,\n            'unused-imports': unusedImports,\n        }");

content = content.replace(/'import\/order': \[\s*'error',\s*\{\s*groups: \[\s*'builtin',\s*'external',\s*'internal',\s*'parent',\s*'sibling',\s*'index',\s*\],\s*alphabetize: \{ order: 'asc', caseInsensitive: true \},\s*\},\s*\],/, importOrderRule);

fs.writeFileSync('eslint.config.js', content);
