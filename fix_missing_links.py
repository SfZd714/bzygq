# -*- coding: utf-8 -*-
"""把 Markdown 里指向「未归档文档」的站内链接降级为纯文本。

背景：
    原始博客文章之间存在大量互链（如 [上岸攻略总览](上岸攻略总览)），
    但本站只归档了其中一部分。这些链接点开就是 404，体验很差。
    之前靠 config 里的 ignoreDeadLinks:true 让构建不报错，属于"掩耳盗铃"。

做法：
    1. 扫描所有 .md 里的 Markdown 内联链接 [文字](目标)
    2. 只处理「站内链接」（非 http/https、非 # 锚点、非 mailto）
    3. 目标文件在本站不存在 -> 把 [文字](目标) 替换成 `文字`（去掉链接）
    4. 目标存在 -> 不动

用法：
    python fix_missing_links.py          # 预演，只打印不改动
    python fix_missing_links.py --apply  # 实际写入
"""
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {'.vitepress', 'node_modules', '.workbuddy', '.git', '.deploy_tmp'}

# [文字](目标) —— 目标中允许空格与中文
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^()\s]+(?:\s[^)]*)?)\)')


def is_internal(target):
    """是否站内链接（需要校验存在性）。"""
    t = target.strip()
    if not t:
        return False
    if t.startswith(('http://', 'https://', 'mailto:', '#', 'tel:')):
        return False
    if t.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')):
        return False
    return True


def resolve(base_dir, target):
    """把链接目标解析成「相对 ROOT」的 posix 路径。

    ⚠️ 必须与 collect_files() 里 md_set 的键保持同一形态（相对 ROOT 的
    posix 路径、且经过 normpath），否则会全部误判为失效链接。
    """
    t = urllib.parse.unquote(target.split('#')[0].split('?')[0].strip())
    if not t:
        return None
    joined = os.path.join(base_dir, t) if base_dir else t
    rel = os.path.relpath(os.path.normpath(joined), ROOT)
    return rel.replace(os.sep, '/')


def target_exists(base_dir, target, md_set):
    """目标文档是否存在（base_dir 为相对 ROOT 的目录）。"""
    p = resolve(base_dir, target)
    if p is None:
        return True  # 空目标不处理
    cands = [p, p + '.md', p + '.html',
             p + '/index.md', p + '/index.html']
    if any(os.path.normpath(c) in md_set for c in cands):
        return True

    # 兜底：抓取后做过「去浣熊前缀」等重命名，目录文件里的旧链接会失效。
    # 尝试把文件名中的"浣熊"去掉再匹配一次。
    d, b = os.path.dirname(p), os.path.basename(p)
    if '浣熊' in b:
        alt = os.path.join(d, b.replace('浣熊', '')) if d else b.replace('浣熊', '')
        cands2 = [alt, alt + '.md', alt + '.html']
        if any(os.path.normpath(c) in md_set for c in cands2):
            return True
    return False


def collect_files():
    """收集所有 md 文件（相对 ROOT 的 posix 路径集合 + 绝对路径列表）。"""
    md_set = set()
    abs_list = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.endswith('.md'):
                continue
            ap = os.path.join(dirpath, fn)
            rel = os.path.relpath(ap, ROOT).replace(os.sep, '/')
            md_set.add(os.path.normpath(rel))
            abs_list.append(ap)
    return md_set, abs_list


def main():
    apply = '--apply' in sys.argv
    md_set, abs_list = collect_files()

    total_fixed = 0
    touched = {}

    for ap in abs_list:
        rel = os.path.relpath(ap, ROOT).replace(os.sep, '/')
        base_dir = os.path.dirname(rel)

        with open(ap, encoding='utf-8', errors='ignore') as f:
            src = f.read()

        fixed = [0]

        def repl(m):
            text, target = m.group(1), m.group(2)
            if not is_internal(target):
                return m.group(0)
            if target_exists(base_dir, target, md_set):
                return m.group(0)
            fixed[0] += 1
            return text

        new = LINK_RE.sub(repl, src)
        if new != src:
            total_fixed += fixed[0]
            if apply:
                with open(ap, 'w', encoding='utf-8') as f:
                    f.write(new)
            print('  %s' % rel)

    print()
    print('=' * 56)
    print('失效站内链接清理')
    print('=' * 56)
    print('扫描文件 : %d' % len(abs_list))
    print('失效链接 : %d' % total_fixed)
    print('涉及文件 : %d' % len(touched))
    if not apply:
        print()
        print('（预演模式，未写入。加 --apply 实际执行）')
    return 0


if __name__ == '__main__':
    sys.exit(main())
