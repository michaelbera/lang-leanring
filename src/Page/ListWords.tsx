import { useVocabStore, type Vocab } from "../services/vocabularyService";

export default function ListWords() {
  const { vocabList, removeVocab, toggleVocab } = useVocabStore();

  const getAccuracyDisplay = (vocab: Vocab) => {
    const totalAnswers = vocab.totalAnswers ?? 0;
    const correctAnswers = vocab.correctAnswers ?? 0;

    if (totalAnswers === 0) {
      return "0/0 (0%)";
    }

    const percentage = Math.round((correctAnswers / totalAnswers) * 100);
    return `${correctAnswers}/${totalAnswers} (${percentage}%)`;
  };

  if (!vocabList.length) {
    return (
      <div className="mt-6 rounded-box border border-base-300 bg-base-100 p-8 text-center text-base-content/70">
        Chưa có từ nào — hãy bấm <b>+ Create Word</b> để thêm.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="table table-zebra rounded-box border border-base-300 bg-base-100">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>Word</th>
            <th>Phonetic</th>
            <th>Meaning</th>
            <th className="w-28 text-center">Accuracy</th>
            <th className="w-20 text-center">Enabled</th>
            <th className="w-24 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {vocabList.map((v, i) => (
            <tr key={v.word}>
              <td>{i + 1}</td>
              <td className="font-semibold">{v.word}</td>
              <td className="opacity-70">{v.phonetic}</td>
              <td className="max-w-xl truncate">{v.meaning}</td>
              <td className="text-center text-sm">
                <span className="badge badge-primary badge-soft whitespace-nowrap">
                  {getAccuracyDisplay(v)}
                </span>
              </td>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={v.enabled ?? true}
                  onChange={() => toggleVocab(v.word)}
                />
              </td>
              <td className="text-right">
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => removeVocab(v.word)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
