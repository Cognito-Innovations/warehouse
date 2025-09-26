export interface Customer {
  suiteNo: string;
  name: string;
  id?: string;
  email: string;
  isEmailVerified: boolean;
  emailVerifiedOn: string;
  phone?: string;
  provider?: 'Google' | null;
  isVerified: boolean;
  isActive: boolean;
  gender?: 'male' | 'female';
  dob?: string;
}

export const getStatusChipColor = (status: boolean) => {
  return status
    ? { color: '#16a34a', bgColor: '#dcfce7' }
    : { color: '#f59e0b', bgColor: '#fef3c7' };
};