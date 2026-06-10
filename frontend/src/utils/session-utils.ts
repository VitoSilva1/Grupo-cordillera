import type { UserProfile } from '../types/user';

const SESSION_USER_KEY = 'grupo-cordillera-user';

export const getSessionUser = (): UserProfile | null => {
  const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UserProfile;
  } catch {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
};

export const saveSessionUser = (user: UserProfile) => {
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
};

export const clearSessionUser = () => {
  sessionStorage.removeItem(SESSION_USER_KEY);
};
