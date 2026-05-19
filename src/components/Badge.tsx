import React from 'react';
import { ConditionTag, ReportStatus } from '../types';
interface StatusBadgeProps {
  status: ReportStatus;
}
export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    open: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      border: 'border-amber-200'
    },
    'in-progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-200'
    },
    resolved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200'
    }
  };
  const labels = {
    open: 'Open',
    'in-progress': 'In Progress',
    resolved: 'Resolved'
  };
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {labels[status]}
    </span>);

}
interface ConditionBadgeProps {
  condition: ConditionTag;
}
export function ConditionBadge({ condition }: ConditionBadgeProps) {
  const styles = {
    aggressive: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
      border: 'border-red-200'
    },
    injured: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      dot: 'bg-orange-500',
      border: 'border-orange-200'
    },
    roaming: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200'
    },
    needs_rescue: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
      border: 'border-purple-200'
    }
  };
  const labels = {
    aggressive: 'Aggressive',
    injured: 'Injured',
    roaming: 'Roaming',
    needs_rescue: 'Needs Rescue'
  };
  const style = styles[condition];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {labels[condition]}
    </span>);

}