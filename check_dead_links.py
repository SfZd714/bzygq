# -*- coding: utf-8 -*-
"""全站内部死链扫描（在构建产物 dist 上跑，不需要联网）。

用法：
    python check_dead_links.py

原理：
    1. 收集 .vitepress/dist 下所有文件作为"存在集合"
    2. 扫描每个 .html 里的 href="/bzygq/..." 内部链接
    3. 逐个比对目标文件是否存在（自动补 index.html / .html 后缀）

⚠️ 易踩坑（血泪）：
    链接里如果含 `&`（如 "体检&入职/1.xxx.html"），在 HTML 源码中会被转义成 `&amp;`。
    直接 unquote 不会还原实体，会把这些正常链接**全部误报为死链**。
    必须先 `html.unescape()` 再 `urllib.parse.unquote()`。
    —— 本项目第一次扫描就因此误报了 15 个（328 个页面全中）。

退出码：0 = 无死链；1 = 发现死链（便于 CI / 部署脚本串联）
"""
import os
import re
import sys
import html as htmlmod
import urllib.parse
from collections import defaultdict

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.vitepress', 'dist')
# base 与 .vitepress/config.js 保持一致（部署时由 PAGES_BASE 注入）
BASE = os.environ.get('PAGES_BASE') or '/bzygq/'
if not BASE.endswith('/'):
    BASE += '/'


def collect_existing(dist):
    """收集 dist 下所有文件，返回 '/相对路径' 集合。"""
    existing = set()
    for dirpath, _, filenames in os.walk(dist):
        for fn in filenames:
            rel = os.path.relpath(os.path.join(dirpath, fn), dist).replace(os.sep, '/')
            existing.add('/' + rel)
    return existing


def scan(dist, existing, base):
    """扫描所有 html 的内部链接，返回 {坏链接: [出现在哪些页面]}。"""
    bad = defaultdict(list)
    checked = 0
    html_files = sorted(f for f in existing if f.endswith('.html'))
    pattern = re.compile(r'href="(' + re.escape(base) + r'[^"#?]+)"')

    for rel in html_files:
        try:
            with open(os.path.join(dist, rel.lstrip('/')), encoding='utf-8', errors='ignore') as f:
                doc = f.read()
        except OSError:
            continue

        for m in pattern.finditer(doc):
            href = m.group(1)
            # 静态资源与外链跳过
            if href.startswith(base + 'assets/'):
                continue
            # 关键：先还原 HTML 实体（&amp; -> &），再 URL 解码
            target = htmlmod.unescape(urllib.parse.unquote(href[len(base):]))
            target = '/' + target
            # 目录链接 / 无后缀链接 的多种可能落点
            cand = [target]
            if target.endswith('/'):
                cand.append(target + 'index.html')
            elif not target.endswith('.html'):
                cand.append(target + '.html')
                cand.append(target + '/index.html')

            checked += 1
            if not any(c in existing for c in cand):
                bad[href].append(rel)

    return bad, checked, len(html_files)


def main():
    if not os.path.isdir(DIST):
        print('❌ 找不到构建产物：%s' % DIST)
        print('   请先执行：PAGES_BASE=%s npx vitepress build' % BASE)
        return 2

    existing = collect_existing(DIST)
    bad, checked, n_pages = scan(DIST, existing, BASE)

    print('=' * 56)
    print('全站内部死链扫描')
    print('=' * 56)
    print('构建产物 : %s' % DIST)
    print('base     : %s' % BASE)
    print('文件总数 : %d' % len(existing))
    print('页面数   : %d' % n_pages)
    print('检查链接 : %d' % checked)
    print('死链种类 : %d' % len(bad))
    print()

    if not bad:
        print('✅ 未发现内部死链')
        return 0

    print('❌ 发现以下死链（按出现次数排序）：')
    print()
    for href, pages in sorted(bad.items(), key=lambda x: -len(x[1])):
        shown = htmlmod.unescape(urllib.parse.unquote(href))
        print('  %4d 处  %s' % (len(pages), shown))
        for p in pages[:3]:
            print('            ↳ %s' % p)
        if len(pages) > 3:
            print('            ↳ ...等 %d 个页面' % len(pages))
        print()
    return 1


if __name__ == '__main__':
    sys.exit(main())