import { useEffect, useMemo, useRef, useState } from "react";
import { useVocabStore, type Vocab } from "../services/vocabularyService";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const baseNorm = (s: string) =>
  stripDiacritics(s)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, ""); // giữ chữ Hán, bỏ ký tự khác

// Chuẩn hoá pinyin với biến thể ü
const normPinyin = (s: string) => {
  const noTone = stripDiacritics(s).toLowerCase();
  const a = noTone.replace(/[^a-z0-9]+/g, ""); // ü đã bị tách dấu thành 'u'
  const b = noTone.replace(/[üǖǘǚǜ]/g, "v").replace(/[^a-z0-9]+/g, "");
  return [a, b]; // chấp nhận cả "nihao" và trường hợp cần "lv" -> "lv"
};

// Chuẩn hoá: lowercase + bỏ khoảng trắng (yêu cầu của bạn)
const norm = (s: string) => baseNorm(s);

export default function VocabQuiz() {
  const { vocabList } = useVocabStore();
  const [list, setList] = useState<Vocab[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<"idle" | "right" | "wrong">("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  // Xáo trộn khi mount hoặc khi vocabList thay đổi, chỉ lấy từ được bật
  useEffect(() => {
    const enabledWords = vocabList.filter(word => word.enabled ?? true);
    setList(shuffle(enabledWords));
    setIdx(0);
    setAnswer("");
    setRevealed(false);
    setResult("idle");
  }, [vocabList]);

  const total = list.length;
  const current = list[idx];

  const progressText = useMemo(() => {
    if (!total) return "0 / 0";
    return `${idx + 1} / ${total}`;
  }, [idx, total]);

  const check = () => {
    if (!current) return;
    const ans = norm(answer);

    // Tập giá trị đúng có thể nhập: word (chữ Hán), meaning (TV), pinyin (có/không dấu, ü -> u/v)
    const candidates: string[] = [
      norm(current.word), // "你好"
      norm(current.meaning), // "Xin chào" -> "xinchao"
    ];

    if (current.phonetic) {
      const p = normPinyin(current.phonetic); // ví dụ "nǐ hǎo" -> ["nihao", "nihao"] (hoặc biến thể có "v")
      candidates.push(...p);
    }

    const good = ans.length > 0 && candidates.includes(ans);

    setResult(good ? "right" : "wrong");

    if (good) {
      // Next sau 600ms để thấy feedback
      setTimeout(() => {
        setIdx((i) => (i + 1 < total ? i + 1 : i));
        setAnswer("");
        setRevealed(false);
        setResult("idle");
        inputRef.current?.focus();
      }, 600);
    }
  };

  const next = () => {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setAnswer("");
      setRevealed(false);
      setResult("idle");
      inputRef.current?.focus();
    }
  };

  if (!total) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="rounded-box border border-base-300 bg-base-100 p-10 text-center">
          Chưa có từ vựng được bật để kiểm tra. Hãy thêm từ trong mục <b>Vocabulary</b> và bật chúng trước nhé.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quiz</h1>
        <div className="badge badge-lg">{progressText}</div>
      </div>

      {/* Card câu hỏi */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4">
          <div>
            <div className="text-sm opacity-70">Câu hỏi</div>
            <div className="text-2xl font-semibold">{current.word}</div>
          </div>

          <fieldset className="fieldset">
            <label className="fieldset-label">
              Trả lời (word hoặc meaning)
            </label>
            <input
              ref={inputRef}
              className="input input-bordered w-full"
              placeholder="Nhập câu trả lời…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              autoFocus
            />
            <label className="fieldset-label-alt">
              So sánh theo lowercase + bỏ khoảng trắng.
            </label>
          </fieldset>

          {/* Feedback */}
          {result === "right" && (
            <div className="alert alert-success">
              <span>Chính xác! Đang chuyển câu…</span>
            </div>
          )}
          {result === "wrong" && (
            <div className="alert alert-error">
              <span>Chưa đúng, thử lại hoặc bật đáp án.</span>
            </div>
          )}

          {/* Hành động */}
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={check}>
              Kiểm tra
            </button>
            <button className="btn" onClick={() => setRevealed((v) => !v)}>
              {revealed ? "Ẩn" : "Hiện"}
            </button>
            <button
              className="btn btn-error"
              onClick={next}
              disabled={idx + 1 >= total}
            >
              Tiếp
            </button>
          </div>

          {/* Đáp án đầy đủ */}
          {revealed && (
            <div className="mt-2 rounded-box border border-base-300 p-4">
              <div className="font-semibold">{current.word}</div>
              {current.phonetic && (
                <div className="opacity-70">[{current.phonetic}]</div>
              )}
              <div>{current.meaning}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
