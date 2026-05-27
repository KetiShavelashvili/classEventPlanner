// Event type definitions
export const EVENT_TYPES = {
  LECTURE: 'lecture',
  EXAM: 'exam',
  MEETING: 'meeting',
  DEADLINE: 'deadline'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PRIORITY_ORDER = {
  high: 1,
  medium: 2,
  low: 3
};

export const getEventTypeIcon = (type) => {
  const icons = {
    lecture: '📚',
    exam: '📝',
    meeting: '👥',
    deadline: '⏰'
  };
  return icons[type] || '📅';
};

export const getPriorityEmoji = (priority) => {
  const emojis = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  return emojis[priority] || '⚪';
};