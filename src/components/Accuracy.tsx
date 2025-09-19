import type { Vocab } from "../services/vocabularyService";

interface AccuracyProps {
  vocab: Vocab;
}

export default function Accuracy({ vocab }: AccuracyProps) {
  const total = vocab.totalAnswers ?? 0;
  const correct = vocab.correctAnswers ?? 0;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  let color = "badge-warning";
  if (percentage > 80) color = "badge-success";
  else if (percentage < 50) color = "badge-error";

  return (
    <div className={`badge ${color} whitespace-nowrap badge-soft`}>
      {correct}/{total} ({percentage}%)
    </div>
  );
}
