import { UserFeedback } from '../types';

const STORAGE_KEY = 'resume_user_feedbacks_list';
const FEEDBACK_CHANGE_EVENT = 'resume_feedback_updated';

export const getStoredFeedbacks = (): UserFeedback[] => {
  try {
    const custom: UserFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(custom) ? custom : [];
  } catch {
    return [];
  }
};

export const saveUserFeedback = (
  newFeedback: Omit<UserFeedback, 'id' | 'createdAt'>
): UserFeedback => {
  const feedbackItem: UserFeedback = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: 'Just now',
    ...newFeedback
  };

  try {
    const existing: UserFeedback[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [feedbackItem, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FEEDBACK_CHANGE_EVENT, { detail: feedbackItem }));
    }
  } catch (e) {
    console.error('Failed to store feedback:', e);
  }

  return feedbackItem;
};

export const onFeedbackUpdate = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(FEEDBACK_CHANGE_EVENT, callback);
  return () => window.removeEventListener(FEEDBACK_CHANGE_EVENT, callback);
};

