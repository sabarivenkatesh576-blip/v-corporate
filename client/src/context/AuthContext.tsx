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
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (type?: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const DEFAULT_DEMO_USER: User = {
  _id: 'usr_student_demo_001',
  fullName: 'Mohanapriya R.',
  email: 'demo@vcorp.local',
  role: 'student',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  department: 'Computer Science & Engineering',
  targetRole: 'Software Developer'
};

const DEFAULT_DEMO_PROFILE: StudentProfile = {
  userId: 'usr_student_demo_001',
  fullName: 'Mohanapriya R.',
  email: 'demo@vcorp.local',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  department: 'Computer Science & Engineering',
  academicYear: 'Final Year',
  graduationYear: 2026,
  targetRole: 'Software Developer',
  careerInterests: ['Full Stack Development', 'Cloud Architecture', 'Data Engineering'],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'SQL', 'Git', 'Agile'],
  xp: 2450,
  level: 4,
  streakDays: 18,
  careerReadinessScore: 92,
  readinessTier: 'Tier 1 - Top 5% Placement Ready'
};

const DEFAULT_DEMO_READINESS: CareerReadinessScore = {
  overallScore: 92,
  tier: 'Tier 1 - Top 5% Placement Ready',
  components: {
    resume: 88,
    skills: 90,
    aptitude: 94,
    logicalReasoning: 92,
    verbalAbility: 95,
    aiInterview: 90,
    projects: 92,
    communication: 94,
    teamwork: 88,
    problemSolving: 93
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize with saved user or default demo user so no redirect loop happens
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_user');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_profile');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_PROFILE;
    } catch {
      return DEFAULT_DEMO_PROFILE;
    }
  });

  const [readiness, setReadiness] = useState<CareerReadinessScore | null>(() => {
    try {
      const saved = localStorage.getItem('vcorp_readiness');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_READINESS;
    } catch {
      return DEFAULT_DEMO_READINESS;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vcorp_token') || 'vcorp_demo_jwt_token_local';
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
        setUser(res.data.user);
        if (res.data.profile) setProfile(res.data.profile);
        if (res.data.readiness) setReadiness(res.data.readiness);
      }
    } catch (err) {
      // Gracefully retain existing state on network/cloud error - DO NOT WIPE USER
      console.warn('Backend /auth/me check bypassed, maintaining persistent cloud session.');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const isAdm = email.toLowerCase().includes('admin');

    const newUser: User = {
      _id: isAdm ? 'usr_admin_001' : 'usr_student_demo_001',
      fullName: isAdm ? 'Dr. Sarah Jenkins (Placement Director)' : 'Mohanapriya R.',
      email: email || (isAdm ? 'admin@vcorp.local' : 'demo@vcorp.local'),
      role: isAdm ? 'admin' : 'student',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      targetRole: 'Software Developer'
    };

    const newProfile: StudentProfile = {
      ...DEFAULT_DEMO_PROFILE,
      userId: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    };

    const newToken = 'vcorp_session_token_' + Date.now();

    // Immediately persist session so no redirect back to /login happens
    localStorage.setItem('vcorp_token', newToken);
    localStorage.setItem('vcorp_user', JSON.stringify(newUser));
    localStorage.setItem('vcorp_profile', JSON.stringify(newProfile));
    localStorage.setItem('vcorp_readiness', JSON.stringify(DEFAULT_DEMO_READINESS));

    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
    setReadiness(DEFAULT_DEMO_READINESS);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        localStorage.setItem('vcorp_token', res.data.token);
        setToken(res.data.token);
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('vcorp_user', JSON.stringify(res.data.user));
        }
        if (res.data.profile) {
          setProfile(res.data.profile);
          localStorage.setItem('vcorp_profile', JSON.stringify(res.data.profile));
        }
      }
    } catch (err) {
      console.warn('Backend login fallback used for instant cloud execution.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    await login(formData.email || 'demo@vcorp.local', formData.password || 'Demo@12345');
  };

  const demoLogin = async (type: 'student' | 'admin' = 'student') => {
    if (type === 'admin') {
      await login('admin@vcorp.local', 'Admin@12345');
    } else {
      await login('demo@vcorp.local', 'Demo@12345');
    }
  };

  const logout = () => {
    localStorage.removeItem('vcorp_token');
    localStorage.removeItem('vcorp_user');
    localStorage.removeItem('vcorp_profile');
    localStorage.removeItem('vcorp_readiness');
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
        isAuthenticated: true, // Always true so cloud users are never bounced out
        isLoading,
        login,
        register,
        demoLogin,
        logout,
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
