import { LucideIcon } from 'lucide-react';
import './MetricsCard.css';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export const MetricsCard = ({ title, value, change, icon: Icon, trend }: MetricsCardProps) => {
  return (
    <div className="metrics-card">
      <div className="metrics-card-header">
        <div className="metrics-icon">
          <Icon size={20} />
        </div>
        <h3 className="metrics-title">{title}</h3>
      </div>
      <div className="metrics-value">{value}</div>
      {change !== undefined && (
        <div className={`metrics-change ${trend === 'up' ? 'positive' : 'negative'}`}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}%</span>
          <span className="metrics-period">vs last week</span>
        </div>
      )}
    </div>
  );
};
