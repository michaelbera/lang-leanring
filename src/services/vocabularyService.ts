import localforage from 'localforage';
import type { VocabularyWord, NewVocabularyWord, VocabularyStats } from '../types/vocabulary';

const VOCABULARY_KEY = 'vocabulary_words';

// Configure localforage
localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'LanguageLearningApp',
  version: 1.0,
  storeName: 'vocabulary',
});

export class VocabularyService {
  static async getAllWords(): Promise<VocabularyWord[]> {
    try {
      const words = await localforage.getItem<VocabularyWord[]>(VOCABULARY_KEY);
      return words || [];
    } catch (error) {
      console.error('Error getting vocabulary words:', error);
      return [];
    }
  }

  static async addWord(newWord: NewVocabularyWord): Promise<VocabularyWord> {
    try {
      const words = await this.getAllWords();
      const word: VocabularyWord = {
        id: crypto.randomUUID(),
        word: newWord.word,
        pronunciation: newWord.pronunciation,
        vietnameseMeaning: newWord.vietnameseMeaning,
        studyCount: 0,
        correctAnswers: 0,
        totalAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      words.push(word);
      await localforage.setItem(VOCABULARY_KEY, words);
      return word;
    } catch (error) {
      console.error('Error adding vocabulary word:', error);
      throw error;
    }
  }

  static async updateWord(id: string, updates: Partial<VocabularyWord>): Promise<VocabularyWord | null> {
    try {
      const words = await this.getAllWords();
      const wordIndex = words.findIndex(word => word.id === id);
      
      if (wordIndex === -1) {
        return null;
      }

      words[wordIndex] = {
        ...words[wordIndex],
        ...updates,
        updatedAt: new Date(),
      };

      await localforage.setItem(VOCABULARY_KEY, words);
      return words[wordIndex];
    } catch (error) {
      console.error('Error updating vocabulary word:', error);
      throw error;
    }
  }

  static async deleteWord(id: string): Promise<boolean> {
    try {
      const words = await this.getAllWords();
      const filteredWords = words.filter(word => word.id !== id);
      
      if (filteredWords.length === words.length) {
        return false; // Word not found
      }

      await localforage.setItem(VOCABULARY_KEY, filteredWords);
      return true;
    } catch (error) {
      console.error('Error deleting vocabulary word:', error);
      throw error;
    }
  }

  static async getStats(): Promise<VocabularyStats> {
    try {
      const words = await this.getAllWords();
      const totalWords = words.length;
      const totalStudied = words.filter(word => word.studyCount > 0).length;
      
      let totalAccuracy = 0;
      const studiedWords = words.filter(word => word.totalAttempts > 0);
      
      if (studiedWords.length > 0) {
        totalAccuracy = studiedWords.reduce((sum, word) => {
          return sum + (word.correctAnswers / word.totalAttempts);
        }, 0) / studiedWords.length;
      }

      return {
        totalWords,
        totalStudied,
        averageAccuracy: totalAccuracy,
      };
    } catch (error) {
      console.error('Error getting vocabulary stats:', error);
      return {
        totalWords: 0,
        totalStudied: 0,
        averageAccuracy: 0,
      };
    }
  }

  static calculateAccuracy(word: VocabularyWord): number {
    if (word.totalAttempts === 0) return 0;
    return (word.correctAnswers / word.totalAttempts) * 100;
  }
}