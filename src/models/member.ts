export interface IMember {
  id: number;
  email?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile?: string;
  groups?: any[];
  password: string;
  type: string;
  raw_pw: string;
}
