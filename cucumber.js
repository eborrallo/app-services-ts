const common = [
  '--require-module ts-node/register' // Load TypeScript module
];

const auth = [
  ...common,
  'tests/apps/auth/features/**/*.feature',
  '--require tests/apps/auth/step_definitions/*.steps.ts'
].join(' ');

const storage = [
  ...common,
  'tests/apps/storage/features/**/*.feature',
  '--require tests/apps/storage/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
  auth,
  storage
};
