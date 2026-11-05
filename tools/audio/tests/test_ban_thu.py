"""Kiểm thử tools/audio (D6-0): không cần mạng, không cần ffmpeg.

    python3 -m unittest discover -s tools/audio/tests

npm test chạy bộ này (tests/ban-thu.test.mjs). Phần ghi chạy trên một repo giả trong thư mục tạm.
"""
import contextlib
import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import attach  # noqa: E402
import check_audio  # noqa: E402
import commons  # noqa: E402
import licenses  # noqa: E402
import net  # noqa: E402
import page  # noqa: E402
import transcode  # noqa: E402

GOC = HERE.parents[2]

DATA = """# chú thích đầu file giữ nguyên
- slug: bai-a
  loai: bai-hoc
  tac_gia: x
  ten: Bài A
  chang: 2
  grade: Grade 1
  cap: nghe-nhac/bai-a
  chip:
  - Đô trưởng · 4/4
  them_ngay: 2026-11-05
- slug: nghe-b
  loai: nghe
  tac_gia: x
  ten: Nghe B
  ban_thu:
  - by: Người B
    lic: CC0
    licUrl: https://creativecommons.org/publicdomain/zero/1.0/
    page: https://commons.wikimedia.org/wiki/File:B.ogg
    parts:
    - mp3: https://upload.wikimedia.org/wikipedia/commons/transcoded/b/bb/B.ogg/B.ogg.mp3
      src: https://upload.wikimedia.org/wikipedia/commons/b/bb/B.ogg
      d: 100.5
"""

BANG = """
## Theo dõi khi nghe

Dán link một bản thu vào khung phía trên.

| Thời điểm | Sự kiện |
|---|---|
| … | Một |
| … | Hai |
| … | Ba |

## Cấu trúc
"""


def trang(slug, khoi="::khoi-nghe"):
    return "---\ntitle: T\ndescription: D\ntac_pham: %s\n---\n\nMở đầu.\n\n## Nghe trước khi tập\n\n%s\n%s" % (slug, khoi, BANG)


class RepoGia(unittest.TestCase):
    """Repo giả: hai bản ghi, bài A dùng ở hai trang (trang cap không có bản ghi riêng), một file mp3."""

    def setUp(self):
        self.goc = Path(tempfile.mkdtemp(prefix="opus-ban-thu-"))
        for f, chu in {
            "src/data/tac-pham.yml": DATA,
            "src/content/docs/piano/tac-pham/bai-a.md": trang("bai-a"),
            "src/content/docs/nghe-nhac/bai-a.md": trang("bai-a"),
            "src/content/docs/nghe-nhac/nghe-b.md": trang("nghe-b", '::khoi-nghe{moc="3 - 50"}'),
            "public/audio/NGUON.txt": "Đầu file.\n\nbai-a.mp3 — X: Bài A; trình bày: Người A; giấy phép CC BY 4.0 "
                                      "(https://creativecommons.org/licenses/by/4.0/); nguồn: https://imslp.org/wiki/File:PMLP1-a.mp3\n",
            "kiem-dinh/khoa.json": json.dumps({"trang": {}, "ban_ghi": {"tac-pham/bai-a#ten": "sha256:x"}}),
        }.items():
            p = self.goc / f
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(chu, encoding="utf-8")
        (self.goc / "public/audio/bai-a.mp3").write_bytes(b"ID3")
        page.set_root(self.goc)

    def tearDown(self):
        page.set_root(GOC)
        shutil.rmtree(self.goc, ignore_errors=True)

    def chay(self, *args):
        """(mã thoát, stdout, stderr) của attach.py với các tham số."""
        out, err = io.StringIO(), io.StringIO()
        code = 0
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                attach.main(list(args))
            except SystemExit as e:
                code = e.code if isinstance(e.code, int) else 1
                err.write(str(e.code) if not isinstance(e.code, int) else "")
        return code, out.getvalue(), err.getvalue()

    def doc(self, f):
        return (self.goc / f).read_text(encoding="utf-8")

    def kiem(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = check_audio.main(["--static"])
        return code, out.getvalue()


class GhiBanThu(RepoGia):
    PART = '{"mp3":"audio/bai-a.mp3","d":90.2}'

    def ghi_a(self, *them):
        return self.chay("bai-a", "--by", "Người A", "--lic", "CC BY 4.0", "--source", "https://imslp.org/wiki/File:PMLP1-a.mp3",
                         "--part", self.PART, *them)

    def test_ghi_ban_thu_dung_cho_dung_thu_tu(self):
        code, out, err = self.ghi_a()
        self.assertEqual(code, 0, err)
        chu = self.doc("src/data/tac-pham.yml")
        self.assertIn("  chip:\n  - Đô trưởng · 4/4\n  ban_thu:\n  - by: Người A\n    lic: CC BY 4.0\n"
                      "    licUrl: https://creativecommons.org/licenses/by/4.0/\n    page: https://imslp.org/wiki/File:PMLP1-a.mp3\n"
                      "    parts:\n    - mp3: audio/bai-a.mp3\n      d: 90.2\n  them_ngay: 2026-11-05\n", chu)
        self.assertTrue(chu.startswith("# chú thích đầu file giữ nguyên\n"))
        self.assertIn("    - mp3: https://upload.wikimedia.org/", chu, "bản ghi khác giữ nguyên")
        self.assertEqual(self.kiem()[0], 0)

    def test_moc_can_chon_trang_khi_ban_ghi_dung_o_hai_trang(self):
        self.ghi_a()
        code, _, err = self.chay("bai-a", "--ref", "1 20")
        self.assertNotEqual(code, 0)
        self.assertIn("--trang", err)
        code, _, err = self.chay("bai-a", "--ref", "1,20,null", "--trang", "nghe-nhac/bai-a")
        self.assertEqual(code, 0, err)
        self.assertIn('\n::khoi-nghe{moc="1 20"}\n', self.doc("src/content/docs/nghe-nhac/bai-a.md"))
        self.assertIn("\n::khoi-nghe\n", self.doc("src/content/docs/piano/tac-pham/bai-a.md"))
        code, _, err = self.chay("piano/tac-pham/bai-a", "--ref", "- 5.5 7")
        self.assertEqual(code, 0, err)
        self.assertIn('\n::khoi-nghe{moc="- 5.5 7"}\n', self.doc("src/content/docs/piano/tac-pham/bai-a.md"))

    def test_moc_sai_thi_khong_ghi(self):
        self.ghi_a()
        truoc = self.doc("src/content/docs/nghe-nhac/bai-a.md")
        for ref, loi in [("1 2 3 4", "bảng chỉ có 3 dòng"), ("1 91", "sau cuối bản thu"), ("20 10", "nhỏ hơn mốc trước"), ("a", "không phải số giây")]:
            code, _, err = self.chay("nghe-nhac/bai-a", "--ref", ref)
            self.assertNotEqual(code, 0, ref)
            self.assertIn(loi, err, ref)
        self.assertEqual(self.doc("src/content/docs/nghe-nhac/bai-a.md"), truoc)

    def test_thay_ban_thu_bo_moc_cu_tru_keep_ref(self):
        self.ghi_a()
        self.chay("nghe-nhac/bai-a", "--ref", "1 20")
        code, _, err = self.ghi_a("--keep-ref")
        self.assertEqual(code, 0, err)
        self.assertIn('moc="1 20"', self.doc("src/content/docs/nghe-nhac/bai-a.md"))
        code, _, err = self.chay("bai-a", "--by", "Người A", "--lic", "CC BY 4.0", "--source", "https://imslp.org/wiki/File:PMLP1-a.mp3",
                                 "--part", '{"mp3":"audio/bai-a.mp3","d":80}')
        self.assertEqual(code, 0, err)
        self.assertIn("đã bỏ mốc cũ", err)
        self.assertIn("\n::khoi-nghe\n", self.doc("src/content/docs/nghe-nhac/bai-a.md"))
        self.assertIn("      d: 80\n", self.doc("src/data/tac-pham.yml"))

    def test_ban_thu_sai_thi_khong_ghi(self):
        truoc = self.doc("src/data/tac-pham.yml")
        for them, loi in [
            (["--part", '{"mp3":"audio/khong-co.mp3","d":10}'], "không có file public/audio/khong-co.mp3"),
            (["--part", '{"mp3":"../../../assets/audio/bai-a.mp3","d":10}'], "audio/<tên>.mp3"),
            (["--part", '{"mp3":"audio/bai-a.mp3"}'], "thiếu độ dài d"),
            (["--part", '{"mp3":"audio/bai-a.mp3","d":5}', "--part", '{"mp3":"audio/bai-a.mp3","d":5}'], "cần tên phần t"),
        ]:
            code, _, err = self.chay("bai-a", "--by", "A", "--lic", "CC0", "--source", "https://x.org/", *them)
            self.assertNotEqual(code, 0, them)
            self.assertIn(loi, err, them)
        code, _, err = self.chay("bai-a", "--by", "A", "--lic", "CC BY-NC 4.0", "--source", "https://x.org/", "--part", self.PART)
        self.assertIn("NC", err)
        self.assertEqual(self.doc("src/data/tac-pham.yml"), truoc)

    def test_khoa_chan_ghi(self):
        self.ghi_a()
        khoa = {"trang": {"nghe-nhac/bai-a": "sha256:x"}, "ban_ghi": {"tac-pham/bai-a#ten,ban_thu": "sha256:y"}}
        (self.goc / "kiem-dinh/khoa.json").write_text(json.dumps(khoa), encoding="utf-8")
        code, _, err = self.chay("nghe-nhac/bai-a", "--ref", "1 2")
        self.assertNotEqual(code, 0)
        self.assertIn("trang nghe-nhac/bai-a đã khóa", err)
        code, _, err = self.chay("bai-a", "--note", "ghi chú mới")
        self.assertIn("đã khóa trường ban_thu", err)
        self.assertIn("node tools/khoa.mjs mo du-lieu/tac-pham/bai-a", err)
        # khóa từng phần không có ban_thu thì vẫn ghi được
        khoa["ban_ghi"] = {"tac-pham/bai-a#ten": "sha256:y"}
        (self.goc / "kiem-dinh/khoa.json").write_text(json.dumps(khoa), encoding="utf-8")
        code, _, err = self.chay("bai-a", "--note", "ghi chú mới")
        self.assertEqual(code, 0, err)
        self.assertIn("    note: ghi chú mới\n", self.doc("src/data/tac-pham.yml"))

    def test_clear_bo_ban_thu_va_moc(self):
        code, _, err = self.chay("nghe-b", "--clear")
        self.assertEqual(code, 0, err)
        self.assertNotIn("ban_thu", self.doc("src/data/tac-pham.yml"))
        self.assertIn("\n::khoi-nghe\n", self.doc("src/content/docs/nghe-nhac/nghe-b.md"))

    def test_json_cua_commons_kem_ref(self):
        rec = {"by": "C", "note": "", "lic": "CC BY-SA 4.0", "licUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
               "page": "https://commons.wikimedia.org/wiki/File:C.ogg",
               "parts": [{"t": "", "mp3": "https://upload.wikimedia.org/c.mp3", "src": "https://upload.wikimedia.org/c.ogg", "d": 30}],
               "ref": [1, None, 20]}
        f = self.goc / "rec.json"
        f.write_text(json.dumps(rec), encoding="utf-8")
        code, _, err = self.chay("nghe-b", "--json", str(f), "--dry-run")
        self.assertEqual(code, 0, err)
        self.assertIn("ban_thu", self.doc("src/data/tac-pham.yml"))
        self.assertIn("https://upload.wikimedia.org/wikipedia/", self.doc("src/data/tac-pham.yml"), "dry-run không ghi")
        code, _, err = self.chay("nghe-b", "--json", str(f))
        self.assertEqual(code, 0, err)
        self.assertIn('::khoi-nghe{moc="1 - 20"}', self.doc("src/content/docs/nghe-nhac/nghe-b.md"))
        chu = self.doc("src/data/tac-pham.yml")
        self.assertIn("  - by: C\n    lic: CC BY-SA 4.0\n", chu, "note rỗng và t rỗng bị bỏ")
        self.assertNotIn("ref", chu)


class KiemTra(RepoGia):
    def test_repo_gia_khong_loi(self):
        code, out = self.kiem()
        self.assertEqual(code, 0, out)
        self.assertIn("chú ý: bai-a.mp3: không bản ghi nào dùng", out)

    def test_bat_loi(self):
        (self.goc / "public/audio/thua.mp3").write_bytes(b"ID3")
        (self.goc / "src/content/docs/nghe-nhac/nghe-b.md").write_text(trang("nghe-b", '::khoi-nghe{moc="3 - 50 60 101"}'), encoding="utf-8")
        (self.goc / "src/content/docs/nghe-nhac/bai-a.md").write_text(trang("bai-a", '::khoi-nghe{moc="3"}'), encoding="utf-8")
        data = self.doc("src/data/tac-pham.yml").replace("    lic: CC0\n", "    lic: CC BY-NC 4.0\n")
        (self.goc / "src/data/tac-pham.yml").write_text(data, encoding="utf-8")
        code, out = self.kiem()
        self.assertEqual(code, 1)
        for loi in ["thua.mp3: không có dòng trong NGUON.txt", "nghe-nhac/nghe-b: có 5 mốc nhưng bảng chỉ có 3 dòng",
                    "nghe-nhac/nghe-b: mốc 5 (101 giây) nằm sau cuối bản thu", "tac-pham.yml nghe-b ban_thu[1]: licUrl/lic: giấy phép có điều khoản NC",
                    "nghe-nhac/bai-a: trang có mốc nhưng bản ghi không có bản thu"]:
            self.assertIn(loi, out)

    def test_thu_tu_khoa_va_hai_dong_khoi_nghe(self):
        data = self.doc("src/data/tac-pham.yml").replace("    lic: CC0\n    licUrl: https://creativecommons.org/publicdomain/zero/1.0/\n",
                                                         "    licUrl: https://creativecommons.org/publicdomain/zero/1.0/\n    lic: CC0\n")
        (self.goc / "src/data/tac-pham.yml").write_text(data, encoding="utf-8")
        (self.goc / "src/content/docs/nghe-nhac/bai-a.md").write_text(trang("bai-a", "::khoi-nghe\n\n::khoi-nghe"), encoding="utf-8")
        code, out = self.kiem()
        self.assertEqual(code, 1)
        self.assertIn("khóa chưa đúng thứ tự", out)
        self.assertIn("nghe-nhac/bai-a: trang cần đúng một dòng ::khoi-nghe, có 2", out)


class DuLieuThat(unittest.TestCase):
    """Trên dữ liệu thật của repo."""

    def test_ghi_lai_moi_truong_giu_nguyen_tung_ky_tu(self):
        chu = page.DATA.read_text(encoding="utf-8")
        recs = page.records()
        for r in recs:
            # hinh: chỉ bản ghi tách từ site cũ (tools/du_lieu/tach.py, cùng kiểu viết); bản ghi do tools/them-tac-pham.mjs
            # viết có thể khác cách đặt nháy, attach.py chỉ ghi ban_thu nên không sao
            for f in ("ban_thu", "hinh") if "them_ngay" not in r else ("ban_thu",):
                if f in r:
                    self.assertEqual(page.replace_field(chu, r["slug"], f, r[f]), chu, "%s.%s" % (r["slug"], f))
            if "ban_thu" in r:
                self.assertEqual(json.dumps([page.normalize(b) for b in r["ban_thu"]]), json.dumps(r["ban_thu"]), r["slug"])
                bo = page.replace_field(chu, r["slug"], "ban_thu", None)
                self.assertEqual(page.replace_field(bo, r["slug"], "ban_thu", r["ban_thu"]), chu, r["slug"])

    def test_check_audio_static_khong_loi(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = check_audio.main(["--static"])
        self.assertEqual(code, 0, out.getvalue())

    def test_trang_cua_ban_ghi(self):
        recs = page.records()
        self.assertEqual(page.pages_of("beethoven-anh-trang", recs), ["piano/tac-pham/beethoven-anh-trang", "nghe-nhac/beethoven-moonlight"])
        self.assertEqual(page.pages_of("schumann-traumerei", recs), ["piano/tac-pham/schumann-traumerei"], "cap có bản ghi riêng")
        self.assertEqual(page.slug_of_page(page.md_path("nghe-nhac/beethoven-moonlight", must_exist=False), recs), "beethoven-anh-trang")


class HamNho(unittest.TestCase):
    def test_moc(self):
        self.assertEqual(page.parse_moc("2 12 - 41"), [2, 12, None, 41])
        self.assertEqual(page.parse_moc("2,12,null,41.5"), [2, 12, None, 41.5])
        self.assertEqual(page.format_moc([2, 12.0, None, 41.5, None]), "2 12 - 41.5")
        self.assertEqual(page.listen_line([None]), "::khoi-nghe")
        for sai in ("", "-", "1e2", "-3", "0x10"):
            with self.assertRaises(ValueError, msg=sai):
                page.parse_moc(sai)
        self.assertEqual(page.set_moc("a\n::khoi-nghe\nb", [1, 2]), 'a\n::khoi-nghe{moc="1 2"}\nb')

    def test_giay_phep(self):
        self.assertEqual(licenses.parse("Creative Commons Attribution-ShareAlike 4.0"), ("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"))
        self.assertEqual(licenses.parse("Public domain")[0], licenses.PD)
        for sai in ("CC BY-NC 4.0", "CC BY-ND 3.0", "CC BY 1.0", "All rights reserved"):
            self.assertFalse(licenses.accepted(sai), sai)
        self.assertEqual(licenses.check("CC BY 3.0", "https://creativecommons.org/licenses/by/3.0/deed.en"), [])

    def test_commons_khong_mang(self):
        p = {"title": "File:A b.ogg", "imageinfo": [{"url": "https://upload.wikimedia.org/wikipedia/commons/a/ab/A_b.ogg?utm=1",
                                                     "descriptionurl": "https://commons.wikimedia.org/wiki/File:A_b.ogg", "mime": "application/ogg",
                                                     "duration": 61.234, "extmetadata": {"LicenseShortName": {"value": "CC BY-SA 4.0"}}}],
             "videoinfo": [{"derivatives": [{"transcodekey": "mp3", "src": "https://upload.wikimedia.org/x/A_b.ogg.mp3?a"}]}]}
        r = commons.row(p)
        self.assertEqual((r["lic"], r["d"], r["mp3"], r["src"]), ("CC BY-SA 4.0", 61.23, "https://upload.wikimedia.org/x/A_b.ogg.mp3", "https://upload.wikimedia.org/wikipedia/commons/a/ab/A_b.ogg"))
        self.assertEqual(check_audio.commons_title({"src": "https://upload.wikimedia.org/wikipedia/commons/a/ab/A_b%C3%A0.ogg"}), "File:A bà.ogg")
        self.assertEqual(check_audio.commons_title({"mp3": "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ab/A_b.ogg/A_b.ogg.mp3"}), "File:A b.ogg")

    def test_user_agent_khong_co_thong_tin_ca_nhan(self):
        self.assertEqual(net.UA, "opus-kiem-dinh/1.0 (https://mtuann.github.io/opus/)")

    def test_transcode(self):
        self.assertEqual(transcode.imslp_page("IMSLP815839-PMLP1846-a b.mp3"), "https://imslp.org/wiki/File:PMLP1846-a_b.mp3")
        self.assertEqual(transcode.nguon_line("x", "W", "B", "CC0", "https://c/", "https://s"), "x.mp3 — W; trình bày: B; giấy phép CC0 (https://c/); nguồn: https://s")
        self.assertEqual(page.asset_url("x.mp3"), "audio/x.mp3")


if __name__ == "__main__":
    unittest.main()
