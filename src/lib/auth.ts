// Simple localStorage-based auth for demo
export interface User {
  name: string;
  email: string;
}

export function getUser(): User | null {
  const data = localStorage.getItem("sherise_user");
  return data ? JSON.parse(data) : null;
}

export function loginUser(email: string, _password: string, name?: string): User {
  const user: User = { name: name || email.split("@")[0], email };
  localStorage.setItem("sherise_user", JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem("sherise_user");
}
