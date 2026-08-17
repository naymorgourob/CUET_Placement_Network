export const ROLE_HOME_PATH = {
  student: '/student/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard',
};

export function getRoleHomePath(role) {
  return ROLE_HOME_PATH[role] ?? '/';
}
