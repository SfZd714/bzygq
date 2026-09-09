# -*- coding: utf-8 -*-
"""把 Markdown 中带过期签名的 hxsay 外链图片下载到本地 _images，并改写为相对引用。

背景：抓取时部分图片保留了 S3 预签名 URL（X-Amz-Signature），7 天后会失效导致线上裂图。
      去掉签名后的原始路径可公开读取，因此按 hash 重新下载落到本地。
"""
import os
import re
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP = {'.vitepress', 'node_modules', '.workbuddy', '.git', '刷题', '题库'}
IMG_RE = re.compile(r'!\[([^\]]*)\]\((https?://hxsay[^)]+)\)')


def find_images_dir(md_path):
    """找到该 md 应使用的 _images 目录：优先向上查找已存在的 _images。"""
    d = os.path.dirname(md_path)
    while d.startswith(ROOT):
        cand = os.path.join(d, '_images')
        if os.path.isdir(cand):
            return cand
        if d == ROOT:
            break
        d = os.path.dirname(d)
    # 没有就放到板块根（ROOT 下第一层）的 _images
    rel = os.path.relpath(md_path, ROOT)
    top = rel.split(os.sep)[0]
    return os.path.join(ROOT, top, '_images')


def url_to_hash(url):
    """从预签名 URL 提取图片 hash 与扩展名。"""
    path = urllib.parse.urlparse(url).path
    name = os.path.basename(path)
    base, ext = os.path.splitext(name)
    return base, ext or '.png'


def download(public_url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1024:
        return True
    tmp = dest + '.part'
    try:
        req = urllib.request.Request(public_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        if len(data) < 1024:  # 多半是 AccessDenied XML
            return False
        with open(tmp, 'wb') as f:
            f.write(data)
        os.replace(tmp, dest)
        return True
    except Exception as e:
        print('   下载失败 %s -> %s' % (public_url, e))
        if os.path.exists(tmp):
            os.remove(tmp)
        return False


def process(md_path):
    with open(md_path, encoding='utf-8') as f:
        text = f.read()
    hits = IMG_RE.findall(text)
    if not hits:
        return 0
    images_dir = find_images_dir(md_path)
    os.makedirs(images_dir, exist_ok=True)
    changed = 0
    for alt, url in hits:
        h, ext = url_to_hash(url)
        public_url = 'https://hxsay.com:19000/hxsay-image/quesion/imgs/%s%s' % (h, ext)
        dest = os.path.join(images_dir, h + ext)
        if not download(public_url, dest):
            continue
        rel = os.path.relpath(dest, os.path.dirname(md_path)).replace(os.sep, '/')
        new = '![%s](%s)' % (alt, rel)
        old = '![%s](%s)' % (alt, url)
        if old in text:
            text = text.replace(old, new)
            changed += 1
    if changed:
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(text)
    return changed


def main():
    total_files = 0
    total_imgs = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        for fn in filenames:
            if not fn.endswith('.md'):
                continue
            p = os.path.join(dirpath, fn)
            n = process(p)
            if n:
                total_files += 1
                total_imgs += n
                print('  %d 张 <- %s' % (n, os.path.relpath(p, ROOT)))
    print('完成：%d 个文件，%d 张图本地化' % (total_files, total_imgs))


if __name__ == '__main__':
    main()
