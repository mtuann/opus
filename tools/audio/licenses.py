"""Giấy phép bản thu được nhận trên site: nơi duy nhất trong code giữ danh sách này.

Nhận: phạm vi công cộng (kể cả Public Domain Mark), CC0, CC BY và CC BY-SA từ 2.0 đến 4.0 (kể cả bản theo
quốc gia, ví dụ CC BY-SA 3.0 DE). Không nhận: NC, ND, GFDL đơn thuần, "all rights reserved", hay bất cứ thứ gì
không đọc ra được.

    from licenses import parse, check
    parse("Creative Commons Attribution-ShareAlike 4.0")  # ("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/")
    parse("CC BY-NC 4.0")                                   # ValueError
    check("CC BY 3.0", "https://creativecommons.org/licenses/by/3.0")  # [] (không lỗi)

Chạy trực tiếp để thử một tên giấy phép:  python3 tools/audio/licenses.py "CC BY-SA 3.0 de"
"""
import re
import sys

PD = "phạm vi công cộng"            # tên ghi trên trang cho bản thu thuộc phạm vi công cộng (kể cả PDM)
TYPES = ("by", "by-sa")             # CC BY, CC BY-SA
VERSIONS = ("2.0", "2.5", "3.0", "4.0")
CC0_URL = "https://creativecommons.org/publicdomain/zero/1.0/"
PDM_URL = "https://creativecommons.org/publicdomain/mark/1.0/"


def _norm(s):
    s = (s or "").lower().replace("_", " ").replace("–", "-")
    s = re.sub(r"creative\s*commons", "cc", s)
    s = re.sub(r"attribution[\s-]*share[\s-]*alike", "by-sa", s)
    s = re.sub(r"attribution", "by", s)
    s = re.sub(r"non[\s-]*commercial", "nc", s)
    s = re.sub(r"no[\s-]*deriv(ative)?s?", "nd", s)
    s = re.sub(r"\bcc[\s-]+", "cc ", s)
    s = re.sub(r"\bby\s+sa\b", "by-sa", s)
    return re.sub(r"\s+", " ", s).strip()


def parse(name):
    """Tên giấy phép (Commons, IMSLP, tên ghi trên trang) -> (tên ghi trên trang, link giấy phép).

    Link là "" với phạm vi công cộng. Giấy phép không được nhận thì báo ValueError, kèm lý do."""
    s = _norm(name)
    if not s:
        raise ValueError("không có tên giấy phép")
    if re.search(r"\bnc\b|\bnd\b|by-nc|by-nd|-nc\b|-nd\b", s):
        raise ValueError("giấy phép có điều khoản NC hoặc ND: %s" % name)
    if s == PD or re.match(r"(public domain|pd\b|pdm\b|pd-)", s) or "public domain mark" in s:
        return PD, ""
    if re.match(r"(cc ?0|cc zero|cc-zero)\b", s):
        return "CC0", CC0_URL
    m = re.match(r"cc (by(?:-sa)?)[ -]*(\d(?:\.\d)?)?(?:\s+([a-z]{2}))?\b", s)
    if not m:
        raise ValueError("không nhận ra giấy phép: %s" % name)
    kind, ver, country = m.group(1), m.group(2), m.group(3)
    if not ver:
        raise ValueError("thiếu số phiên bản giấy phép: %s" % name)
    if "." not in ver:
        ver += ".0"
    if ver not in VERSIONS:
        raise ValueError("phiên bản %s không nằm trong 2.0–4.0: %s" % (ver, name))
    label = "CC %s %s" % (kind.upper(), ver) + (" " + country.upper() if country and ver != "4.0" else "")
    url = "https://creativecommons.org/licenses/%s/%s/%s" % (kind, ver, country + "/" if country and ver != "4.0" else "")
    return label, url


def accepted(name):
    try:
        parse(name)
        return True
    except ValueError:
        return False


def check(lic, lic_url):
    """Lỗi của cặp (lic, licUrl) ghi trong data-rec: giấy phép phải được nhận, đúng tên trên trang,
    và licUrl (bắt buộc trừ khi là phạm vi công cộng) phải trỏ đúng loại và phiên bản."""
    try:
        label, url = parse(lic)
    except ValueError as e:
        return [str(e)]
    errs = []
    if lic != label:
        errs.append('tên giấy phép nên ghi "%s" (đang ghi "%s")' % (label, lic))
    if label == PD:
        return errs
    if not lic_url:
        return errs + ["thiếu licUrl"]
    want = re.sub(r"^https?://", "", url).rstrip("/")
    have = re.sub(r"^https?://", "", lic_url).split("?")[0].rstrip("/")
    have = re.sub(r"/(deed|legalcode)(\.[a-z-]+)?$", "", have)
    if have != want:
        errs.append("licUrl %s không khớp giấy phép %s (cần %s)" % (lic_url, label, url))
    return errs


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        sys.exit(__doc__)
    for arg in sys.argv[1:]:
        try:
            print("%s -> %s %s" % (arg, *parse(arg)))
        except ValueError as e:
            print("%s -> KHÔNG NHẬN: %s" % (arg, e))
