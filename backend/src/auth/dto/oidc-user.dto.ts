export class OidcUserDto {
  externalId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  locale?: string;
  company?: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
}
