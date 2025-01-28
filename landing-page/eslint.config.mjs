import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend recommended rules for Next.js, TypeScript, and Prettier
  ...compat.extends(
    'next/core-web-vitals', // Next.js best practices
    'next/typescript', // TypeScript best practices
    'plugin:prettier/recommended', // Prettier integration
  ),
  {
    plugins: ['prettier'], // Enable the Prettier plugin
    rules: {
      // Ensure Prettier issues are flagged as ESLint errors
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
