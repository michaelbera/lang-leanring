export interface VocabularyWord {
  id: string;
  word: string; // mặt chữ
  pronunciation: string; // phiên âm
  vietnameseMeaning: string; // nghĩa tiếng việt
  studyCount: number; // số lần học
  correctAnswers: number; // số lần trả lời đúng
  totalAttempts: number; // tổng số lần thử
  createdAt: Date;
  updatedAt: Date;
}

export interface NewVocabularyWord {
  word: string;
  pronunciation: string;
  vietnameseMeaning: string;
}

export interface VocabularyStats {
  totalWords: number;
  totalStudied: number;
  averageAccuracy: number;
}