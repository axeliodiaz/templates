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
      { text: 'PulseFit', link: '/pulsefit' }
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
        { text: 'Charts', link: '/felix/components/charts', items: [{ text: 'Reporting patterns', link: '/felix/components/charts#reporting-patterns' }] },
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
      '/pulsefit': [
        {
          text: 'PulseFit',
          items: [
            { text: 'Foundations', link: '/pulsefit' },
            { text: 'Components', link: '/pulsefit/components' }
          ]
        },
        { text: 'Charts', link: '/pulsefit/charts', items: [{ text: 'Reporting patterns', link: '/pulsefit/charts#reporting-patterns' }] },
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
        { text: 'Tables', link: '/components#tables' },
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
