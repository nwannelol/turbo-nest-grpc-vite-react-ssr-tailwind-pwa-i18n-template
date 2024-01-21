export class User {
  id?: string;
  primaryEmailAddress: string;
  firstName: string;
  middleName?: string | undefined;
  lastName: string;
  passwordHash: string;
  backupEmailAddress: string;
  phone: { [key: string]: any } | undefined;
  isPrimaryEmailAddressVerified: boolean;
  isBackupEmailAddressVerified: boolean;
}
