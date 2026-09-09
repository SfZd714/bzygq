# -*- coding: utf-8 -*-
"""为每个板块目录生成 index.md 索引页，使 /板块名/ 这一类目录链接可访问。

VitePress 只在存在 index.md 时才会生成目录首页，否则点击板块链接会 404。

⚠️ 重要（曾踩坑）：索引页里的导航行是 **raw HTML**，VitePress **不会**
把其中的 .md 链接转写成 .html —— 早期版本误以为会自动转写，生成了
`./xxx.md`，结果 dist 里只有 .html，全站索引页链接 100% 404。
必须直接生成 `./xxx.html`（且 cleanUrls=false，不能省略后缀），
并对空格/中文做 URL 编码。

每个子文档展示为"迷你导航行"：左侧 001 编号徽标 + 中间标题 + 右侧圆形箭头。
大类（板块）用低饱和度强调色，配套颜色应用到色条、图标底、数量标签、编号徽标、
悬停态与箭头。视觉样式见 .vitepress/theme/style.css 的 .mini-nav-* 系列。
"""
import os
import re
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP = {'.vitepress', 'node_modules', '.workbuddy', '.git', '刷题', '题库'}
EXCLUDE_MD_PREFIX = ('00-目录',)

# 板块 emoji（与 .vitepress/config.js 的 SECTION_ICON 保持一致）
SECTION_ICON = {
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

# 板块对应的 CSS 主题类（用于不同大类配色）。映射到 style.css 的 .mini-nav-{theme}
SECTION_THEME = {
    'docs': 'docs',
    '行测': 'xingce',
    'AI应用开发': 'ai',
    '算法笔试LeetCode': 'algo',
    'Java面试问题汇总': 'java',
    '结构化面试': 'struct',
    '半结构化面试': 'semi',
    '无领导小组面试': 'group',
    '科技岗专业课': 'tech',
}

# 中文数字 → 整数（用于把"一、二、..." 排序）
CN_NUM = {'零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,
          '百':100,'千':1000,'两':2}

def lead_key(s):
    """提取开头的数字/中文数字 → 用于自然排序。
    返回 (排序值, 长度)。值相等时按字符串长度再比（小数字排在更前）。
    例如：
      "1.foo"        → (1, 2)
      "10.foo"       → (10, 3)
      "一、深度学习" → (1, 1)
      "三、RAG教程"  → (3, 1)
    """
    s = re.sub(r'^[\s\u3000.\-_、:：>＞#]+', '', s).strip()
    if not s:
        return (1 << 30, 0)
    m = re.match(r'^(\d+)', s)
    if m:
        return (int(m.group(1)), len(m.group(1)))
    if s[0] in CN_NUM:
        return (CN_NUM[s[0]], 1)
    return (1 << 30, 0)


def natural_sort(items):
    """自然排序：先按开头数字，再按剩余字符串字典序。"""
    def keyfn(s):
        num, lead_len = lead_key(s)
        # 去掉开头数字后再做字典序（小写、归一化空格），保证同前缀稳定
        rest = re.sub(r'^[\s\u3000.\-_、:：>＞#\d]+', '', s).strip()
        return (num if num < (1 << 30) else 1 << 30, lead_len, rest)
    return sorted(items, key=keyfn)


def list_entries(dir_path):
    """列出目录下的子目录与可展示的 .md 文件，分类返回（已排序）。"""
    try:
        entries = os.listdir(dir_path)
    except OSError:
        return [], []
    dirs, files = [], []
    for name in entries:
        if name in SKIP or name.startswith('.'):
            continue
        if name == '_images':
            continue
        p = os.path.join(dir_path, name)
        if os.path.isdir(p):
            dirs.append(name)
        elif name.endswith('.md') and not name.startswith(EXCLUDE_MD_PREFIX) and name != 'index.md':
            files.append(name)
    return natural_sort(dirs), natural_sort(files)


def build_lines(dir_path, theme, rel_prefix=''):
    """生成该目录的索引内容（用 HTML 卡片形式）。
    子文档渲染为 .mini-nav-row；子目录渲染为 ### 📘 <目录名>，再递归其内容。

    rel_prefix：当前目录相对于**板块索引页**的路径前缀（如 "逻辑推理/1.图形推理/"）。
    递归时必须累加，否则子目录里的文档会生成成平级链接而 404。

    注意：分类配色类（theme-xxx）直接挂在每行 row 上，而不是外层包裹 div——
    因为 raw HTML 块与 Markdown 的 `###` 标题混排会让 Vue 编译器误判标签闭合。
    """
    lines = []
    dirs, files = list_entries(dir_path)
    # 先文件
    for i, name in enumerate(files, 1):
        # 直接指向构建产物 .html（cleanUrls=false，不能省后缀）
        # 路径需带上 rel_prefix，并对空格/中文逐段编码
        rel = rel_prefix + name[:-3] + '.html'
        link = './' + '/'.join(urllib.parse.quote(seg) for seg in rel.split('/'))
        title = name[:-3]  # 去 .md
        # 标题中的 &、<、>、" 需要 HTML 转义
        safe_title = (title.replace('&', '&amp;')
                          .replace('<', '&lt;')
                          .replace('>', '&gt;')
                          .replace('"', '&quot;'))
        badge = '%03d' % i
        lines.append(
            '<div class="mini-nav-row theme-%s">'
            '<span class="mini-nav-badge">%s</span>'
            '<a class="mini-nav-link" href="%s">%s</a>'
            '<span class="mini-nav-arrow" aria-hidden="true">→</span>'
            '</div>' % (theme, badge, link, safe_title)
        )
    # 后子目录（递归）
    for name in dirs:
        sub = os.path.join(dir_path, name)
        sub_html = build_lines(sub, theme, rel_prefix + name + '/')
        if sub_html:
            lines.append('')
            lines.append('### 📘 %s' % name)
            lines.append('')
            lines.extend(sub_html)
    return lines


def count_files(dir_path):
    """统计板块下 md 文档总数（递归，含子目录）。"""
    dirs, files = list_entries(dir_path)
    n = len(files)
    for d in dirs:
        n += count_files(os.path.join(dir_path, d))
    return n


def main():
    made = []
    for name in natural_sort(os.listdir(ROOT)):
        d = os.path.join(ROOT, name)
        if not os.path.isdir(d) or name in SKIP or name.startswith('.'):
            continue
        idx = os.path.join(d, 'index.md')
        icon = SECTION_ICON.get(name, '📘')
        theme = SECTION_THEME.get(name, 'default')
        body = build_lines(d, theme)
        if not body:
            print('跳过（无内容）%s' % name)
            continue
        total = count_files(d)
        # 用 Markdown 标题 + 描述（避免 raw HTML 块与 `###` 混排导致 Vue 编译报错）
        head = '# %s %s\n\n> %s 板块的全部文档，共 **%d 篇**，按目录结构组织。\n\n' % (icon, name, name, total)
        content = head + '\n'.join(body)
        with open(idx, 'w', encoding='utf-8') as f:
            f.write(content)
        made.append(name)
        print('生成 index.md -> %s (%d 篇)' % (name, total))
    print('完成，共生成/更新 %d 个索引页' % len(made))


if __name__ == '__main__':
    main()