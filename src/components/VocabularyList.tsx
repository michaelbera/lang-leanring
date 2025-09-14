import { useState, useEffect } from 'react';
import type { VocabularyWord } from '../types/vocabulary';
import { VocabularyService } from '../services/vocabularyService';

interface VocabularyListProps {
  onRefresh?: () => void;
}

export default function VocabularyList({ onRefresh }: VocabularyListProps) {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      const vocabularyWords = await VocabularyService.getAllWords();
      setWords(vocabularyWords);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa từ này không?')) {
      try {
        await VocabularyService.deleteWord(id);
        await loadWords();
        onRefresh?.();
      } catch (error) {
        console.error('Error deleting word:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">Chưa có từ vựng nào</h3>
        <p className="text-base-content/70">Hãy thêm từ vựng đầu tiên của bạn!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Danh sách từ vựng ({words.length} từ)</h2>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Từ</th>
              <th>Phiên âm</th>
              <th>Nghĩa tiếng Việt</th>
              <th>Số lần học</th>
              <th>Tỉ lệ đúng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word) => (
              <tr key={word.id}>
                <td className="font-medium">{word.word}</td>
                <td className="text-primary font-mono">{word.pronunciation}</td>
                <td>{word.vietnameseMeaning}</td>
                <td>
                  <div className="badge badge-outline">
                    {word.studyCount}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      VocabularyService.calculateAccuracy(word) >= 80 
                        ? 'badge-success' 
                        : VocabularyService.calculateAccuracy(word) >= 60 
                        ? 'badge-warning' 
                        : 'badge-error'
                    }`}>
                      {word.totalAttempts > 0 
                        ? `${VocabularyService.calculateAccuracy(word).toFixed(1)}%`
                        : 'N/A'
                      }
                    </span>
                    <span className="text-xs text-base-content/60">
                      ({word.correctAnswers}/{word.totalAttempts})
                    </span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(word.id)}
                    className="btn btn-error btn-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}