export type Account = {
  id: string;
  name: string;
  balance: number;
  accountType: 'CHECKING' | 'CREDIT' | 'CASH';
  currencyCode: 'USD' | 'COP';
}
