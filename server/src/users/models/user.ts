export class User {
  id: number;
  username: string;
  name: string;
  password: string;
  role: 'admin' | 'member' | 'user';
}
