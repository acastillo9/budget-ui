<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="w-full flex justify-center items-center">
	<div class="border p-4 rounded w-96 max-w-full">
		<h2 class="text-2xl font-bold mb-4">Sign up</h2>
		<form class="flex flex-col gap-4 mb-4" method="post" use:enhance>
			{#if form?.error}
				<div class="bg-red-100 p-3 rounded-md text-sm border-l-8 border-l-red-400">
					{form.error}
				</div>
			{/if}
			<div>
				<label for="name" class="mb-3 block text-base font-medium">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Name"
					class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				/>
			</div>
			<div>
				<label for="email" class="mb-3 block text-base font-medium">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Email"
					class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				/>
			</div>
			<div>
				<label for="password" class="mb-3 block text-base font-medium">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				/>
			</div>
			<button type="submit" class="bg-black text-white font-bold py-2 rounded-lg border"
				>Register</button
			>
		</form>
		<a href="/login" class="text-blue-400 text-md hover:underline">Sign in</a>
	</div>
</div>
