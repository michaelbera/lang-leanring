import { useState, useEffect } from 'react';
import type { VocabularyStats } from '../types/vocabulary';
import { VocabularyService } from '../services/vocabularyService';

interface VocabularyStatsProps {
  refreshTrigger?: number;
}

export default function VocabularyStatsComponent({ refreshTrigger }: VocabularyStatsProps) {
  const [stats, setStats] = useState<VocabularyStats>({
    totalWords: 0,
    totalStudied: 0,
    averageAccuracy: 0,
  });
  
  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      const vocabularyStats = await VocabularyService.getStats();
      setStats(vocabularyStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div className="stat-title">Tổng số từ</div>
        <div className="stat-value text-primary">{stats.totalWords}</div>
        <div className="stat-desc">từ vựng trong kho</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div className="stat-title">Đã học</div>
        <div className="stat-value text-secondary">{stats.totalStudied}</div>
        <div className="stat-desc">từ đã được học</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div className="stat-title">Độ chính xác</div>
        <div className="stat-value text-accent">
          {stats.averageAccuracy > 0 ? `${(stats.averageAccuracy * 100).toFixed(1)}%` : 'N/A'}
        </div>
        <div className="stat-desc">tỉ lệ trả lời đúng trung bình</div>
      </div>
    </div>
  );
}