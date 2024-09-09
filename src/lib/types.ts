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
	startDate: Date;
	endDate?: Date;
	repeatType: string;
	description: string;
	category: Category;
	paid: boolean;
	account: Account;
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

export interface Account {
	id?: string;
	name: string;
	balance: number;
	currencyCode: string;
	user?: User;
}

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface SelectOption {
	value: string;
	label: string;
}

export interface CreateTransaction {
	id?: string;
	transactionType: string;
	amount: number;
	startDate: string;
	endDate?: string;
	repeatType: string;
	description: string;
	category: string;
	paid: boolean;
	account: string;
}
