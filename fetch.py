# -*- coding: utf-8 -*-
"""抓取 hxsay.com 知识库 -> 本地 Markdown
用法: python fetch.py [full|preview] [prefix] [输出目录]
  python fetch.py                                   # 默认抓「浣熊指南」到 docs/
  python fetch.py full blogs/浣熊专业课/ 专业课      # 抓「浣熊专业课」到 专业课/
环境变量 HXSAY_TOKEN 提供登录 token（full 模式需要）
"""
import json, os, re, ssl, sys, time, urllib.parse, urllib.request

BASE = "https://www.hxsay.com"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
DEVICE = "6f1c2b3e-4d5a-4b6c-8d7e-9f0a1b2c3d4e"
BUCKET = "hxsay"
ROOT_PREFIX = "blogs/浣熊指南/"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "docs")
MODE = "preview"  # preview | full

# 命令行覆盖：python fetch.py [full|preview] [prefix] [outdir]
_args = [a for a in sys.argv[1:]]
if _args and _args[0] in ("full", "preview"):
    MODE = _args.pop(0)
if _args:
    ROOT_PREFIX = _args.pop(0)
if _args:
    OUT = _args.pop(0)
if not ROOT_PREFIX.endswith("/"):
    ROOT_PREFIX += "/"

TOKEN = os.environ.get("HXSAY_TOKEN", "").strip()


def headers():
    h = {
        "User-Agent": UA,
        "Referer": BASE + "/blog_page",
        "X-Station-Device-Id": DEVICE,
        "Accept-Encoding": "identity",
    }
    if TOKEN:
        h["Authorization"] = TOKEN
        h["Sa-Token"] = TOKEN
    return h


ctx = ssl.create_default_context()


def get_json(path, params, retries=3):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers())
            with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < retries - 1:
                time.sleep(6 + 6 * i)
                continue
            if i == retries - 1:
                return {"code": -1, "msg": "HTTP %s" % e.code}
        except Exception as e:
            if i == retries - 1:
                return {"code": -1, "msg": str(e)}
            time.sleep(1.5 + i)


def nav(prefix):
    d = get_json("/api/blog-page/request-blog-nav-items", {"bucket": BUCKET, "prefix": prefix})
    if d and d.get("code") == 200 and d.get("data"):
        return d["data"]
    return None


def get_content(prefix, filename):
    if MODE == "full":
        d = get_json("/api/blog-page/request-blog-content",
                     {"bucket": BUCKET, "prefix": prefix, "fileName": filename})
        if d and d.get("code") == 200 and isinstance(d.get("data"), str):
            return d["data"], "full"
    d = get_json("/api/blog-page/request-blog-preview",
                 {"bucket": BUCKET, "prefix": prefix, "fileName": filename})
    if d and d.get("code") == 200 and isinstance(d.get("data"), str):
        return d["data"], "preview"
    return None, (d or {}).get("msg", "fail")


SAFE = re.compile(r'[\\/:*?"<>|]')


def safe(name):
    return SAFE.sub("_", name).strip() or "untitled"


def collect(node, items, path):
    """node: nav 节点; path: 该节点之上的目录路径列表"""
    children = node.get("children") or []
    name = node.get("dirName") or (node.get("mdName") or "").replace(".md", "")
    prefix = node.get("prefix") or ""
    mdname = node.get("mdName") or ""
    if not children and name and not mdname.endswith(".md"):
        sub = nav(prefix + name + "/")
        if sub and sub.get("children"):
            children = sub["children"]
    if children:
        collect_all(children, items, path + [name or ""])
    else:
        fname = node.get("mdName")
        if fname:
            items.append({"prefix": prefix, "fileName": fname, "path": path})


def collect_all(nodes, items, path):
    for n in nodes:
        collect(n, items, path)


def postprocess():
    """补 H1 标题、本地化图片、生成索引"""
    import subprocess, urllib.parse
    img_dir = os.path.join(OUT, "_images")
    img_pat = re.compile(r'!\[([^\]]*)\]\((https://hxsay\.com:19000/[^)]+)\)')

    def localize(text, rel_depth):
        def rep(m):
            url = m.group(2)
            fn = url.rsplit("/", 1)[-1].split("?")[0]
            os.makedirs(img_dir, exist_ok=True)
            dst = os.path.join(img_dir, fn)
            if not os.path.exists(dst):
                subprocess.run(["curl", "-s", "-k", "--max-time", "40", "-o", dst, url],
                               check=False)
            return "![%s](%s_images/%s)" % (m.group(1), "../" * rel_depth, fn)
        return img_pat.sub(rep, text)

    for root, _, files in os.walk(OUT):
        for fn in files:
            if not fn.endswith(".md") or fn.startswith("00-"):
                continue
            p = os.path.join(root, fn)
            t = open(p, encoding="utf-8").read()
            if not t.lstrip().startswith("#"):
                t = "# %s\n\n%s" % (fn[:-3], t.lstrip())
            t2 = localize(t, os.path.relpath(p, OUT).count(os.sep))
            if t2 != t or not open(p, encoding="utf-8").read().lstrip().startswith("#"):
                open(p, "w", encoding="utf-8").write(t2)

    cats = []
    total = tw = 0
    for name in sorted(os.listdir(OUT)):
        cd = os.path.join(OUT, name)
        if not os.path.isdir(cd) or name == "_images":
            continue
        md = []
        for r, _, fs in os.walk(cd):
            for f in fs:
                if f.endswith(".md"):
                    md.append(os.path.relpath(os.path.join(r, f), cd))
        if not md:
            continue
        md.sort()
        w = sum(len(open(os.path.join(cd, m), encoding="utf-8").read()) for m in md)
        cats.append((name, len(md), w, md))
        total += len(md)
        tw += w
    L = ["# %s（本地 Markdown 归档）" % ROOT_PREFIX.strip("/").split("/")[-1], "",
         "> 来源：%s/blog_page?bucket=%s&prefix=%s" % (BASE, BUCKET, urllib.parse.quote(ROOT_PREFIX)),
         "> 抓取时间：%s · 版本：%s" % (time.strftime("%Y-%m-%d"),
                                    "会员全文版" if (MODE == "full" or TOKEN) else "预览版"),
         "", "| 分类 | 篇数 | 字数 |", "| --- | --- | --- |"]
    for c, k, w, _ in cats:
        L.append("| %s | %d | %s |" % (c, k, format(w, ",")))
    L.append("| **合计** | **%d** | **%s** |" % (total, format(tw, ",")))
    L.append("")
    for c, k, w, md in cats:
        L.append("## %s（%d 篇）" % (c, k))
        L.append("")
        for i, m in enumerate(md, 1):
            title = os.path.basename(m)[:-3]
            indent = "  " * m.count(os.sep)
            L.append("%s%d. [%s](./%s)" % (indent, i, title,
                                           urllib.parse.quote(c + "/" + m.replace(os.sep, "/"))))
        L.append("")
    open(os.path.join(OUT, "00-目录.md"), "w", encoding="utf-8").write("\n".join(L))
    print("索引已生成：%s 篇 / %s 字" % (total, format(tw, ",")))


def main():
    root = nav(ROOT_PREFIX)
    if root is None:
        print("目录获取失败", file=sys.stderr)
        sys.exit(1)
    items = []
    collect_all(root.get("children") or [], items, [])
    print("共 %d 篇文档" % len(items))
    os.makedirs(OUT, exist_ok=True)
    report = []
    for idx, it in enumerate(items, 1):
        fp_final = None
        rel = "/".join(safe(p) for p in it["path"] if p)
        d = os.path.join(OUT, rel)
        fp_final = os.path.join(d, safe(it["fileName"]))
        if os.path.exists(fp_final) and MODE != "full":
            print("  [SKIP] %s" % it["fileName"])
            report.append((it["fileName"], rel, "skip",
                           len(open(fp_final, encoding="utf-8").read())))
            continue
        os.makedirs(d, exist_ok=True)
        body, kind = get_content(it["prefix"], it["fileName"])
        if body is None:
            print("  [FAIL] %s (%s)" % (it["fileName"], kind))
            report.append((it["fileName"], rel, "FAIL", 0))
            continue
        with open(fp_final, "w", encoding="utf-8") as f:
            f.write(body.rstrip() + "\n")
        print("  [%s] %s/%s (%d字)" % (kind, rel, it["fileName"], len(body)))
        report.append((it["fileName"], rel, kind, len(body)))
        time.sleep(0.8)
    with open(os.path.join(OUT, "_抓取报告.csv"), "w", encoding="utf-8-sig") as f:
        f.write("文件名,目录,类型,字数\n")
        for r in report:
            f.write("%s,%s,%s,%d\n" % r)
    ok = sum(1 for r in report if r[2] != "FAIL")
    print("完成：成功 %d / 共 %d，输出目录 %s" % (ok, len(report), OUT))
    postprocess()


if __name__ == "__main__":
    main()
