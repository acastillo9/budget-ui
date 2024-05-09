export interface SessionUser {
	id: string;
	name: string;
	email: string;
	access_token: string;
}

export interface Transaction {
	id?: string;
	transactionType: string;
	amount: number;
	currencyCode: string;
	startDate: Date;
	endDate?: Date;
	repeatType: string;
	description: string;
	category: Category;
	paid: boolean;
}

export interface Category {
	id: string;
	name: string;
}

export enum TransactionType {
	EXPENSE = 'EXPENSE',
	INCOME = 'INCOME'
}

export interface Balance {
	[currency: string]: number;
}

export interface CalendarChangeEvent {
	year: number;
	month: number;
}
