<script lang="ts">
	import { t } from 'svelte-i18n';
	import type { PageProps } from './$types';
	import BillList from '$lib/components/bill-list.svelte';
	import CreateBillDialog from '$lib/components/create-bill-wizard/create-bill-dialog.svelte';
	import type { Bill } from '$lib/types/bill.types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let isEditBillDialogOpen = $state(false);
	let selectedBill: Bill | undefined = $state(undefined);
	let isPaying: string | undefined = $state(undefined);
	let isUnpaying: string | undefined = $state(undefined);

	async function payBill(bill: Bill) {
		isPaying = bill.id;
		const targetDate = bill.targetDate || bill.dueDate;
		try {
			const response = await fetch(`/api/bills/${bill.id}/${targetDate.split('T')[0]}/pay`, {
				method: 'POST',
				body: JSON.stringify({
					paidDate: new Date().toISOString().split('T')[0]
				})
			});

			if (!response.ok) {
				throw new Error('Failed to pay bill');
			}

			toast.success($t('bills.billPaidSuccess'));

			invalidateAll();
		} catch {
			toast.error($t('bills.billPaidError'));
		} finally {
			isPaying = undefined;
		}
	}

	async function unpayBill(bill: Bill) {
		isUnpaying = bill.id;
		const targetDate = bill.targetDate || bill.dueDate;
		try {
			const response = await fetch(`/api/bills/${bill.id}/${targetDate.split('T')[0]}/unpay`, {
				method: 'POST'
			});

			if (!response.ok) {
				throw new Error('Failed to unpay bill');
			}

			toast.success($t('bills.billUnpaidSuccess'));

			invalidateAll();
		} catch {
			toast.error($t('bills.billUnpaidError'));
		} finally {
			isUnpaying = undefined;
		}
	}
</script>

<svelte:head>
	<title>Budget App - {$t('bills.title')}</title>
</svelte:head>

<section class="flex h-full w-full flex-col gap-4 py-4 md:py-6">
	<div class="container mx-auto">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl font-bold">{$t('bills.title')}</h1>
				<p class="text-muted-foreground">{$t('bills.description')}</p>
			</div>

			<div class="flex items-center space-x-2">
				<CreateBillDialog
					addBillForm={data.createBillForm}
					createCategoryForm={data.createCategoryForm}
					accounts={data.accounts}
					categories={data.categories}
					bill={selectedBill}
					bind:open={isEditBillDialogOpen}
					onClose={() => {
						selectedBill = undefined;
					}}
				/>
			</div>
		</div>
	</div>
	<div class="container mx-auto">
		<BillList
			bills={data.bills}
			headless
			payBill={(e) => payBill(e)}
			unpayBill={(e) => unpayBill(e)}
			isPayingBill={isPaying}
			isUnpayingBill={isUnpaying}
			onEdit={(event) => {
				selectedBill = event;
				isEditBillDialogOpen = true;
			}}
		></BillList>
	</div>
</section>
