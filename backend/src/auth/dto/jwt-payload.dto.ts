export interface JwtPayload {
  sub: string; // User ID
  externalId: string; // BeProduct user ID
  email: string;
  name: string;
  company?: string;
  locale?: string;
  accessToken?: string;
  refreshToken?: string;
  iat?: number;
  exp?: number;
}
