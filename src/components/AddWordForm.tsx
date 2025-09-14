import { useState } from 'react';
import type { NewVocabularyWord } from '../types/vocabulary';
import { VocabularyService } from '../services/vocabularyService';

interface AddWordFormProps {
  onWordAdded?: () => void;
}

export default function AddWordForm({ onWordAdded }: AddWordFormProps) {
  const [formData, setFormData] = useState<NewVocabularyWord>({
    word: '',
    pronunciation: '',
    vietnameseMeaning: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.word.trim() || !formData.pronunciation.trim() || !formData.vietnameseMeaning.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await VocabularyService.addWord(formData);
      
      // Reset form
      setFormData({
        word: '',
        pronunciation: '',
        vietnameseMeaning: '',
      });
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Notify parent component
      onWordAdded?.();
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NewVocabularyWord, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Thêm từ vựng mới</h2>
        
        {showSuccess && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Từ vựng đã được thêm thành công!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Từ (mặt chữ)</span>
            </label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => handleInputChange('word', e.target.value)}
              className="input input-bordered w-full"
              placeholder="Nhập từ vựng..."
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Phiên âm</span>
            </label>
            <input
              type="text"
              value={formData.pronunciation}
              onChange={(e) => handleInputChange('pronunciation', e.target.value)}
              className="input input-bordered w-full font-mono"
              placeholder="Ví dụ: /həˈloʊ/"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nghĩa tiếng Việt</span>
            </label>
            <textarea
              value={formData.vietnameseMeaning}
              onChange={(e) => handleInputChange('vietnameseMeaning', e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Nhập nghĩa tiếng Việt..."
              rows={3}
              required
            />
          </div>

          <div className="card-actions justify-end pt-4">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting || !formData.word.trim() || !formData.pronunciation.trim() || !formData.vietnameseMeaning.trim()}
            >
              {isSubmitting ? 'Đang thêm...' : 'Thêm từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}