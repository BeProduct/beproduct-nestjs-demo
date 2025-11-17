export interface User {
  id: string;
  externalId: string; // BeProduct user ID (sub)
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  locale?: string;
  emailVerified: boolean;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  lastLoginAt: Date;
}
