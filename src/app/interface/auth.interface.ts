// interface for the auth response data
export interface AuthResponseData {
  token: string;
  message: string;
  name: string;
  email: string;
  role: string;
  registered?: boolean;
}
