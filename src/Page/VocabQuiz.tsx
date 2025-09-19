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

// Lấy 20 từ có tỷ lệ đúng thấp nhất
const getLowestAccuracyWords = (vocabList: Vocab[], count: number = 20): Vocab[] => {
  const enabledWords = vocabList.filter(word => word.enabled ?? true);
  
  // Tính tỷ lệ đúng cho mỗi từ (chưa trả lời lần nào = 0%)
  const wordsWithAccuracy = enabledWords.map(word => {
    const totalAnswers = word.totalAnswers ?? 0;
    const correctAnswers = word.correctAnswers ?? 0;
    const accuracy = totalAnswers === 0 ? 0 : correctAnswers / totalAnswers;
    
    return { word, accuracy };
  });
  
  // Sắp xếp theo tỷ lệ đúng tăng dần (thấp nhất trước)
  wordsWithAccuracy.sort((a, b) => a.accuracy - b.accuracy);
  
  // Lấy tối đa count từ và xáo trộn
  const selectedWords = wordsWithAccuracy.slice(0, count).map(item => item.word);
  return shuffle(selectedWords);
};

export default function VocabQuiz() {
  const { vocabList, updateVocabStats } = useVocabStore();
  const [list, setList] = useState<Vocab[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<"idle" | "right" | "wrong">("idle");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Lấy 20 từ có tỷ lệ đúng thấp nhất khi mount hoặc khi vocabList thay đổi
  useEffect(() => {
    const selectedWords = getLowestAccuracyWords(vocabList, 20);
    setList(selectedWords);
    setIdx(0);
    setAnswer("");
    setRevealed(false);
    setResult("idle");
    setQuizCompleted(false);
    setCorrectCount(0);
  }, [vocabList]);

  const total = Math.min(list.length, 20); // Always show max 20
  const current = list[idx];

  const progressText = useMemo(() => {
    if (!total) return "0 / 20";
    return `${idx + 1} / 20`;
  }, [idx, total]);

  const scorePercentage = useMemo(() => {
    return Math.round((correctCount / 20) * 100); // Always calculate based on 20 questions
  }, [correctCount]);

  const getScoreColor = (percentage: number) => {
    if (percentage > 80) return "text-success";
    if (percentage >= 60) return "text-warning"; 
    return "text-error";
  };

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

    // Update statistics
    updateVocabStats(current.word, good);

    setResult(good ? "right" : "wrong");
    
    if (good) {
      setCorrectCount(prev => prev + 1);
    }

    // Tự động chuyển câu sau 1.5 giây
    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
        setAnswer("");
        setRevealed(false);
        setResult("idle");
        inputRef.current?.focus();
      } else {
        // Hoàn thành quiz
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const next = () => {
    // Update statistics as wrong answer when skipping
    if (current) {
      updateVocabStats(current.word, false);
    }
    
    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
        setAnswer("");
        setRevealed(false);
        setResult("idle");
        inputRef.current?.focus();
      } else {
        // Hoàn thành quiz
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    const selectedWords = getLowestAccuracyWords(vocabList, 20);
    setList(selectedWords);
    setIdx(0);
    setAnswer("");
    setRevealed(false);
    setResult("idle");
    setQuizCompleted(false);
    setCorrectCount(0);
    inputRef.current?.focus();
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

  if (quizCompleted) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body text-center">
            <h2 className="card-title text-3xl justify-center mb-4">🎉 Hoàn thành Quiz!</h2>
            
            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Tổng câu hỏi</div>
                <div className="stat-value">20</div>
              </div>
              <div className="stat">
                <div className="stat-title">Trả lời đúng</div>
                <div className="stat-value text-success">{correctCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Điểm số</div>
                <div className={`stat-value text-4xl ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage}%
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                className="btn btn-primary" 
                onClick={restartQuiz}
              >
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
              <span>Chính xác! Chuyển câu sau 1.5 giây...</span>
            </div>
          )}
          {result === "wrong" && (
            <div className="alert alert-error">
              <span>Chưa đúng! Chuyển câu sau 1.5 giây...</span>
            </div>
          )}

          {/* Hành động */}
          <div className="flex items-center gap-2 justify-between">
            <button
              className="btn btn-error"
              onClick={next}
              disabled={result !== "idle"}
            >
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
