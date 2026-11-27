/** Live previews and copy snippets for Margin prose areas (getting started, guides, customize). */

export const MARGIN_BS6_PREVIEWS: Record<string, string> = {
  'guides/quickstart': `<div class="l-demo l-actions"><button type="button" class="btn-solid theme-primary">Save draft</button><button type="button" class="btn-outline theme-secondary">Discard</button></div>`,
  'guides/migration': `<div class="l-demo"><button type="button" class="btn-solid theme-primary">Action</button></div>`,
  'guides/contribute': `<div class="l-demo"><p class="mb-2 small text-body-secondary">Run the regen scripts locally, then open a PR against <code>develop</code>.</p><button type="button" class="btn-outline theme-primary">Open repo</button></div>`,
  'getting-started/introduction': `<p class="mb-0">Margin component docs use the <code>#6389ea</code> lab palette with scoped <code>.lab</code> / <code>b2-margin</code> previews.</p>`,
  'getting-started/approach': `<p>Margin keeps Bootstrap markup and layers <code>.lab</code> / <code>b2-margin</code> tokens for job-economics dashboards without forking component APIs.</p><ul class="mb-0"><li>Docs mirror BS6 section names</li><li>Live previews are scoped to <code>.lab</code></li></ul>`,
  'getting-started/accessibility': `<div class="l-demo"><button type="button" class="btn-solid theme-primary">Reviewable focus</button><p class="form-text mt-2 mb-0">Tab to this control — the focus ring uses Margin accent tokens.</p></div>`,
  'getting-started/browsers-devices': `<p class="mb-2">Previews target evergreen desktop and mobile browsers supported by Bootstrap 6.</p><span class="mg-demo-item mg-demo-item--soft">Chrome</span> <span class="mg-demo-item mg-demo-item--soft">Firefox</span> <span class="mg-demo-item mg-demo-item--soft">Safari</span>`,
  'getting-started/javascript': `<div class="l-demo"><button type="button" class="btn-outline theme-secondary" data-bs-toggle="collapse" data-bs-target="#mg-gs-collapse">Toggle collapse</button><div class="collapse mt-2" id="mg-gs-collapse"><div class="mg-demo-item mb-0">Bootstrap 6 collapse region</div></div></div>`,
  'getting-started/ai': `<p class="mb-0">When prompting agents, cite <code>/margin/components/button</code> paths and require <code>class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin"</code> on examples.</p>`,
  'customize/overview': `<div class="l-demo"><p class="mb-2">Margin maps <code>.lab</code> tokens into scoped <code>b2-margin</code> Bootstrap 6 via <code>scripts/build-margin-bs6-catalog.mjs</code>.</p><button type="button" class="btn-solid theme-primary">Sample control</button></div>`,
  'customize/sass': `<p class="mb-0">Sass entry: <code>build-margin-bs6-catalog.mjs</code> emits scoped <code>margin-bs6.css</code> from the shared BS6 kit.</p>`,
  'customize/theme': `<div class="l-demo l-actions"><span class="mg-demo-item mg-demo-item--accent">Primary</span><span class="mg-demo-item mg-demo-item--soft">Surface</span></div>`,
  'customize/components': `<p class="mb-0">Component tokens inherit <code>--surface</code>, <code>--line</code>, and accent <code>#6389ea</code> inside <code>.lab</code>.</p>`,
  'customize/css-variables': `<div class="p-3 rounded border vstack gap-2 small" style="background:var(--soft,#eceef5);color:var(--ink,#22252b)"><p class="mb-0">Uses <code>--bg</code>, <code>--ink</code>, <code>--surface</code> on <code>.lab</code> and maps to <code>--b2-*</code> inside <code>.b2-margin</code>.</p><code style="display:block;padding:8px;border:1px solid var(--line);border-radius:8px">--b2-accent: #6389ea;</code></div>`,
  'customize/options': `<p class="mb-0">Batch2 options tune radius, focus ring, and motion under <code>b2-margin</code>.</p>`,
  'customize/optimize': `<p class="mb-0">Production builds tree-shake unused kit sections; catalog pages embed a single component slice.</p>`,
  'customize/rtl': `<div dir="rtl" class="border rounded p-2"><button type="button" class="btn-outline theme-primary">زر تجريبي</button></div>`,
  'customize/transitions': `<button type="button" class="btn-solid theme-primary" style="transition:transform .15s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">Hover lift</button>`,
}

export const MARGIN_BS6_PROSE_COPY: Record<string, string> = {
  'guides/quickstart': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Margin demo</title>
    <link rel="stylesheet" href="/path/to/batch2-bs6.bootstrap.css" />
    <link rel="stylesheet" href="/path/to/margin-bs6.css" />
  </head>
  <body>
    <div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin">
      <button type="button" class="btn-solid theme-primary">Save draft</button>
      <button type="button" class="btn-outline theme-secondary">Discard</button>
    </div>
  </body>
</html>`,
  'guides/migration': `<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin lab-dark">
  <button type="button" class="btn-solid theme-primary">Action</button>
</div>`,
  'guides/contribute': `# Regenerate Margin docs
node scripts/scaffold-margin-bs6-ia.mjs
node scripts/patch-margin-sidebar.mjs
node scripts/build-margin-bs6-catalog.mjs
node scripts/build-margin-bs6-copy.mjs`,
  'getting-started/javascript': `<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin">
  <button type="button" class="btn-outline theme-secondary" data-bs-toggle="collapse" data-bs-target="#demo">Toggle</button>
  <div class="collapse" id="demo"><p class="mg-demo-item mb-0 mt-2">Plugin region</p></div>
</div>`,
  'customize/css-variables': `.lab {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --accent: #6389ea;
}
.b2-margin {
  --b2-accent: #6389ea;
  --b2-on: #0f1528;
}`,
}

export function marginBs6PreviewHtml(area: string, slug: string): string | null {
  return MARGIN_BS6_PREVIEWS[`${area}/${slug}`] ?? null
}