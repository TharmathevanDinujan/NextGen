// Session management utility for Next.js (client-side)

export type UserRole = "admin" | "student" | "instructor";

export interface SessionData {
  role: UserRole;
  email: string;
  name: string;
  token: string;
  expiresAt: number;
  docId?: string; // For instructor/student
}

// Generate a secure token
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Set session for a user
export function setSession(role: UserRole, email: string, name: string, docId?: string): void {
  const token = generateToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

  const sessionData: SessionData = {
    role,
    email,
    name,
    token,
    expiresAt,
    docId,
  };

  // Store in localStorage with role-specific key
  const storageKey = `${role}_session`;
  localStorage.setItem(storageKey, JSON.stringify(sessionData));
  
  // Also store in a general session for quick access
  localStorage.setItem("current_session_role", role);
  localStorage.setItem("current_session_token", token);
}

// Get session for a specific role
export function getSession(role: UserRole): SessionData | null {
  if (typeof window === "undefined") return null;
  
  const storageKey = `${role}_session`;
  const sessionStr = localStorage.getItem(storageKey);
  
  if (!sessionStr) return null;

  try {
    const session: SessionData = JSON.parse(sessionStr);
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      clearSession(role);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Get current active session (any role)
export function getCurrentSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  
  const role = localStorage.getItem("current_session_role") as UserRole | null;
  if (!role) return null;

  return getSession(role);
}

// Check if user is authenticated for a specific role
export function isAuthenticated(role: UserRole): boolean {
  const session = getSession(role);
  return session !== null && Date.now() < session.expiresAt;
}

// Clear session for a specific role
export function clearSession(role: UserRole): void {
  const storageKey = `${role}_session`;
  localStorage.removeItem(storageKey);
  
  // Clear general session if it matches
  const currentRole = localStorage.getItem("current_session_role");
  if (currentRole === role) {
    localStorage.removeItem("current_session_role");
    localStorage.removeItem("current_session_token");
  }
}

// Clear all sessions
export function clearAllSessions(): void {
  localStorage.removeItem("admin_session");
  localStorage.removeItem("student_session");
  localStorage.removeItem("instructor_session");
  localStorage.removeItem("current_session_role");
  localStorage.removeItem("current_session_token");
  
  // Clear old localStorage items
  localStorage.removeItem("loggedStudentEmail");
  localStorage.removeItem("loggedStudentName");
  localStorage.removeItem("instructorDocId");
}

// Save user info for re-login prompt (after logout)
export function saveUserForRelogin(role: UserRole, email: string, name: string, password?: string): void {
  const reloginData = {
    role,
    email,
    name,
    timestamp: Date.now(),
  };
  localStorage.setItem("relogin_user", JSON.stringify(reloginData));
  
  // Store password temporarily in sessionStorage for quick re-login (expires in 10 minutes)
  if (password) {
    const quickLoginData = {
      role,
      email,
      password,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    sessionStorage.setItem("quick_login", JSON.stringify(quickLoginData));
  }
}

// Get quick login credentials (for automatic re-login)
export function getQuickLogin(): { role: UserRole; email: string; password: string } | null {
  if (typeof window === "undefined") return null;
  
  const quickLoginStr = sessionStorage.getItem("quick_login");
  if (!quickLoginStr) return null;
  
  try {
    const quickLogin = JSON.parse(quickLoginStr);
    // Check if expired
    if (Date.now() > quickLogin.expiresAt) {
      sessionStorage.removeItem("quick_login");
      return null;
    }
    return {
      role: quickLogin.role,
      email: quickLogin.email,
      password: quickLogin.password,
    };
  } catch {
    return null;
  }
}

// Clear quick login credentials
export function clearQuickLogin(): void {
  sessionStorage.removeItem("quick_login");
}

// Get user info for re-login prompt
export function getReloginUser(): { role: UserRole; email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  
  const reloginStr = localStorage.getItem("relogin_user");
  if (!reloginStr) return null;

  try {
    const relogin = JSON.parse(reloginStr);
    // Only show relogin prompt if it's recent (within 1 hour)
    if (Date.now() - relogin.timestamp < 60 * 60 * 1000) {
      return {
        role: relogin.role,
        email: relogin.email,
        name: relogin.name,
      };
    }
    localStorage.removeItem("relogin_user");
    return null;
  } catch {
    return null;
  }
}

// Clear relogin user info
export function clearReloginUser(): void {
  localStorage.removeItem("relogin_user");
}

