import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  // 阅读进度条：固定顶部细条，随滚动填充
  enhanceApp({ router, siteData }) {
    if (typeof window === 'undefined') return

    // 避免重复创建
    if (document.getElementById('reading-progress')) return

    const bar = document.createElement('div')
    bar.id = 'reading-progress'
    bar.setAttribute('aria-hidden', 'true')
    document.body.appendChild(bar)

    let ticking = false
    function update() {
      const h = document.documentElement
      const scrollTop = h.scroll || window.scrollY || document.body.scrollTop
      const max = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0
      bar.style.width = pct + '%'
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  },
}