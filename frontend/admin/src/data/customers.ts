export interface Customer {
  suiteNo: string;
  name: string;
  id?: string;
  email: string;
  emailVerifiedOn: string;
  phone?: string;
  provider?: 'Google' | null;
  isVerified: boolean;
  isActive: boolean;
}

export const customers: Customer[] = [
  { suiteNo: '149-421', name: 'Ishem Ahmed', email: 'hssnishm@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 5:29:11 PM', isVerified: false, isActive: true },
  { suiteNo: '941-999', name: 'Ubaidha Thooba', email: 'ubaidhathooba@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 3:57:30 PM', isVerified: false, isActive: true },
  { suiteNo: '446-481', name: 'Mariyam Rizleen', email: 'rizleen@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 2:05:23 PM', isVerified: false, isActive: true },
  { suiteNo: '443-149', name: 'Ahmed Michael', id: 'A074190', email: 'michal@gewcp.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 2:01:05 PM', phone: '9690010', isVerified: false, isActive: true },
  { suiteNo: '958-997', name: 'Mohamed Hassan Manik', email: 'mhmanik@senategroup.com', emailVerifiedOn: '', isVerified: false, isActive: true },
  { suiteNo: '891-687', name: 'Ain Aiman', id: 'A353523', email: 'ailu2554@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 12:20:05 PM', phone: '9161888', isVerified: false, isActive: true },
  { suiteNo: '380-727', name: 'Nazura Hassan Maniku', id: 'A100659', email: 'nazurahmn@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 11:34:06 AM', phone: '9607654786', isVerified: false, isActive: true },
  { suiteNo: '113-481', name: 'Aishath Shaffa Ahmed', id: 'A335063', email: 'aishathshaffaahmed@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 10:53:00 AM', phone: '9836343', isVerified: false, isActive: true },
  { suiteNo: '595-273', name: 'Niumathulla Idrees', id: 'A087405', email: 'niumathulla@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 10:39:55 AM', phone: '9607785265', provider: 'Google', isVerified: false, isActive: true },
  { suiteNo: '635-282', name: 'Shamrin Solih Mohamed', id: 'A284717', email: 'shamna101@gmail.com', emailVerifiedOn: 'Email verified on Aug 31, 2025, 7:29:54 AM', phone: '9727474', isVerified: false, isActive: true },
  { suiteNo: '183-615', name: 'Sajad Mohamed', email: 'rajaishohamed@gmail.com', emailVerifiedOn: 'Email verified on Aug 30, 2025, 8:14:58 PM', isVerified: false, isActive: true },
  { suiteNo: '788-437', name: 'Lucas Appel', email: 'lapool523@gmail.com', emailVerifiedOn: 'Email verified on Aug 30, 2025, 7:20:51 PM', provider: 'Google', isVerified: false, isActive: true },
  { suiteNo: '692-692', name: 'Azwaan Ali', id: 'A313158', email: 'vaaroal8@gmail.com', emailVerifiedOn: '', phone: '9900838', isVerified: false, isActive: true },
  { suiteNo: '463-949', name: 'Ree Shameez', email: 'reesthashameez@gmail.com', emailVerifiedOn: 'Email verified on Aug 30, 2025, 5:51:56 PM', provider: 'Google', isVerified: false, isActive: true },
  { suiteNo: '686-382', name: 'Walida', email: 'yotunewali@yahoo.com', emailVerifiedOn: 'Email verified on Aug 30, 2025, 4:47:07 PM', isVerified: false, isActive: true },
];

export const getStatusChipColor = (status: boolean) => {
  return status
    ? { color: '#16a34a', bgColor: '#dcfce7' }
    : { color: '#f59e0b', bgColor: '#fef3c7' };
};