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
      { text: 'Home', link: '/' }
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
            { text: 'Atoms', link: '/felix/components/atoms' },
            { text: 'Molecules', link: '/felix/components/molecules' },
            { text: 'Organisms', link: '/felix/components/organisms' },
            { text: 'Charts', link: '/felix/components/charts' }
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
        }
      ],
      '/': [
      { text: 'Getting started', items: [{ text: 'Introducción', link: '/introduccion' }] },
      { text: 'Fundamentos', items: [
        { text: 'Colores', link: '/fundamentos/colores' },
        { text: 'Tipografía', link: '/fundamentos/tipografia' },
        { text: 'Iconos', link: '/fundamentos/iconos' }
      ] },
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
      {
        text: 'Design languages',
        items: [
          { text: 'Lustro', link: '/lustro' },
          { text: 'Felix', link: '/felix' },
          { text: 'Charts', link: '/graphs', collapsed: true, items: [
            { text: 'Introducción', link: '/graphs#data-charts' },
            { text: 'Line & Area', link: '/graphs#charts-line-area' },
            { text: 'Bar', link: '/graphs#charts-bar' },
            { text: 'Pie & Doughnut', link: '/graphs#charts-pie-doughnut' },
            { text: 'Radar & Polar', link: '/graphs#charts-radar-polar' },
            { text: 'Scatter & Bubble', link: '/graphs#charts-scatter-bubble' },
            { text: 'Mixed', link: '/graphs#charts-mixed' }
          ] },
          { text: 'Motion', link: '/motion' }
        ]
      }
    ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/axeliodiaz/templates' }
    ]
  }
})
