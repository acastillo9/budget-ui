<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import Logo from '$lib/components/logo.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Control } from 'formsnap';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { passwordSchema } from '$lib/components/register-form/schema';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let accessToken: string;

	const form = superForm(data.form, {
		validators: zodClient(passwordSchema),
		onSubmit({ formData, cancel }) {
			if (!accessToken) {
				cancel();
			}
			formData.set('accessToken', accessToken);
		}
	});

	const { form: formData, isTainted, tainted, allErrors, delayed, enhance } = form;

	onMount(() => {
		const url = new URL(window.location.href);
		const queryParams = new URLSearchParams(url.search);
		accessToken = queryParams.get('token') || 'No token provided';
	});
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
			</Card.Header>
			<Card.Content class="grid gap-4">
				<form id="passwordResetForm" method="POST" use:enhance>
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ attrs }: Control)}
								<Form.Label>Password</Form.Label>
								<Input type="password" {...attrs} bind:value={$formData.password} />
								<Form.Description>Create a password for your account.</Form.Description>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</form>
			</Card.Content>
			<Card.Footer class="flex-col">
				<Button
					class="w-full"
					type="submit"
          form="passwordResetForm"
					disabled={$delayed || !isTainted($tainted?.password) || $allErrors.length}
				>
					{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
					Save
				</Button>
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Go to</p>
					<Button class="px-2" variant="link" href="/signin">Sign in</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
