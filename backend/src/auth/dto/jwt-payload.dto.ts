export interface JwtPayload {
  sub: string; // User ID
  externalId: string; // BeProduct user ID
  email: string;
  name: string;
  company?: string;
  locale?: string;
  // Note: accessToken and refreshToken are NOT included here
  // They're too large for JWT cookies and are stored server-side only
  iat?: number;
  exp?: number;
}
