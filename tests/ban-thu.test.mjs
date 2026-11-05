// Bản thu (D6-0; tools/audio/README.md): kiểm thử Python của tools/audio và check_audio.py --static (NGUON.txt, mọi
// ban_thu trong src/data/tac-pham.yml, mọi mốc ::khoi-nghe{moc} trong trang), như nhóm nhanh của npm test ở site cũ.
// Không cần mạng hay ffmpeg. Máy không có Python 3 hay PyYAML thì bỏ qua; trên CI (biến CI) thì hỏng, để không lặng lẽ
// bỏ qua (.github/actions/kiem-thu cài Python và requirements.txt).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PY = process.env.PYTHON || 'python3';
const chay = (...ts) => spawnSync(PY, ts, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });

function coPython(t) {
	const r = chay('-c', 'import sys, yaml; assert sys.version_info >= (3, 10)');
	if (r.status === 0) return true;
	const ly_do = `cần ${PY} (từ 3.10) và PyYAML: python3 -m pip install -r requirements.txt`;
	if (process.env.CI) assert.fail(ly_do);
	t.skip(ly_do);
	return false;
}

test('tools/audio: kiểm thử Python (attach.py, check_audio.py, page.py trên repo giả và dữ liệu thật)', (t) => {
	if (!coPython(t)) return;
	const r = chay('-m', 'unittest', 'discover', '-s', 'tools/audio/tests');
	assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('check_audio.py --static: NGUON.txt, bản thu trong tac-pham.yml và mốc trong trang không lỗi', (t) => {
	if (!coPython(t)) return;
	const r = chay('tools/audio/check_audio.py', '--static');
	assert.equal(r.status, 0, r.stdout + r.stderr);
	assert.match(r.stdout, /, 0 lỗi/);
});

test('mọi file mp3 mà ban_thu dùng có trong public/audio/ (không cần Python)', async () => {
	const { parse } = await import('yaml');
	const recs = parse(fs.readFileSync(path.join(ROOT, 'src/data/tac-pham.yml'), 'utf8'));
	const dung = recs.flatMap((r) => (r.ban_thu ?? []).flatMap((b) => b.parts.map((p) => p.mp3).filter((m) => m && !/^https?:/.test(m))));
	assert.ok(dung.length >= 13);
	for (const m of dung) {
		assert.match(m, /^audio\/[a-z0-9-]+\.mp3$/, m);
		assert.ok(fs.existsSync(path.join(ROOT, 'public', m)), `${m}: không có public/${m}`);
	}
});

test('kiem-link.yml: job ban-thu đối chiếu bản thu với Commons hằng tuần, giữ một issue nhãn ban-thu; CI cài Python cho npm test', async () => {
	const { parse } = await import('yaml');
	const chu = fs.readFileSync(path.join(ROOT, '.github/workflows/kiem-link.yml'), 'utf8');
	const wf = parse(chu);
	assert.deepEqual(Object.keys(wf.jobs), ['kiem-link', 'ban-thu']);
	assert.deepEqual(wf.permissions, { contents: 'read', issues: 'write' });
	const buoc = wf.jobs['ban-thu'].steps.map((s) => s.run ?? s.uses ?? '').join('\n');
	assert.match(buoc, /pip install -r requirements\.txt/);
	assert.match(buoc, /python3 tools\/audio\/check_audio\.py --static --network/);
	assert.match(buoc, /--label ban-thu --state open/);
	assert.match(buoc, /gh issue close/);
	assert.ok(wf.jobs['ban-thu'].steps.some((s) => s.with?.labels === 'ban-thu'));
	const action = parse(fs.readFileSync(path.join(ROOT, '.github/actions/kiem-thu/action.yml'), 'utf8'));
	const i = action.runs.steps.findIndex((s) => s.run === 'npm test');
	const truoc = action.runs.steps.slice(0, i);
	assert.ok(truoc.some((s) => s.uses?.startsWith('actions/setup-python@') && s.if === "inputs.phan == 'npm-test'"));
	assert.ok(truoc.some((s) => /pip install -r requirements\.txt/.test(s.run ?? '')));
});
