# -*- coding: utf-8 -*-
"""抓取 hxsay.com 专项练习题库（仅选择题）-> 本地 JSON + 图片

用法: HXSAY_TOKEN=xxx python crawl_questions.py
输出: 题库/questions.json、题库/images/、题库/meta.json
"""
import json, os, re, ssl, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.hxsay.com"
TOKEN = os.environ.get("HXSAY_TOKEN", "").strip()
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
OUT = "题库"
IMG = os.path.join(OUT, "images")
CTX = ssl.create_default_context()

TYPE_NAME = {1: "单选", 2: "多选", 3: "判断", 6: "材料单选", 5: "翻译", 7: "写作"}
CHOICE_TYPES = (1, 2, 3, 6)

# 分组 -> 题库ID（来自 /api/edu/exam-portal/app/special-portal）
GROUPS = {
    "行测": [263, 264, 265, 266, 297],
    "企业文化": list(range(279, 293)),
    "计算机类": [269, 270, 271, 272, 273, 274],
    "公共基础知识": [298],
}


def headers():
    h = {"User-Agent": UA, "Referer": BASE + "/exam-practice",
         "X-Station-Device-Id": "6f1c2b3e-4d5a-4b6c-8d7e-9f0a1b2c3d4e",
         "Accept-Encoding": "identity"}
    if TOKEN:
        h["Authorization"] = TOKEN
        h["Sa-Token"] = TOKEN
    return h


def get_json(path, **params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers=headers())
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < 4:
                time.sleep(5 + 5 * i)
                continue
            if i == 4:
                raise
        except Exception:
            if i == 4:
                raise
            time.sleep(2)
    return None


def bank_name_map():
    """从门户接口拿 题库ID -> (分组, 试卷名)"""
    d = get_json("/api/edu/exam-portal/app/special-portal")
    m = {}
    for sec in (d.get("data") or {}).get("catalogSections") or []:
        for card in sec.get("cards") or []:
            for p in card.get("papers") or []:
                g = re.search(r"题库ID=(\d+)", p.get("description") or "")
                if g:
                    m[int(g.group(1))] = (card["title"], p["paperName"])
    return m


def fetch_bank(bid):
    recs, pn = [], 1
    while True:
        d = get_json("/api/recruitQuestion/listByQuestionBankId",
                     questionBankId=bid, pageNum=pn, pageSize=500)["data"]
        recs += d["records"]
        if pn >= d["pages"]:
            break
        pn += 1
        time.sleep(0.15)
    return recs


def norm(r, group, paper):
    imgs = []
    if r.get("imageUrl"):
        try:
            imgs = json.loads(r["imageUrl"])
        except Exception:
            imgs = []
    opts = {}
    for k in "ABCDE":
        v = r.get("option" + k)
        if v:
            opts[k] = v.strip()
    # 站点自带 dedupeKey 不可靠（图形推理 226 题只有 2 个值），
    # 用「题干+答案+选项+图片」自建指纹；图片是图形推理题的唯一区分点
    key = "|".join([
        (r.get("content") or ""), r.get("answer") or "",
        json.dumps(opts, ensure_ascii=False, sort_keys=True), json.dumps(imgs)])
    return {
        "dedupeKey": key,
        "id": r["id"],
        "group": group,
        "paper": paper,
        "bankId": r.get("paperId"),
        "type": r.get("questionType"),
        "typeName": TYPE_NAME.get(r.get("questionType"), str(r.get("questionType"))),
        "subject": r.get("subject"),
        "category": r.get("category"),
        "content": (r.get("content") or "").strip(),
        "options": opts,
        "answer": (r.get("answer") or "").strip(),
        "analysis": (r.get("analysis") or "").strip(),
        "images": imgs,
    }


def download(url_path):
    fn = url_path.split("object=")[-1].replace("%2F", "_").replace("/", "_")
    dst = os.path.join(IMG, fn)
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return fn
    url = url_path if url_path.startswith("http") else BASE + url_path
    for _ in range(3):
        try:
            req = urllib.request.Request(url, headers=headers())
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                b = r.read()
            if len(b) > 1000:
                open(dst, "wb").write(b)
                return fn
        except Exception:
            time.sleep(2)
    return None


def main():
    os.makedirs(IMG, exist_ok=True)
    names = bank_name_map()
    allq, meta = [], []
    for group, bids in GROUPS.items():
        for b in bids:
            recs = fetch_bank(b)
            paper = names.get(b, (group, ""))[1]
            keep = [norm(r, group, paper) for r in recs if r.get("questionType") in CHOICE_TYPES]
            allq += keep
            meta.append({"bankId": b, "group": group, "paper": paper,
                         "total": len(recs), "kept": len(keep)})
            print("  %-6s %-28s 原始 %d -> 选择题 %d" % (group, paper, len(recs), len(keep)))

    # 去重（同一题可能在多个卷里）
    seen, uniq = set(), []
    for q in allq:
        if q["dedupeKey"] in seen:
            continue
        seen.add(q["dedupeKey"])
        uniq.append(q)
    print("去重后 %d 题（原 %d）" % (len(uniq), len(allq)))

    # 图片
    jobs = sorted({i for q in uniq for i in q["images"]})
    print("待下载图片 %d" % len(jobs))
    okmap = {}
    if jobs:
        with ThreadPoolExecutor(max_workers=8) as ex:
            res = list(ex.map(download, jobs))
        okmap = {u: f for u, f in zip(jobs, res) if f}
    for q in uniq:
        q["images"] = [("images/" + okmap[i]) for i in q["images"] if i in okmap]

    for i, q in enumerate(uniq, 1):
        q["qid"] = i

    json.dump(uniq, open(os.path.join(OUT, "questions.json"), "w", encoding="utf-8"),
              ensure_ascii=False)
    json.dump({"groups": GROUPS, "banks": meta, "count": len(uniq),
               "crawledAt": time.strftime("%Y-%m-%d %H:%M:%S")},
              open(os.path.join(OUT, "meta.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("完成：%d 题 -> %s" % (len(uniq), os.path.join(OUT, "questions.json")))


if __name__ == "__main__":
    main()
