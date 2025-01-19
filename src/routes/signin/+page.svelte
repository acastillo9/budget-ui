<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { loginFormSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Control } from 'formsnap';
	import type { PageData } from './$types';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Logo from '$lib/components/logo.svelte';
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	let { data }: { data: PageData } = $props();
	let showPassword = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(loginFormSchema)
	});

	const { form: formData, enhance, delayed, isTainted, tainted, allErrors } = form;
</script>

<svelte:head>
	<title>Budget App - Sign In</title>
</svelte:head>

<div class="container flex h-full items-center justify-center">
	<div class="w-full md:w-96">
		<Card.Root>
			<Card.Header class="space-y-1">
				<p class="mb-4 flex justify-center">
					<Logo />
				</p>
				<Card.Title class="text-2xl">Sign In</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<form id="loginForm" method="POST" use:enhance>
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
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ attrs }: Control)}
								<Form.Label>Password</Form.Label>
								<div class="relative">
									<Input
										type={showPassword ? 'text' : 'password'}
										{...attrs}
										bind:value={$formData.password}
									/>
									<Button
										class="absolute right-0 top-0 border-none bg-transparent hover:bg-transparent"
										variant="outline"
										size="icon"
										onclick={() => (showPassword = !showPassword)}
									>
										{#if showPassword}
											<EyeOff />
										{:else}
											<Eye />
										{/if}
									</Button>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="rememberMe">
						<Form.Control>
							{#snippet children({ attrs }: Control)}
								<Checkbox {...attrs} />
								<Form.Label>Remember me</Form.Label>
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
					form="loginForm"
					disabled={$delayed ||
						!isTainted($tainted?.email) ||
						!isTainted($tainted?.password) ||
						$allErrors.length}
				>
					{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
					Login
				</Button>
				<Button variant="link" class="w-full" href="/forgot-password">Forgot password?</Button>
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Don't have an account?</p>
					<Button variant="link" href="/signup">Sign up</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
