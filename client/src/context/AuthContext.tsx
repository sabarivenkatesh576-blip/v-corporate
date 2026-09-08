import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  college?: string;
  degree?: string;
  department?: string;
  targetRole?: string;
}

export interface StudentProfile {
  _id?: string;
  userId: string;
  fullName: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  academicYear: string;
  graduationYear: number;
  targetRole: string;
  careerInterests: string[];
  skills: string[];
  verifiedSkills?: Array<{ skillName: string; level: string; verifiedVia?: string; verifiedAt?: string }>;
  xp: number;
  level: number;
  streakDays: number;
  careerReadinessScore: number;
  readinessTier: string;
  isAssessed?: boolean;
}

export interface CareerReadinessScore {
  overallScore: number;
  tier: string;
  components: {
    resume: number;
    skills: number;
    aptitude: number;
    logicalReasoning: number;
    verbalAbility: number;
    aiInterview: number;
    projects: number;
    communication: number;
    teamwork: number;
    problemSolving: number;
  };
  history?: Array<{ date: string; score: number }>;
}

export interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  readiness: CareerReadinessScore | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, customName?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (type?: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  updateFullName: (newName: string) => void;
  updateUserProfile: (updates: Partial<User> & Partial<StudentProfile>) => void;
  addXp: (amount: number) => void;
  updateReadinessComponent: (componentKey: keyof CareerReadinessScore['components'], score: number) => void;
  resetProgression: () => void;
  refreshProfile: () => Promise<void>;
}

const DEFAULT_CLEAN_USER: User = {
  _id: 'usr_student_001',
  fullName: 'Candidate',
  email: 'student@vcorp.local',
  role: 'student',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  department: 'Computer Science & Engineering',
  targetRole: 'Software Developer'
};

const DEFAULT_CLEAN_PROFILE: StudentProfile = {
  userId: 'usr_student_001',
  fullName: 'Candidate',
  email: 'student@vcorp.local',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  department: 'Computer Science & Engineering',
  academicYear: 'Final Year',
  graduationYear: 2026,
  targetRole: 'Software Developer',
  careerInterests: ['Full Stack Development', 'Cloud Architecture', 'Data Engineering'],
  skills: [],
  verifiedSkills: [],
  xp: 0,
  level: 1,
  streakDays: 1,
  careerReadinessScore: 0,
  readinessTier: 'Not Calculated',
  isAssessed: false
};

const DEFAULT_CLEAN_READINESS: CareerReadinessScore = {
  overallScore: 0,
  tier: 'Not Calculated',
  components: {
    resume: 0,
    skills: 0,
    aptitude: 0,
    logicalReasoning: 0,
    verbalAbility: 0,
    aiInterview: 0,
    projects: 0,
    communication: 0,
    teamwork: 0,
    problemSolving: 0
  }
};

const deriveNameFromEmail = (emailStr: string): string => {
  if (!emailStr) return 'Candidate';
  const prefix = emailStr.split('@')[0];
  if (prefix.toLowerCase() === 'demo' || prefix.toLowerCase() === 'student') return 'Candidate';
  if (prefix.toLowerCase() === 'admin') return 'Dr. Sarah Jenkins (Placement Director)';
  return prefix
    .replace(/[._-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName === 'Mohanapriya' || parsed.email?.toLowerCase().includes('mohanapriya')) {
          parsed.fullName = 'Candidate';
          parsed.email = 'student@vcorp.local';
          localStorage.setItem('vcorp_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEFAULT_CLEAN_USER;
    } catch {
      return DEFAULT_CLEAN_USER;
    }
  });

  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.xp === 2450 || parsed.careerReadinessScore === 92 || parsed.fullName === 'Mohanapriya') {
          localStorage.setItem('vcorp_profile', JSON.stringify(DEFAULT_CLEAN_PROFILE));
          return DEFAULT_CLEAN_PROFILE;
        }
        return parsed;
      }
      return DEFAULT_CLEAN_PROFILE;
    } catch {
      return DEFAULT_CLEAN_PROFILE;
    }
  });

  const [readiness, setReadiness] = useState<CareerReadinessScore | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_readiness');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.overallScore === 92 || parsed.overallScore === 86) {
          localStorage.setItem('vcorp_readiness', JSON.stringify(DEFAULT_CLEAN_READINESS));
          return DEFAULT_CLEAN_READINESS;
        }
        return parsed;
      }
      return DEFAULT_CLEAN_READINESS;
    } catch {
      return DEFAULT_CLEAN_READINESS;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vcorp_token') || 'vcorp_session_token_active';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('vcorp_user', JSON.stringify(user));
    if (profile) localStorage.setItem('vcorp_profile', JSON.stringify(profile));
    if (readiness) localStorage.setItem('vcorp_readiness', JSON.stringify(readiness));
    if (token) localStorage.setItem('vcorp_token', token);
  }, [user, profile, readiness, token]);

  const fetchCurrentUser = async () => {
    try {
      const currentToken = localStorage.getItem('vcorp_token');
      if (!currentToken) return;

      const res = await api.get('/auth/me');
      if (res.data?.success && res.data.user) {
        const currentName = user?.fullName || res.data.user.fullName;
        setUser({ ...res.data.user, fullName: currentName });
        if (res.data.profile) setProfile({ ...res.data.profile, fullName: currentName });
        if (res.data.readiness) setReadiness(res.data.readiness);
      }
    } catch (err) {
      // Backend check bypassed in standalone mode
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string, customName?: string) => {
    setIsLoading(true);
    const isAdm = email.toLowerCase().includes('admin');
    const resolvedName = customName?.trim() || deriveNameFromEmail(email);

    const newUser: User = {
      _id: isAdm ? 'usr_admin_001' : 'usr_student_001',
      fullName: isAdm ? 'Dr. Sarah Jenkins (Placement Director)' : resolvedName,
      email: email || (isAdm ? 'admin@vcorp.local' : 'student@vcorp.local'),
      role: isAdm ? 'admin' : 'student',
      college: profile?.college || 'National Institute of Technology',
      degree: profile?.degree || 'B.Tech',
      department: profile?.department || 'Computer Science & Engineering',
      targetRole: profile?.targetRole || 'Software Developer'
    };

    const newProfile: StudentProfile = {
      ...DEFAULT_CLEAN_PROFILE,
      userId: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      college: newUser.college || DEFAULT_CLEAN_PROFILE.college,
      targetRole: newUser.targetRole || DEFAULT_CLEAN_PROFILE.targetRole
    };

    const newToken = 'vcorp_session_token_' + Date.now();

    localStorage.setItem('vcorp_token', newToken);
    localStorage.setItem('vcorp_user', JSON.stringify(newUser));
    localStorage.setItem('vcorp_profile', JSON.stringify(newProfile));
    localStorage.setItem('vcorp_readiness', JSON.stringify(DEFAULT_CLEAN_READINESS));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
    setReadiness(DEFAULT_CLEAN_READINESS);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        localStorage.setItem('vcorp_token', res.data.token);
        setToken(res.data.token);
        if (res.data.user) {
          const userWithCustomName = {
            ...res.data.user,
            fullName: customName?.trim() || resolvedName
          };
          setUser(userWithCustomName);
          localStorage.setItem('vcorp_user', JSON.stringify(userWithCustomName));
        }
        if (res.data.profile) {
          const profileWithCustomName = {
            ...res.data.profile,
            fullName: customName?.trim() || resolvedName
          };
          setProfile(profileWithCustomName);
          localStorage.setItem('vcorp_profile', JSON.stringify(profileWithCustomName));
        }
      }
    } catch (err) {
      console.warn('Backend login fallback used for user:', resolvedName);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    await login(formData.email || 'student@vcorp.local', formData.password || 'Student@12345', formData.fullName);
  };

  const demoLogin = async (type: 'student' | 'admin' = 'student') => {
    if (type === 'admin') {
      await login('admin@vcorp.local', 'Admin@12345', 'Dr. Sarah Jenkins (Placement Director)');
    } else {
      await login('student@vcorp.local', 'Student@12345', user?.fullName && user.fullName !== 'Student' && user.fullName !== 'Candidate' ? user.fullName : 'Candidate');
    }
  };

  const updateFullName = (newName: string) => {
    if (!newName.trim()) return;
    const cleanName = newName.trim();
    if (user) {
      const updatedUser = { ...user, fullName: cleanName };
      setUser(updatedUser);
      localStorage.setItem('vcorp_user', JSON.stringify(updatedUser));
    }
    if (profile) {
      const updatedProfile = { ...profile, fullName: cleanName };
      setProfile(updatedProfile);
      localStorage.setItem('vcorp_profile', JSON.stringify(updatedProfile));
    }
  };

  const updateUserProfile = (updates: Partial<User> & Partial<StudentProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('vcorp_user', JSON.stringify(updatedUser));
    }
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      localStorage.setItem('vcorp_profile', JSON.stringify(updatedProfile));
    }
  };

  const addXp = (amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => {
      if (!prev) return prev;
      const newXp = (prev.xp || 0) + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);
      const updated = { ...prev, xp: newXp, level: newLevel };
      localStorage.setItem('vcorp_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const updateReadinessComponent = (componentKey: keyof CareerReadinessScore['components'], score: number) => {
    setReadiness(prev => {
      const current = prev || DEFAULT_CLEAN_READINESS;
      const updatedComponents = {
        ...current.components,
        [componentKey]: Math.round(score)
      };

      const activeScores = Object.values(updatedComponents).filter(s => typeof s === 'number' && s > 0);
      const overall = activeScores.length > 0
        ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length)
        : 0;

      let tier = 'Not Calculated';
      if (overall >= 85) tier = 'Tier 1 - Industry Ready';
      else if (overall >= 70) tier = 'Tier 2 - Job Ready';
      else if (overall >= 50) tier = 'Tier 3 - Developing';
      else if (overall > 0) tier = 'Tier 4 - Beginner';

      const updatedReadiness: CareerReadinessScore = {
        ...current,
        overallScore: overall,
        tier,
        components: updatedComponents
      };

      localStorage.setItem('vcorp_readiness', JSON.stringify(updatedReadiness));

      // Sync overall score to student profile
      setProfile(prof => {
        if (!prof) return prof;
        const updatedProf = {
          ...prof,
          careerReadinessScore: overall,
          readinessTier: tier,
          isAssessed: overall > 0
        };
        localStorage.setItem('vcorp_profile', JSON.stringify(updatedProf));
        return updatedProf;
      });

      return updatedReadiness;
    });
  };

  const resetProgression = () => {
    const currentName = user?.fullName || 'Candidate';
    const currentEmail = user?.email || 'student@vcorp.local';

    const cleanUser: User = {
      ...DEFAULT_CLEAN_USER,
      fullName: currentName,
      email: currentEmail
    };

    const cleanProfile: StudentProfile = {
      ...DEFAULT_CLEAN_PROFILE,
      fullName: currentName,
      email: currentEmail
    };

    localStorage.removeItem('vcorp_internship_status');
    localStorage.removeItem('vcorp_hiring_rounds');
    localStorage.removeItem('vcorp_credentials');
    localStorage.setItem('vcorp_user', JSON.stringify(cleanUser));
    localStorage.setItem('vcorp_profile', JSON.stringify(cleanProfile));
    localStorage.setItem('vcorp_readiness', JSON.stringify(DEFAULT_CLEAN_READINESS));

    setUser(cleanUser);
    setProfile(cleanProfile);
    setReadiness(DEFAULT_CLEAN_READINESS);
  };

  const logout = () => {
    localStorage.removeItem('vcorp_token');
    localStorage.removeItem('vcorp_user');
    localStorage.removeItem('vcorp_profile');
    localStorage.removeItem('vcorp_readiness');
    localStorage.removeItem('vcorp_internship_status');
    localStorage.removeItem('vcorp_hiring_rounds');
    localStorage.removeItem('vcorp_credentials');
    setToken(null);
    setUser(null);
    setProfile(null);
    setReadiness(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data?.success && res.data.profile) {
        setProfile(res.data.profile);
        if (res.data.readiness) setReadiness(res.data.readiness);
      }
    } catch (err) {
      // Keep existing
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        readiness,
        token,
        isAuthenticated: true,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateFullName,
        updateUserProfile,
        addXp,
        updateReadinessComponent,
        resetProgression,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
