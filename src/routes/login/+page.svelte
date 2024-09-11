<script lang="ts">
	import { enhance } from '$app/forms';
	import ButtonWithSpinner from '$lib/components/ButtonWithSpinner.svelte';
	import InputPassword from '$lib/components/InputPassword.svelte';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="w-full flex justify-center items-center">
	<div class="border p-4 rounded w-96 max-w-full">
		<h2 class="text-2xl font-bold mb-4">Sign in</h2>
		<form
			class="flex flex-col gap-4 mb-4"
			method="post"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					if (result.type !== 'redirect') {
						isLoading = false;
					}
					update();
				};
			}}
		>
			{#if form?.error}
				<div class="bg-red-100 p-3 rounded-md text-sm border-l-8 border-l-red-400">
					{form.error}
				</div>
			{/if}
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
				<InputPassword id="password" name="password" placeholder="Password" value="" />
			</div>
			<ButtonWithSpinner type="submit" {isLoading}>Login</ButtonWithSpinner>
		</form>
		<a href="/register" class="text-blue-400 text-md hover:underline">Create an account</a>
	</div>
</div>
