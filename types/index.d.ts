export interface User {
  id: number;
  name: string;
  roles: string[];
}

export type UserAPIDetail = User
export type UserAPIList = Omit<User, 'roles'>[]
