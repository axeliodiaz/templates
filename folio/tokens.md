# Folio tokens and implementation

```css
.studio-folio {
  --sk-bg: #232423;
  --sk-surface: #2a2c2a;
  --sk-ink: #edf0eb;
  --sk-muted: #b5bdb5;
  --sk-border: #414641;
  --sk-accent: #a7d9c5;
  --sk-on: #163f35;
  --sk-radius: 10px;
}
```

## Component contract

| Class | Purpose |
| --- | --- |
| `studio-kit studio-folio` | Theme scope and semantic variables |
| `sk-primary`, `sk-ghost`, `sk-danger`, `sk-sm`, `sk-lg` | Button variants |
| `sk-badge success/warning/danger/info` | Status variants |
| `sk-avatar`, `sk-avatars` | Person and group identifiers |
| `sk-choice`, `sk-invalid`, `sk-error` | Form variants and error text |
| `sk-switch on`, `sk-spinner`, `sk-skeleton` | Toggle/loading variants |
| `sk-card`, `sk-tabs`, `sk-popover`, `sk-dialog`, `sk-drawer` | Composed surfaces |
| `sk-table-wrap`, `sk-stepper`, `sk-list-item` | Data and navigation patterns |
| `sk-chart`, `sk-bars`, `sk-stack`, `sk-pixels` | Chart primitives |
| `sk-toast`, `sk-shell` | Feedback and app structure |

```vue
<script setup>
import StudioCatalog from './.vitepress/theme/StudioCatalog.vue'
</script>
<StudioCatalog theme="folio" section="atoms" />
```

The `section` prop accepts `atoms`, `molecules`, `charts`, `layouts`; omit it for the full catalog. Preview controls update local state only. Reuse the classes and tokens in real components; do not ship demonstration handlers as application logic.
