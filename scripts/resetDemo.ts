import { execSync } from 'child_process';
import path from 'path';

console.log('🔄 Resetting V-CORP Demo Environment to Pristine State...');
try {
  const seedScript = path.join(__dirname, '../server/src/scripts/seedData.ts');
  execSync(`npx tsx "${seedScript}"`, { stdio: 'inherit', cwd: path.join(__dirname, '../server') });
  console.log('✅ Demo Environment successfully reset!');
} catch (err) {
  console.error('Failed to reset demo environment:', err);
}
