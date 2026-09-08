# -*- coding: utf-8 -*-
"""把 hxsay 正文里残留的 HTML 表格转成 Markdown。
- 多行/多列真表格 -> Markdown 表格
- 单单元格块（题库、提示框）-> 拆成普通段落
用法: python fix_tables.py <目录>
"""
import glob, html, os, re, sys

TABLE = re.compile(r"<table.*?</table>", re.S)
TR = re.compile(r"<tr[^>]*>(.*?)</tr>", re.S)
CELL = re.compile(r"<t([dh])[^>]*>(.*?)</t\1>", re.S)
P = re.compile(r"<p[^>]*>(.*?)</p>", re.S)
TAG = re.compile(r"<[^>]+>")
BR = re.compile(r"<br\s*/?>", re.I)


def cell_text(h):
    """单元格文本；内部多段用 <br> 连接"""
    ps = [html.unescape(TAG.sub("", x)).strip() for x in P.findall(h)]
    ps = [p for p in ps if p]
    if ps:
        return "<br>".join(ps).replace("|", "\\|")
    s = html.unescape(TAG.sub("", h))
    s = BR.sub("<br>", s).strip()
    return s.replace("|", "\\|")


def convert(m):
    block = m.group(0)
    rows = []
    for tr in TR.findall(block):
        cells = [cell_text(c) for _, c in CELL.findall(tr)]
        if cells:
            rows.append(cells)
    if not rows:
        return ""
    ncol = max(len(r) for r in rows)
    # 单格块：直接摊平成段落
    if ncol == 1 and len(rows) == 1:
        ps = [html.unescape(TAG.sub("", x)).strip() for x in P.findall(block)]
        ps = [p for p in ps if p]
        if not ps:
            ps = [html.unescape(TAG.sub("", block)).strip()]
        return "\n\n" + "\n\n".join(ps) + "\n"
    # 真表格
    for r in rows:
        while len(r) < ncol:
            r.append("")
    head = rows[0]
    out = ["| " + " | ".join(head) + " |",
           "| " + " | ".join(["---"] * ncol) + " |"]
    for r in rows[1:]:
        out.append("| " + " | ".join(r) + " |")
    return "\n\n" + "\n".join(out) + "\n"


def main():
    root = sys.argv[1]
    files = [p for p in glob.glob(os.path.join(root, "**", "*.md"), recursive=True)
             if not os.path.basename(p).startswith("00-")]
    n = 0
    for p in files:
        t = open(p, encoding="utf-8").read()
        t2 = TABLE.sub(convert, t)
        t2 = BR.sub("\n", t2)
        t2 = html.unescape(t2)          # 收掉 &gt; &amp; 之类
        t2 = re.sub(r"\n{3,}", "\n\n", t2)
        if t2 != t:
            open(p, "w", encoding="utf-8").write(t2)
            n += 1
    print("已转换 %d 个文件" % n)


if __name__ == "__main__":
    main()
