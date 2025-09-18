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

// Chuẩn hoá: lowercase + bỏ khoảng trắng (yêu cầu của bạn)
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export default function VocabQuiz() {
  const { vocabList } = useVocabStore();
  const [list, setList] = useState<Vocab[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<"idle" | "right" | "wrong">("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  // Xáo trộn khi mount hoặc khi vocabList thay đổi
  useEffect(() => {
    setList(shuffle(vocabList));
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
    const a = norm(answer);
    const good =
      a.length > 0 && (a === norm(current.word) || a === norm(current.meaning));

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
          Chưa có dữ liệu. Hãy thêm từ trong mục <b>Vocabulary</b> trước nhé.
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
              {revealed ? "Ẩn đáp án" : "Hiện đáp án"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={next}
              disabled={idx + 1 >= total}
            >
              Bỏ qua / Câu tiếp
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
