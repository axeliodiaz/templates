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
            { text: 'Typography', link: '/felix/typography' }
          ]
        },
        {
          text: 'Build',
          items: [
            { text: 'Design tokens', link: '/felix/tokens' },
            {
              text: 'Components',
              link: '/felix/components/',
              items: [
                { text: 'Atoms', link: '/felix/components/atoms' },
                { text: 'Molecules', link: '/felix/components/molecules' },
                { text: 'Organisms', link: '/felix/components/organisms' },
                { text: 'Charts', link: '/felix/components/charts' }
              ]
            }
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
      {
        text: 'Design languages',
        items: [
          { text: 'Lustro', link: '/lustro' },
          { text: 'Felix', link: '/felix' },
          {
            text: 'Components',
            link: '/components',
            collapsed: true,
            items: [
              { text: 'Buttons', link: '/components#buttons' },
              { text: 'Button group and dropdown', link: '/components#button-group-and-dropdown' },
              { text: 'Links and pagination', link: '/components#links-and-pagination' },
              { text: 'Alerts and notifications', link: '/components#alerts-and-notifications' },
              { text: 'Toasts', link: '/components#toasts' },
              { text: 'Badges, progress, spinners and skeletons', link: '/components#badges-progress-spinners-and-skeletons' },
              { text: 'Cards', link: '/components#cards' },
              { text: 'Accordion', link: '/components#accordion' },
              { text: 'Tabs, breadcrumbs and list group', link: '/components#tabs-breadcrumbs-and-list-group' },
              { text: 'Table and empty state', link: '/components#table-and-empty-state' },
              { text: 'Inputs, select, checkbox, radio and switch', link: '/components#inputs-select-checkbox-radio-and-switch' },
              { text: 'Modal dialog', link: '/components#modal-dialog' },
              { text: 'Tooltip and popover', link: '/components#tooltip-and-popover' },
              { text: 'Layout primitives', link: '/components#layout-primitives' }
            ]
          },
          { text: 'Graphs', link: '/graphs' },
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
