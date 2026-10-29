import { UserProfile, CustomerRole } from '../types';

export const AVATAR_COLOR_OPTIONS = [
  { id: 'teal', label: 'Teal & Cyan', gradient: 'from-teal-500 to-cyan-500', border: 'border-teal-400' },
  { id: 'indigo', label: 'Indigo & Blue', gradient: 'from-indigo-500 to-blue-500', border: 'border-indigo-400' },
  { id: 'purple', label: 'Violet & Purple', gradient: 'from-purple-500 to-pink-500', border: 'border-purple-400' },
  { id: 'emerald', label: 'Emerald & Mint', gradient: 'from-emerald-500 to-teal-400', border: 'border-emerald-400' },
  { id: 'amber', label: 'Amber & Gold', gradient: 'from-amber-500 to-orange-500', border: 'border-amber-400' },
  { id: 'rose', label: 'Rose & Coral', gradient: 'from-rose-500 to-red-500', border: 'border-rose-400' },
];

export const ROLE_DETAILS: Record<CustomerRole, { label: string; icon: string; description: string }> = {
  organizer: {
    label: 'Festival & Event Organizer',
    icon: '🎪',
    description: 'Selling sponsorship tiers, finding non-obvious brands, crafting CMO pitches with verified lift.',
  },
  venue: {
    label: 'Venue & Arena Operator',
    icon: '🏟️',
    description: 'Matching resident cultural programming with long-term commercial partners and category exclusivity.',
  },
  agency: {
    label: 'Brand & Agency Strategist',
    icon: '💼',
    description: 'Auditing cultural audience overlap and preventing ungrounded sponsorship investments.',
  },
  judge: {
    label: 'Qloo Hackathon Judge',
    icon: '⚖️',
    description: 'Evaluating taste graph traversal, 100% grounding rate, and mathematical non-obvious lift.',
  },
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_default_01',
  name: 'Jamie Davenport',
  title: 'Director of Strategic Sponsorships',
  organization: 'Vanguard Live & Festivals',
  email: 'jamie.d@vanguardlive.com',
  role: 'organizer',
  avatarColor: 'teal',
  avatarInitials: 'JD',
  preferences: {
    defaultCurrency: '$',
    targetDealSize: '$50,000 - $150,000',
    discoveryStrategy: 'challenger_heavy',
    pitchTone: 'executive',
    defaultExcludedCategories: ['Tobacco & Vaping', 'Hard Spirits / Distilled Liquor'],
    showConfidenceScores: true,
    autoExpandHighLift: true,
    notificationsEnabled: true,
  },
  onboardingCompleted: false,
};

const PROFILE_STORAGE_KEY = 'sponsormatch_user_profile';
const ONBOARDING_STORAGE_KEY = 'sponsormatch_onboarding_completed';

export function computeInitials(name: string): string {
  if (!name || !name.trim()) return 'SM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROFILE };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      preferences: {
        ...DEFAULT_PROFILE.preferences,
        ...(parsed.preferences || {}),
      },
    };
  } catch (e) {
    console.warn('Failed to parse stored user profile:', e);
    return { ...DEFAULT_PROFILE };
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    profile.avatarInitials = computeInitials(profile.name);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

export function resetStoredProfile(): UserProfile {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset user profile:', e);
  }
  return { ...DEFAULT_PROFILE, onboardingCompleted: true };
}

export function hasCompletedOnboarding(): boolean {
  try {
    const val = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (val === 'true') return true;
    const profile = getStoredProfile();
    return Boolean(profile.onboardingCompleted);
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, completed ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to set onboarding status:', e);
  }
}
