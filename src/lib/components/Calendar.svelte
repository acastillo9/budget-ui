<script lang="ts">
	import type { Transaction } from './types';
	import Slot from './Slot.svelte';
	import TransactionEvent from './TransactionEvent.svelte';
	import { createEventDispatcher } from 'svelte';

	export let transactions: Transaction[] = [];

	const dispatch = createEventDispatcher();

	let year = new Date().getFullYear();
	let month = new Date().getMonth();
	let currentDay = new Date().getDate();

	$: calendarSlots = getCalendarSlots(month, year, transactions);

	function getCalendarSlots(month: number, year: number, transactions: Transaction[]) {
		const firsDateOfMonth = new Date(year, month, 1);
		const lastDateOfMonth = new Date(year, month + 1, 0);
		const lastDayOfMonth = lastDateOfMonth.getDate();
		const firstWeekDayOfMonth = firsDateOfMonth.getDay();
		const lastWeekDayOfMonth = lastDateOfMonth.getDay();
		return [
			...Array.from({ length: firstWeekDayOfMonth }, (_, i) => ({
				day: new Date(year, month, 1 - firstWeekDayOfMonth + i).getDate(),
				month: month - 1,
				disabled: true,
				events: transactions.filter(
					(transaction) =>
						transaction.startDate.getFullYear() === year &&
						transaction.startDate.getMonth() === month - 1 &&
						transaction.startDate.getDate() ===
							new Date(year, month, 1 - firstWeekDayOfMonth + i).getDate()
				)
			})),
			...Array.from({ length: lastDayOfMonth }, (_, i) => ({
				day: i + 1,
				month: month,
				disabled: false,
				events: transactions.filter(
					(transaction) =>
						transaction.startDate.getFullYear() === year &&
						transaction.startDate.getMonth() === month &&
						transaction.startDate.getDate() === i + 1
				)
			})),
			...Array.from({ length: 6 - lastWeekDayOfMonth }, (_, i) => ({
				day: i + 1,
				month: month + 1,
				disabled: true,
				events: transactions.filter(
					(transaction) =>
						transaction.startDate.getFullYear() === year &&
						transaction.startDate.getMonth() === month + 1 &&
						transaction.startDate.getDate() === i + 1
				)
			}))
		];
	}

	function prevMonth() {
		month -= 1;
		if (month < 0) {
			month = 11;
			year -= 1;
		}
		dispatch('change', {
			month,
			year
		});
	}

	function nextMonth() {
		month += 1;
		if (month > 11) {
			month = 0;
			year += 1;
		}
		dispatch('change', {
			month,
			year
		});
	}

	function today() {
		year = new Date().getFullYear();
		month = new Date().getMonth();
		dispatch('change', {
			month,
			year
		});
	}
</script>

<section>
	<button on:click={prevMonth}>Prev</button>
	<button on:click={today}>today</button>
	<button on:click={nextMonth}>Next</button>
	<p>{year} - {month + 1}</p>
	<div>
		<div class="grid grid-cols-7 gap-0.5">
			<span class="p-2 font-bold">Sun</span>
			<span class="p-2 font-bold">Mon</span>
			<span class="p-2 font-bold">Tue</span>
			<span class="p-2 font-bold">Wed</span>
			<span class="p-2 font-bold">Thu</span>
			<span class="p-2 font-bold">Fri</span>
			<span class="p-2 font-bold">Sat</span>
		</div>
		<div class="grid grid-cols-7 gap-0.5">
			{#each calendarSlots as calendarSlot}
				<Slot
					active={calendarSlot.day === currentDay &&
						calendarSlot.month === new Date().getMonth() &&
						year === new Date().getFullYear()}
					disabled={calendarSlot.disabled}
				>
					<span slot="day">{calendarSlot.day}</span>
					<div class="flex flex-wrap gap-1">
						{#each calendarSlot.events as event}
							<TransactionEvent transactionEvent={event} on:edit></TransactionEvent>
						{/each}
					</div>
				</Slot>
			{/each}
		</div>
	</div>
</section>
