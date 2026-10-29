const fs = require('node:fs');
const assert = require('node:assert/strict');
const css = fs.readFileSync('.vitepress/theme/workflow-progress.css', 'utf8');
const vue = fs.readFileSync('.vitepress/theme/WorkflowProgress.vue', 'utf8');
assert.match(vue, /class="wp"/);
assert.match(css, /\.wp\{[^}]*max-width:520px/);
assert.match(css, /\.wp \*\{box-sizing:border-box\}/);
assert.doesNotMatch(css, /\.as(?:[\s{.:#>-]|$)|--as-/);
console.log('Workflow progress root styling and namespace checks passed.');
