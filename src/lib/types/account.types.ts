export type Account = {
  id: string;
  name: string;
  balance: number;
  accountType: 'CHECKING' | 'CREDIT' | 'CASH';
  currencyCode: 'USD' | 'COP';
}

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  locale: string;
}
