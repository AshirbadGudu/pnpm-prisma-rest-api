// Added RBAC helper functions
export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

const users: User[] = [
  { id: "1", email: "admin@example.com", password: "admin123", role: "admin" },
  {
    id: "2",
    email: "editor@example.com",
    password: "editor123",
    role: "editor",
  },
  {
    id: "3",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer",
  },
];

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((user) => user.email === email) || null;
}
