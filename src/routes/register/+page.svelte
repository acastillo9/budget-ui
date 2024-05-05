<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '../../stores/token';
	import { browser } from '$app/environment';

	token.subscribe((value) => {
		if (browser && value) {
			goto('/calendar');
		}
	});

	let user = {
		name: '',
		email: '',
		password: ''
	};

	function register() {
		fetch(`${import.meta.env.VITE_API_URL}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then((response) => {
			if (response.ok) {
				goto('/login');
			}
		});
	}
</script>

<div class="w-full flex justify-center items-center">
	<div class="border p-4 rounded w-96 max-w-full">
		<h2 class="text-xl font-bold mb-4">Sign up</h2>
		<form class="flex flex-col gap-4 mb-4" on:submit|preventDefault={register}>
			<div>
				<label for="name" class="mb-3 block text-base font-medium">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Name"
					class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
					bind:value={user.name}
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
					bind:value={user.email}
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
					bind:value={user.password}
				/>
			</div>
			<button type="submit" class="bg-black text-white font-bold py-2 rounded-lg border"
				>Register</button
			>
		</form>
		<a href="/login" class="text-blue-400 text-md hover:underline">Login</a>
	</div>
</div>
