export interface User {
  id: string;
  externalId: string;
  email: string;
  name: string;
  company?: string;
  locale?: string;
}
