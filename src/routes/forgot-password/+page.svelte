<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import Logo from '$lib/components/logo.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Control } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { forgotPasswordFormSchema } from './schema';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(forgotPasswordFormSchema)
	});

	const { form: formData, enhance, delayed, isTainted, tainted, allErrors } = form;
</script>

<svelte:head>
	<title>Budget App - Forgot Password</title>
</svelte:head>

<div class="container flex h-full items-center justify-center">
	<div class="w-full md:w-96">
		<Card.Root>
			<Card.Header class="space-y-1">
				<p class="mb-4 flex justify-center">
					<Logo />
				</p>
				<Card.Title class="text-2xl">Forgot password</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<form id="forgotPasswordForm" method="POST" use:enhance>
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ attrs }: Control)}
								<Form.Label>Email</Form.Label>
								<Input
									type="email"
									placeholder="email@example.com"
									{...attrs}
									bind:value={$formData.email}
								/>
								<Form.Description>
									Enter your email address and we will send you a link to reset your password.
								</Form.Description>
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
					form="forgotPasswordForm"
					disabled={$delayed || !isTainted($tainted?.email) || $allErrors.length}
				>
					{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
					Send
				</Button>
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Go to</p>
					<Button class="px-2" variant="link" href="/signin">Sign in</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
