# -*- coding: utf-8 -*-
"""为每个板块目录生成 index.md 索引页，使 /板块名/ 这一类目录链接可访问。

VitePress 只在存在 index.md 时才会生成目录首页，否则点击板块链接会 404。
链接使用相对 .md 路径，由 VitePress 在构建时自动转写为正确的 .html URL。
"""
import os

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


def build_lines(dir_path, root_name, is_top):
    """递归生成该目录的索引内容。

    顶层目录（板块根）的标题用 ## + 板块 emoji；子目录的标题用 ### + 📘。
    链接用相对 .md 路径，由 VitePress 转写为 .html。
    """
    lines = []
    try:
        entries = sorted(os.listdir(dir_path))
    except OSError:
        return lines
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
    for name in files:
        link = './' + name.replace(' ', '%20')
        lines.append('- 📄 [%s](%s)' % (name[:-3], link))
    for name in dirs:
        sub = os.path.join(dir_path, name)
        sub_lines = build_lines(sub, root_name, False)
        if sub_lines:
            lines.append('')
            lines.append('### 📘 %s' % name)
            lines.extend(sub_lines)
    return lines


def main():
    made = []
    for name in sorted(os.listdir(ROOT)):
        d = os.path.join(ROOT, name)
        if not os.path.isdir(d) or name in SKIP or name.startswith('.'):
            continue
        idx = os.path.join(d, 'index.md')
        if os.path.exists(idx):
            print('跳过（已存在）%s' % name)
            continue
        body = build_lines(d, name, True)
        if not body:
            print('跳过（无内容）%s' % name)
            continue
        icon = SECTION_ICON.get(name, '📘')
        content = '# %s %s\n\n本文汇总 %s 板块下的全部文档，按目录结构组织。\n\n' % (icon, name, name) \
                  + '\n'.join(body) + '\n'
        with open(idx, 'w', encoding='utf-8') as f:
            f.write(content)
        made.append(name)
        print('生成 index.md -> %s (%d 项)' % (name, len([b for b in body if b.startswith('- ')])))
    print('完成，共生成 %d 个索引页' % len(made))


if __name__ == '__main__':
    main()
