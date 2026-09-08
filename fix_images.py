# -*- coding: utf-8 -*-
"""把 hxsay 正文里的 <img type="raw" value="..."> 内嵌 HTML 图片块
转成标准 Markdown 图片语法，并把图片下载到本地。

用法: python fix_images.py <目录> [--keep-remote]
"""
import glob, hashlib, html, os, re, sys, urllib.request, ssl
from concurrent.futures import ThreadPoolExecutor

BLOCK = re.compile(r'<img type="raw" value="(.*?)">', re.S)
# 未转义的原生 HTML 块：<div ...><img ...></div>
DIV = re.compile(r'<div[^>]*>(?:(?!</div>).)*?</div>', re.S)
# 零散的 <img ...> 标签
BARE = re.compile(r'<img\s[^>]*>', re.I)
SRC = re.compile(r'<img[^>]*src="([^"]+)"', re.I)
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")


def download(url, dst):
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return True
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                data = r.read()
            if data[:4] in (b"\x89PNG", b"\xff\xd8\xff", b"GIF8") or data[:4] == b"RIFF":
                open(dst, "wb").write(data)
                return True
        except Exception:
            pass
    return False


def main():
    root = sys.argv[1]
    keep_remote = "--keep-remote" in sys.argv
    img_dir = os.path.join(root, "_images")
    os.makedirs(img_dir, exist_ok=True)

    files = [p for p in glob.glob(os.path.join(root, "**", "*.md"), recursive=True)
             if not os.path.basename(p).startswith("00-")]
    jobs = []          # (url, dst)
    mapping = {}       # url -> relative markdown path
    for p in files:
        t = open(p, encoding="utf-8").read()
        cand = list(BLOCK.findall(t)) + DIV.findall(t) + BARE.findall(t)
        for m in SRC.findall("".join(html.unescape(x) for x in cand)):
            name = m.rsplit("/", 1)[-1].split("?")[0]
            if not re.search(r"\.(png|jpe?g|gif|webp|svg|bmp)$", name, re.I):
                name = hashlib.md5(m.encode()).hexdigest()[:16] + ".png"
            depth = os.path.relpath(p, root).count(os.sep)
            rel = "../" * depth + "_images/" + name
            mapping[m] = rel
            jobs.append((m, os.path.join(img_dir, name)))

    uniq = {}
    for u, d in jobs:
        uniq[u] = d
    print("待下载图片 %d 张（去重后）" % len(uniq))

    if not keep_remote:
        with ThreadPoolExecutor(max_workers=8) as ex:
            res = list(ex.map(lambda kv: download(kv[0], kv[1]), uniq.items()))
        ok = sum(1 for r in res if r)
        print("下载成功 %d / %d" % (ok, len(res)))
        failed = [u for (u, _), r in zip(uniq.items(), res) if not r]
        if failed:
            open(os.path.join(root, "_图片下载失败.txt"), "w", encoding="utf-8").write("\n".join(failed))
            print("失败清单已写入 _图片下载失败.txt")
    else:
        failed = []

    def to_md(fragment):
        """把一段 HTML 片段换成 Markdown 图片；没有图片则返回 None"""
        srcs = SRC.findall(fragment)
        if not srcs:
            return None
        out = []
        for s in srcs:
            if s in failed:
                out.append("![](%s)" % s)
            else:
                out.append("![](%s)" % mapping.get(s, s))
        return "\n\n" + "\n\n".join(out) + "\n"

    def repl_block(m):     # 转义过的 raw 块
        inner = html.unescape(m.group(1))
        r = to_md(inner)
        if r is not None:
            return r
        txt = re.sub(r"<[^>]+>", "", inner).strip()
        return "\n\n%s\n" % txt if txt else ""

    def repl_div(m):       # 未转义 div 块
        r = to_md(m.group(0))
        return r if r is not None else m.group(0)

    def repl_bare(m):      # 零散 img 标签
        r = to_md(m.group(0))
        return r if r is not None else m.group(0)

    n = 0
    for p in files:
        t = open(p, encoding="utf-8").read()
        t2 = BLOCK.sub(repl_block, t)
        t2 = DIV.sub(repl_div, t2)
        t2 = BARE.sub(repl_bare, t2)
        t2 = re.sub(r"\n{3,}", "\n\n", t2)
        if t2 != t:
            open(p, "w", encoding="utf-8").write(t2)
            n += 1
    print("已转换 %d 个文件" % n)


if __name__ == "__main__":
    main()
