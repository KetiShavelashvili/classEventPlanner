// Event type definitions
export const EVENT_TYPES = {
  LECTURE: 'lecture',
  EXAM: 'exam',
  MEETING: 'meeting',
  DEADLINE: 'deadline',
  WRITTEN_QUIZ: 'written_quiz',
  VERBAL_QUIZ: 'verbal_quiz'
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Priority order for sorting
export const PRIORITY_ORDER = {
  high: 1,
  medium: 2,
  low: 3
};

// Get icon for event type
export const getEventTypeIcon = (type) => {
  const icons = {
    lecture: '📚',
    exam: '📝',
    meeting: '👥',
    deadline: '⏰',
    written_quiz: '✏️',
    verbal_quiz: '🗣️'
  };
  return icons[type] || '📅';
};

// Get priority emoji
export const getPriorityEmoji = (priority) => {
  const emojis = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  return emojis[priority] || '⚪';
};