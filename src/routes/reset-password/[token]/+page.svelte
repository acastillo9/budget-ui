<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import Logo from '$lib/components/logo.svelte';
	import PasswordForm from '$lib/components/register-form/password-form.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Budget App - Password Reset</title>
</svelte:head>

<div class="container flex h-full items-center justify-center">
	<div class="w-full md:w-96">
		<Card.Root>
			<Card.Header class="space-y-1">
				<p class="mb-4 flex justify-center">
					<Logo />
				</p>
				<Card.Title class="text-2xl">Password reset</Card.Title>
				<Card.Description>Please enter your new password.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<PasswordForm data={data.form} accessToken={data.accessToken}></PasswordForm>
			</Card.Content>
			<Card.Footer class="flex-col">
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Go to</p>
					<Button class="px-2" variant="link" href="/signin">Sign in</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
