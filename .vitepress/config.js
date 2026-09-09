import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// 不参与文档站的内容（无 md 或不应被收录）
const SKIP = new Set(['.vitepress', 'node_modules', '.workbuddy', '刷题', '题库', '.git'])

// 递归找某目录下第一个 .md（排除 00-目录），返回相对 root 的链接（去 .md）
function firstMd(dir) {
  let found = null
  const walk = (d) => {
    if (found) return
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (found) return
      const p = path.join(d, e.name)
      if (e.isDirectory()) {
        if (!SKIP.has(e.name)) walk(p)
      } else if (e.name.endsWith('.md') && !e.name.startsWith('00-目录')) {
        found = path.relative(root, p).split(path.sep).join('/').replace(/\.md$/, '')
        return
      }
    }
  }
  walk(dir)
  return found
}

// 板块名 -> emoji（顶部 nav 与侧栏分组共用）
const SECTION_ICON = {
  'docs': '📋',
  '行测': '📊',
  'AI应用开发': '🤖',
  '算法笔试LeetCode': '💻',
  'Java面试问题汇总': '☕',
  '结构化面试': '🎤',
  '半结构化面试': '💬',
  '无领导小组面试': '👥',
  '科技岗专业课': '📡',
  '刷题': '📝',
  '题库': '📚',
  '部署说明': '🚀',
}
const iconOf = (name) => SECTION_ICON[name] || '📘'

const topDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !SKIP.has(d.name))
  .map((d) => d.name)

const nav = [{ text: '🏠 首页', link: '/' }]
for (const name of topDirs) {
  const link = firstMd(path.join(root, name))
  if (link) nav.push({ text: iconOf(name) + ' ' + name, link: '/' + link })
}

// 自动侧栏（按目录树）；随后过滤掉空分组和非文档目录
let sidebar = generateSidebar({
  documentRootPath: '/',
  scanStartPath: '/',
  useTitleFromFile: true,
  excludePattern: ['00-目录.md', 'index.md', '部署说明.md', '**/node_modules/**', 'node_modules'],
})

const SKIP_GROUP = new Set(['刷题', '题库', 'node_modules', '.workbuddy', '.vitepress', '.git'])
sidebar = (sidebar || []).filter(
  (g) => g && Array.isArray(g.items) && g.items.length > 0 && !SKIP_GROUP.has(g.text)
)

// 自然排序：把"一/二/三"和"1./2./10."等前缀统一成整数比较，避免 Unicode 字典序把
// "深度学习"排在"RAG"之前、或把"1.x"排在"10.x"之后。
const CN_NUM = { '零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'百':100,'千':1000 }
function leadKey(s) {
  s = String(s).replace(/^[\s\u3000.\-_、:：>＞#]+/, '').trim()
  const m = s.match(/^(\d+)/)
  if (m) return [parseInt(m[1], 10), m[0].length]
  if (s && s[0] in CN_NUM) return [CN_NUM[s[0]], 1]
  return [Infinity, 0]
}
function naturalCompare(a, b) {
  const [na, la] = leadKey(a)
  const [nb, lb] = leadKey(b)
  if (na !== nb) return na - nb
  return la - lb
}
function sortSidebar(items) {
  if (!Array.isArray(items)) return
  items.sort((a, b) => naturalCompare(a.text || '', b.text || ''))
  for (const it of items) if (it.items) sortSidebar(it.items)
}
sortSidebar(sidebar)

// 给侧栏顶层分组加 emoji
for (const g of sidebar) {
  if (g && typeof g.text === 'string') g.text = iconOf(g.text) + ' ' + g.text
}

export default defineConfig({
  // 静态托管 base（由部署脚本注入）：
  //   用户页仓库（wzx825 / SfZd714.github.io）-> '/'
  //   项目页仓库（如 bzygq）                  -> '/bzygq/'
  // 兼容旧变量名 GITEE_PAGES_BASE / GITHUB_PAGES_BASE
  // 注意：静态托管（Gitee/GitHub Pages）无 URL 重写，必须保留 .html 扩展名，故不开启 cleanUrls
  base:
    process.env.PAGES_BASE ||
    process.env.GITHUB_PAGES_BASE ||
    process.env.GITEE_PAGES_BASE ||
    '/',
  title: '央国企求职指南手册',
  description: '央国企求职全流程教程归档：网申 / 简历 / 笔试 / 面试 / 体检入职，含行测、AI应用、算法、Java 等',
  lang: 'zh-CN',
  lastUpdated: true,
  // 原始文章间互链在子集归档里部分目标页不存在，忽略死链以免阻断构建
  ignoreDeadLinks: true,
  // 刷题 App / 题库 JSON / 索引页 不进入文档构建
  srcExclude: ['刷题/**', '题库/**', '**/00-目录.md', '部署说明.md', 'node_modules/**', '.workbuddy/**'],
  themeConfig: {
    nav,
    sidebar,
    sidebarMenuLabel: '分类导航',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最后更新于',
    docFooter: { prev: '上一篇', next: '下一篇' },
    outline: { label: '本页大纲', level: [2, 3] },
    search: { provider: 'local' },
  },
})
