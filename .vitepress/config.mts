import { defineConfig } from 'vitepress'

export default defineConfig({
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
      { text: 'Lustro', link: '/lustro' }
    ],
    sidebar: [
      {
        text: 'Design languages',
        items: [
          { text: 'Lustro', link: '/lustro' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/axeliodiaz/templates' }
    ]
  }
})
