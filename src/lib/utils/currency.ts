	const currencies = [
		{ code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
		{ code: 'COP', name: 'Colombian Peso', symbol: '$', locale: 'es-CO' },
		{ code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
		{ code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
		{ code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
		{ code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
		{ code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
		{ code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' }
	] as const;

	export const formatCurrency = (amount: number, currencyCode: string) => {
		const currency = currencies.find((c) => c.code === currencyCode);
		if (!currency) return `${amount.toFixed(2)}`;

		return new Intl.NumberFormat(currency.locale, {
			style: 'currency',
			currency: currencyCode,
			minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
			maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
		}).format(amount);
	};
