---
aside: false
---
# Pace CSS implementation

```css
/* studio-systems.css */
.studio-pace {
  --sk-bg: #f5f8f4;  --sk-surface: #fff;  --sk-border: #cfdcd3;
  --sk-ink: #173528; --sk-muted: #52665a;
  --sk-accent: #23724e; --sk-on: #fff; --sk-soft: #23724e14;
  --sk-success: #1a6e44; --sk-warning: #8a5a00;
  --sk-danger: #b3261e;  --sk-info: #255f9e;
  --sk-radius: 12px;
}
html.tpl-dark .studio-pace {
  --sk-bg: #111a15;  --sk-surface: #18241d; --sk-border: #2b3d32;
  --sk-ink: #e6f1ea; --sk-muted: #a2b7a9;
  --sk-accent: #83d4a1; --sk-on: #0b2417; --sk-soft: #83d4a122;
  --sk-success: #7fd69b; --sk-warning: #f0c36d;
  --sk-danger: #f29b94;  --sk-info: #8fbfee;
}
```

## Usage

```vue
<script setup>
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>
<StudioCatalog theme="pace" section="atoms" />
```

`section` accepts `atoms`, `molecules`, `charts`, `layouts`; omit it for the full catalog. Wrap your own screens in `studio-kit studio-pace` and use the `sk-*` classes and `btn btn-solid theme-primary` for Bootstrap 6 controls (scoped, no shell bleed).

| Class | Role |
| --- | --- |
| `studio-kit studio-pace` | Theme scope and semantic variables |
| `sk-primary`, `sk-ghost`, `sk-danger` | Button variants |
| `sk-badge success/warning/danger/info` | Status variants |
| `sk-card`, `sk-table-wrap`, `sk-alert`, `sk-toast` | Surfaces and feedback |
| `pace-num` | Tabular display number |

Preview controls update local state only. Reuse the classes and tokens in real components; do not ship demonstration handlers as application logic. For Admin Studio, map `--sk-accent` and `--sk-on` to the per-studio branding tokens and keep the rest as defaults.
