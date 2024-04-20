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
}

export interface Category {
	id: string;
	name: string;
}

export enum TransactionType {
	EXPENSE = 'EXPENSE',
	INCOME = 'INCOME'
}
