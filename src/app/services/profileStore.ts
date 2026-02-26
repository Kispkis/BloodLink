export interface UserProfile {
  fullName: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
}

const keyFor = (uid: string) => `bloodlink_profile_${uid}`;

export const getUserProfile = (uid: string): UserProfile | null => {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

export const setUserProfile = (uid: string, profile: UserProfile) => {
  localStorage.setItem(keyFor(uid), JSON.stringify(profile));
};
