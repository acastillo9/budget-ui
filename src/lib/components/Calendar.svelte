<script lang="ts">
	import type { Transaction } from './types';
	import Slot from './Slot.svelte';
	import TransactionEvent from './TransactionEvent.svelte';

	export let transactionsEvents: Transaction[] = [];

	let year = new Date().getFullYear();
	let month = new Date().getMonth();
	let currentDay = new Date().getDate();

	let firsDateOfMonth;
	let lastDateOfMonth;
	let lastDayOfMonth: number;
	let firstWeekDayOfMonth: number;
	let lastWeekDayOfMonth: number;

	function updateCalendar() {
		firsDateOfMonth = new Date(year, month, 1);
		lastDateOfMonth = new Date(year, month + 1, 0);
		lastDayOfMonth = lastDateOfMonth.getDate();
		firstWeekDayOfMonth = firsDateOfMonth.getDay();
		lastWeekDayOfMonth = lastDateOfMonth.getDay();
	}

	function prevMonth() {
		month -= 1;
		if (month < 0) {
			month = 11;
			year -= 1;
		}
		updateCalendar();
	}

	function nextMonth() {
		month += 1;
		if (month > 11) {
			month = 0;
			year += 1;
		}
		updateCalendar();
	}

	function today() {
		year = new Date().getFullYear();
		month = new Date().getMonth();
		updateCalendar();
	}

	function getAllDayEvents(day: number) {
		return transactionsEvents.filter((transactionEvent) => {
			const date = transactionEvent.startDate;
			return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
		});
	}

	updateCalendar();
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
			{#if firstWeekDayOfMonth > 0}
				{#each Array.from({ length: firstWeekDayOfMonth }, (_, i) => i + 1) as day}
					<Slot disabled>{new Date(year, month, day - firstWeekDayOfMonth).getDate()}</Slot>
				{/each}
			{/if}
			{#each Array.from({ length: lastDayOfMonth }, (_, i) => i + 1) as day}
				<Slot
					active={day === currentDay &&
						month === new Date().getMonth() &&
						year === new Date().getFullYear()}
				>
					<span slot="day">{day}</span>
					<div class="flex flex-wrap gap-1">
						{#each getAllDayEvents(day) as transactionEvent}<TransactionEvent
								{transactionEvent}
								on:edit
							></TransactionEvent>{/each}
					</div></Slot
				>
			{/each}
			{#if lastWeekDayOfMonth < 6}
				{#each Array.from({ length: 6 - lastWeekDayOfMonth }, (_, i) => i + 1) as day}
					<Slot disabled>{day}</Slot>
				{/each}
			{/if}
		</div>
	</div>
</section>
