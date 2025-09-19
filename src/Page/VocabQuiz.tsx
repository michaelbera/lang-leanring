import { useEffect, useMemo, useRef, useState } from "react";
import { useVocabStore, type Vocab } from "../services/vocabularyService";
import Accuracy from "../components/Accuracy";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const stripDiacritics = (s: string) =>
  (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const baseNorm = (s: string) =>
  stripDiacritics(s)
    .toLowerCase()
    // Giữ CJK (chữ Hán), loại bỏ ký tự khác
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");

// Chuẩn hoá pinyin (hỗ trợ ü -> u/v)
const normPinyin = (s: string) => {
  const noTone = stripDiacritics(s ?? "").toLowerCase();
  const a = noTone.replace(/[^a-z0-9]+/g, ""); // ü đã mất dấu -> u
  const b = noTone.replace(/[üǖǘǚǜ]/g, "v").replace(/[^a-z0-9]+/g, "");
  return [a, b];
};

const norm = (s: string) => baseNorm(s);

const getLowestAccuracyWords = (
  vocabList: Vocab[],
  count: number = 20
): Vocab[] => {
  const enabledWords = (vocabList ?? []).filter((w) => w.enabled ?? true);

  const wordsWithAccuracy = enabledWords.map((word) => {
    const totalAnswers = word.totalAnswers ?? 0;
    const correctAnswers = word.correctAnswers ?? 0;
    const accuracy = totalAnswers === 0 ? 0 : correctAnswers / totalAnswers;
    return { word, accuracy };
  });

  wordsWithAccuracy.sort((a, b) => a.accuracy - b.accuracy);
  const selectedWords = wordsWithAccuracy.slice(0, count).map((i) => i.word);
  return shuffle(selectedWords);
};

const MAX_QUESTIONS = 20;

// Interface to track quiz history
interface QuizHistoryItem {
  vocab: Vocab;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswers: string[];
}

export default function VocabQuiz() {
  const { vocabList, updateVocabStats } = useVocabStore();

  const [list, setList] = useState<Vocab[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<"idle" | "right" | "wrong">("idle");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);

  const total = Math.min(list.length, MAX_QUESTIONS);
  const current = list[idx];

  // refs để tránh reset quiz khi stats thay đổi và để dọn timeout
  const initializedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const totalRef = useRef<number>(total);

  // cập nhật totalRef khi total thay đổi
  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  // Khởi tạo danh sách 1 lần (không reset mỗi khi stats cập nhật)
  useEffect(() => {
    if (initializedRef.current) return;
    const selected = getLowestAccuracyWords(vocabList, MAX_QUESTIONS);
    setList(selected);
    initializedRef.current = true;
  }, [vocabList]);

  // Dọn timeout khi unmount / trước khi đặt timeout mới
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const progressText = useMemo(() => {
    if (!total) return `0 / ${MAX_QUESTIONS}`;
    // hiển thị dựa trên tổng câu thực tế (<=20)
    return `${Math.min(idx + 1, total)} / ${total}`;
  }, [idx, total]);

  const scorePercentage = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((correctCount / total) * 100);
  }, [correctCount, total]);

  const getScoreColor = (percentage: number) => {
    if (percentage > 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-error";
  };

  const goNext = () => {
    // clear timeout cũ nếu có
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setIdx((prev) => {
        const next = prev + 1;
        if (next < totalRef.current) {
          setAnswer("");
          setRevealed(false);
          setResult("idle");
          // focus lại input
          requestAnimationFrame(() => inputRef.current?.focus());
          return next;
        } else {
          setQuizCompleted(true);
          return prev;
        }
      });
    }, 3000) as unknown as number;
  };

  const check = () => {
    if (!current) return;
    const ans = norm(answer);

    // Xây tập candidates an toàn
    const candidates: string[] = [];
    if (current.word) candidates.push(norm(current.word)); // giữ Hán tự
    if (current.meaning) candidates.push(norm(current.meaning)); // TV

    if (current.phonetic) {
      const p = normPinyin(current.phonetic); // pinyin (a/u/v)
      candidates.push(...p);
    }

    const good = ans.length > 0 && candidates.includes(ans);

    // Record quiz history
    const correctAnswers: string[] = [];
    if (current.word) correctAnswers.push(current.word);
    if (current.meaning) correctAnswers.push(current.meaning);
    if (current.phonetic) correctAnswers.push(current.phonetic);

    setQuizHistory((prev) => [
      ...prev,
      {
        vocab: current,
        userAnswer: answer,
        isCorrect: good,
        correctAnswers,
      },
    ]);

    // cập nhật thống kê
    try {
      updateVocabStats(current.word, good);
    } catch {
      // nuốt lỗi để quiz không văng, tuỳ bạn log lại
    }

    setResult(good ? "right" : "wrong");
    if (good) setCorrectCount((prev) => prev + 1);

    goNext();
  };

  const next = () => {
    if (current) {
      // Record as skipped (wrong)
      const correctAnswers: string[] = [];
      if (current.word) correctAnswers.push(current.word);
      if (current.meaning) correctAnswers.push(current.meaning);
      if (current.phonetic) correctAnswers.push(current.phonetic);

      setQuizHistory((prev) => [
        ...prev,
        {
          vocab: current,
          userAnswer: answer || "(bỏ qua)",
          isCorrect: false,
          correctAnswers,
        },
      ]);

      try {
        updateVocabStats(current.word, false);
      } catch {
        //
      }
    }

    if (idx + 1 < total) {
      setIdx(idx + 1);
      setAnswer("");
      setRevealed(false);
      setResult("idle");
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const selected = getLowestAccuracyWords(vocabList, MAX_QUESTIONS);
    setList(selected);
    setIdx(0);
    setAnswer("");
    setRevealed(false);
    setResult("idle");
    setQuizCompleted(false);
    setCorrectCount(0);
    setQuizHistory([]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (!total) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="rounded-box border border-base-300 bg-base-100 p-10 text-center">
          Chưa có từ vựng được bật để kiểm tra. Hãy thêm từ trong mục{" "}
          <b>Vocabulary</b> và bật chúng trước nhé.
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const wrongAnswers = quizHistory.filter((item) => !item.isCorrect);

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body text-center">
            <h2 className="card-title text-3xl justify-center mb-4">
              🎉 Hoàn thành Quiz!
            </h2>

            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Điểm số</div>
                <div className="stat-value">
                  <span className={`${getScoreColor(scorePercentage)}`}>
                    {correctCount}
                  </span>{" "}
                  / {total}
                </div>
                <div className="stat-desc">
                  {" "}
                  <div className={`${getScoreColor(scorePercentage)}`}>
                    (Tỷ lệ đúng: {scorePercentage}%)
                  </div>
                </div>
              </div>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-error">
                  📋 Từ trả lời sai ({wrongAnswers.length})
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {wrongAnswers.map((item, index) => (
                      <div
                        key={index}
                        className="card bg-base-200 border border-base-300 text-left"
                      >
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-lg mb-1">
                                {item.vocab.word}
                              </div>
                              {item.vocab.phonetic && (
                                <div className="text-sm opacity-70 mb-2">
                                  [{item.vocab.phonetic}]
                                </div>
                              )}
                              <div className="text-sm">
                                <span className="text-error font-medium">
                                  Bạn trả lời:
                                </span>{" "}
                                <span className="italic">
                                  {item.userAnswer || "(không trả lời)"}
                                </span>
                              </div>
                              <div className="text-sm mt-1">
                                <span className="text-success font-medium">
                                  Đáp án đúng:
                                </span>{" "}
                                <span className="font-medium">
                                  {item.correctAnswers.join(", ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary" onClick={restartQuiz}>
                Làm lại Quiz
              </button>
              <button
                className="btn btn-outline"
                onClick={() => window.history.back()}
              >
                Về trang chủ
              </button>
            </div>
          </div>
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

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body gap-4">
          <div>
            <div className="text-sm  flex justify-between ">
              Câu hỏi
              <Accuracy vocab={current} />
            </div>
            <div className="text-2xl font-semibold ">{current.word}</div>
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
              onKeyDown={(e) =>
                e.key === "Enter" && result === "idle" && check()
              }
              autoFocus
            />
            <label className="fieldset-label-alt">
              So sánh theo lowercase + bỏ khoảng trắng.
            </label>
          </fieldset>

          {result === "right" && (
            <div className="alert alert-success">
              <span>Chính xác! Chuyển câu sau 1.5 giây...</span>
            </div>
          )}
          {result === "wrong" && (
            <div className="alert alert-error">
              <span>Chưa đúng! Chuyển câu sau 1.5 giây...</span>
            </div>
          )}

          <div className="flex items-center gap-2 justify-between">
            <button className="btn btn-error" onClick={next}>
              Bỏ qua
            </button>
            <button className="btn" onClick={() => setRevealed((v) => !v)}>
              {revealed ? "Ẩn" : "Đáp án"}
            </button>
            <div>
              <button
                className="btn btn-primary ml-2"
                onClick={check}
                disabled={result !== "idle"}
              >
                Kiểm tra
              </button>
            </div>
          </div>

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
