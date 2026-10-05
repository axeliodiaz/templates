import { defineConfig } from 'vitepress'

export default defineConfig({
  transformHtml(code, _id, ctx) {
    if (!ctx.page.startsWith('felix/') && ctx.page !== 'felix.md') return
    return code.replace('<html ', '<html class="felix" ')
  },
  title: 'Templates',
  description: 'Design-language guides by Axel Diaz',
  appearance: 'force-dark',
  cleanUrls: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600&display=swap' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Lustro', link: '/lustro' },
      { text: 'Felix', link: '/felix' },
      { text: 'PulseFit', link: '/pulsefit' },
      { text: 'Scopecraft', link: '/scopecraft' },
      { text: 'Lumen', link: '/lumen' }
    ],
    sidebar: {
      '/felix': [
        {
          text: 'Foundations',
          items: [
            { text: 'Overview', link: '/felix' },
            { text: 'Principles', link: '/felix/principles' },
            { text: 'Colors', link: '/felix/colors' },
            { text: 'Typography', link: '/felix/typography' },
            { text: 'Illustrations', link: '/felix/illustrations' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/felix/components/' },
            { text: 'Full UI catalog', link: '/felix/components/catalog' },
            { text: 'Bootstrap set', link: '/felix/components-more' },
            { text: 'Cart summary', link: '/felix/cart-summary' },
            { text: 'Price timeline', link: '/felix/price-timeline' },
            { text: 'Gauges', link: '/felix/gauges' },
            { text: 'Operations dashboard', link: '/felix/ops-dashboard' },
            { text: 'Waste dashboard', link: '/felix/waste-dashboard' },
            { text: 'Project dashboard', link: '/felix/project-dashboard' },
            { text: 'Forecast', link: '/felix/forecast' },
            { text: 'Atoms', link: '/felix/components/atoms' },
            { text: 'Molecules', link: '/felix/components/molecules' },
            { text: 'Organisms', link: '/felix/components/organisms' }
          ]
        },
        {
          text: 'Build',
          items: [
            { text: 'Design tokens', link: '/felix/tokens' },
            { text: 'Markdown', link: '/felix/markdown' },
            { text: 'Motion', link: '/felix/motion' },
            { text: 'Graphs', link: '/felix/graphs' }
          ]
        },
        { text: 'Charts', link: '/felix/components/charts', items: [{ text: '38 animated charts', link: '/felix/components/charts#animated-chart-catalog' }, { text: 'Reporting patterns', link: '/felix/components/charts#reporting-patterns' }] },
        { text: 'Examples', collapsed: false, items: [
            { text: 'Messaging', link: '/felix/messaging' },
            { text: 'Calendar', link: '/felix/calendar' },
            { text: 'Projects', link: '/felix/projects' },
            { text: 'Dependencies', link: '/felix/dependencies' },
            { text: 'Node flow', link: '/felix/node-flow' },
            { text: 'Finance', link: '/felix/finance' },
            { text: 'Reports', link: '/felix/reports' },
            { text: 'Shipping', link: '/felix/shipping' },
            { text: 'Pricing', link: '/felix/pricing' }
          ]
        }
      ],
      '/lumen': [
        { text: 'Lumen', items: [
            { text: 'Foundations', link: '/lumen' },
            { text: 'Components', link: '/lumen/components' },
            { text: 'Components: Bootstrap set', link: '/lumen/components-more' },
            { text: 'Cart summary', link: '/lumen/cart-summary' },
            { text: 'Price timeline', link: '/lumen/price-timeline' },
            { text: 'Gauges', link: '/lumen/gauges' },
            { text: 'Operations dashboard', link: '/lumen/ops-dashboard' },
            { text: 'Waste dashboard', link: '/lumen/waste-dashboard' },
            { text: 'Project dashboard', link: '/lumen/project-dashboard' },
            { text: 'Forecast', link: '/lumen/forecast' }
        ] },
        { text: 'Charts', link: '/lumen/charts' },
        { text: 'Examples', collapsed: false, items: [
            { text: 'Overview', link: '/lumen/overview' },
            { text: 'Traces', link: '/lumen/traces' },
            { text: 'Agents', link: '/lumen/agents' },
            { text: 'Evals', link: '/lumen/evals' }
        ] }
      ],
      '/scopecraft': [
        { text: 'Scopecraft', items: [
            { text: 'Foundations', link: '/scopecraft' },
            { text: 'Components', link: '/scopecraft/components' },
            { text: 'Components: Bootstrap set', link: '/scopecraft/components-more' },
            { text: 'Cart summary', link: '/scopecraft/cart-summary' },
            { text: 'Price timeline', link: '/scopecraft/price-timeline' },
            { text: 'Gauges', link: '/scopecraft/gauges' },
            { text: 'Operations dashboard', link: '/scopecraft/ops-dashboard' },
            { text: 'Waste dashboard', link: '/scopecraft/waste-dashboard' },
            { text: 'Project dashboard', link: '/scopecraft/project-dashboard' },
            { text: 'Forecast', link: '/scopecraft/forecast' }
        ] },
        { text: 'Charts', link: '/scopecraft/charts' },
        { text: 'Examples', collapsed: false, items: [
            { text: 'Dashboard', link: '/scopecraft/dashboard' },
            { text: 'Opportunities', link: '/scopecraft/opportunities' },
            { text: 'Proposals', link: '/scopecraft/proposals' },
            { text: 'Projects', link: '/scopecraft/projects' },
            { text: 'Templates library', link: '/scopecraft/templates' },
            { text: 'Rate card', link: '/scopecraft/rate-card' },
            { text: 'Settings', link: '/scopecraft/settings' }
        ] },
        { text: 'Opportunity tabs', collapsed: false, items: [
            { text: 'Overview', link: '/scopecraft/overview' },
            { text: 'Discovery', link: '/scopecraft/discovery' },
            { text: 'Scope', link: '/scopecraft/scope' },
            { text: 'Similar projects', link: '/scopecraft/similar' },
            { text: 'Estimate', link: '/scopecraft/estimate' },
            { text: 'Pricing', link: '/scopecraft/pricing-tab' },
            { text: 'Risks', link: '/scopecraft/risks' },
            { text: 'Proposal', link: '/scopecraft/proposal' },
            { text: 'SOW', link: '/scopecraft/sow' },
            { text: 'Activity', link: '/scopecraft/activity' }
        ] }
      ],
      '/pulsefit': [
        {
          text: 'PulseFit',
          items: [
            { text: 'Foundations', link: '/pulsefit' },
            { text: 'Components', link: '/pulsefit/components' },
            { text: 'Components: Bootstrap set', link: '/pulsefit/components-more' },
            { text: 'KPI cards', link: '/pulsefit/kpi-cards' },
            { text: 'Cart summary', link: '/pulsefit/cart-summary' },
            { text: 'Price timeline', link: '/pulsefit/price-timeline' },
            { text: 'Gauges', link: '/pulsefit/gauges' },
            { text: 'Operations dashboard', link: '/pulsefit/ops-dashboard' },
            { text: 'Waste dashboard', link: '/pulsefit/waste-dashboard' },
            { text: 'Project dashboard', link: '/pulsefit/project-dashboard' },
            { text: 'Forecast', link: '/pulsefit/forecast' }
          ]
        },
        { text: 'Charts', link: '/pulsefit/charts', items: [{ text: '38 animated charts', link: '/pulsefit/charts#animated-chart-catalog' }, { text: 'Reporting patterns', link: '/pulsefit/charts#reporting-patterns' }] },
        { text: 'Examples', collapsed: false, items: [
            { text: 'Messaging', link: '/pulsefit/messaging' },
            { text: 'Calendar', link: '/pulsefit/calendar' },
            { text: 'Staff', link: '/pulsefit/staff' },
            { text: 'Projects', link: '/pulsefit/projects' },
            { text: 'Dependencies', link: '/pulsefit/dependencies' },
            { text: 'Node flow', link: '/pulsefit/node-flow' },
            { text: 'Finance', link: '/pulsefit/finance' },
            { text: 'Reports', link: '/pulsefit/reports' },
            { text: 'Shipping', link: '/pulsefit/shipping' },
            { text: 'Pricing', link: '/pulsefit/pricing' }
          ]
        }
      ],
      '/': [
      { text: 'Getting started', items: [{ text: 'Introducción', link: '/introduccion' }] },
      { text: 'Fundamentos', items: [
        { text: 'Colores', link: '/fundamentos/colores' },
        { text: 'Tipografía', link: '/fundamentos/tipografia' },
        { text: 'Iconos', link: '/fundamentos/iconos' }
      ] },
      { text: 'Full UI catalog', link: '/ui-kit' },
      { text: 'Tables', link: '/tables', collapsed: true, items: ['Basic','Striped','Hover rows','Compact','Bordered','Sticky header','Sortable','Search and column filters','Pagination','Selectable rows','Row actions','Expandable rows','Numeric columns with deltas','Footer totals','Empty state','Loading skeleton','Responsive card layout'].map(t=>({ text: t, link: '/tables#' + ({'Search and column filters':'filterable','Numeric columns with deltas':'deltas','Responsive card layout':'responsive','Hover rows':'hover'}[t]||t.toLowerCase().replace(/ /g,'-')) })) },
      { text: 'Componentes', link: '/components', collapsed: true, items: [
        { text: 'Accordion', link: '/components#accordion' },
        { text: 'Alerts', link: '/components#alerts' },
        { text: 'Badge', link: '/components#badge' },
        { text: 'Breadcrumb', link: '/components#breadcrumb' },
        { text: 'Buttons', link: '/components#buttons' },
        { text: 'Button group', link: '/components#button-group' },
        { text: 'Card', link: '/components#card' },
        { text: 'Carousel', link: '/components#carousel' },
        { text: 'Close button', link: '/components#close-button' },
        { text: 'Collapse', link: '/components#collapse' },
        { text: 'Dropdowns', link: '/components#dropdowns' },
        { text: 'Forms', link: '/components#forms' },
        { text: 'List group', link: '/components#list-group' },
        { text: 'Modal', link: '/components#modal' },
        { text: 'Navbar & Footer', link: '/components#navbar-and-footer' },
        { text: 'Navs & tabs', link: '/components#navs-tabs' },
        { text: 'Offcanvas', link: '/components#offcanvas' },
        { text: 'Pagination', link: '/components#pagination' },
        { text: 'Placeholders', link: '/components#placeholders' },
        { text: 'Popovers', link: '/components#popovers' },
        { text: 'Progress', link: '/components#progress' },
        { text: 'Scrollspy', link: '/components#scrollspy' },
        { text: 'Spinners/Loaders', link: '/components#spinners-loaders' },
        { text: 'Tables', link: '/tables' },
        { text: 'Toasts', link: '/components#toasts' },
        { text: 'Tooltips', link: '/components#tooltips' }
      ] },
      { text: 'Email templates', items: [
        { text: 'Correos transaccionales', link: '/correos' },
        { text: 'Bienvenida', link: '/correos#bienvenida' },
        { text: 'Verificar correo', link: '/correos#verificar-correo' },
        { text: 'Recuperar contraseña', link: '/correos#recuperar-contrasena' },
        { text: 'Reserva confirmada', link: '/correos#reserva-confirmada' },
        { text: 'Recordatorio de clase', link: '/correos#recordatorio-de-clase' },
        { text: 'Cupo en lista de espera', link: '/correos#cupo-en-lista-de-espera' },
        { text: 'Clase cancelada', link: '/correos#clase-cancelada' },
        { text: 'Comprobante de compra', link: '/correos#comprobante-de-compra' },
        { text: 'Membresía por vencer', link: '/correos#membresia-por-vencer' }
      ] },
      { text: 'Examples', collapsed: false, items: [
        { text: 'Messaging', link: '/messaging' },
        { text: 'Calendar', link: '/calendar' },
        { text: 'Projects', link: '/projects' },
        { text: 'Dependencies', link: '/dependencies' },
        { text: 'Node flow', link: '/node-flow' },
        { text: 'Finance', link: '/finance' },
        { text: 'Reports', link: '/reports' },
        { text: 'Shipping', link: '/shipping' },
        { text: 'Pricing', link: '/pricing' },
        { text: 'Role examples', link: '/ejemplos/', collapsed: true, items: [
          { text: 'Introducción', link: '/ejemplos/' },
          { text: 'Users', link: '/ejemplos/users' },
          { text: 'Coaches', link: '/ejemplos/coaches' },
          { text: 'Admin', link: '/ejemplos/admin' }
        ] }
      ] },
          { text: 'Charts', link: '/graphs', collapsed: true, items: [
            { text: '38 animated charts', link: '/graphs#animated-chart-catalog' },
            { text: 'Introducción', link: '/graphs#data-charts' },
            { text: 'Line & Area', link: '/graphs#charts-line-area' },
            { text: 'Bar', link: '/graphs#charts-bar' },
            { text: 'Pie & Doughnut', link: '/graphs#charts-pie-doughnut' },
            { text: 'Radar & Polar', link: '/graphs#charts-radar-polar' },
            { text: 'Scatter & Bubble', link: '/graphs#charts-scatter-bubble' },
            { text: 'Mixed', link: '/graphs#charts-mixed' },
            { text: 'Reporting patterns', link: '/graphs#reporting-patterns' }
          ] },
          { text: 'Motion', link: '/motion' }
    ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/axeliodiaz/templates' }
    ]
  }
})
