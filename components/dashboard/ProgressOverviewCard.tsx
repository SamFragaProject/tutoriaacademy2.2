import React from 'react';
import type { DashboardInsights } from '../../types';
import { Card } from '../ui';
import { Target } from 'lucide-react';

interface ProgressOverviewCardProps {
    data: DashboardInsights['progressOverview'];
}

const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-border"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-cyan"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                {Math.round(progress)}%
            </div>
        </div>
    );
};

const ProgressOverviewCard: React.FC<ProgressOverviewCardProps> = ({ data }) => {
    return (
        <Card className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
                <ProgressRing progress={data.totalProgress} />
            </div>
            <div className="flex-grow w-full">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
                    <Target size={20} /> Progreso General del Plan
                </h3>
                <div className="space-y-3">
                    {data.subjects.map(subject => (
                        <div key={subject.name}>
                            <div className="flex justify-between text-sm font-medium mb-1">
                                <span className="text-text-primary">{subject.name}</span>
                                <span className="text-text-secondary">{Math.round(subject.progress)}%</span>
                            </div>
                            <div className="w-full bg-bg/50 rounded-full h-2.5 border border-border">
                                <div className="bg-purple h-2 rounded-full" style={{ width: `${subject.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ProgressOverviewCard;