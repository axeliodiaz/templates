import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Templates',
  description: 'Design-language guides by Axel Diaz',
  cleanUrls: true,
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
