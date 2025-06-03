<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import BasicInfoForm from '$lib/components/register-form/basic-info-form.svelte';
	import ActivationForm from '$lib/components/register-form/activation-form.svelte';
	import PasswordForm from '$lib/components/register-form/password-form.svelte';
	import Logo from '$lib/components/logo.svelte';
	import Google from '$lib/components/icons/google.svelte';

  interface Props {
    data: PageData;
  }

	let { data }: Props = $props();

	let step = $state(1);
	let email: string | undefined = $state(undefined);
	let activationCodeResendAt: Date | undefined = $state(undefined);
	let accessToken: string = $state('');

	function setDataForActivationStep(userEmail: string, userActivationCodeResendAt: Date) {
		step = 2;
		email = userEmail;
		activationCodeResendAt = new Date(userActivationCodeResendAt);
	}

	function setAccessToken(token: string) {
		step = 3;
		accessToken = token;
	}
</script>

<svelte:head>
	<title>Budget App - Sign Up</title>
</svelte:head>

<div class="container flex h-full items-center justify-center">
	<div class="w-full md:w-96">
		<Card.Root>
			<Card.Header class="space-y-1">
				<p class="mb-4 flex justify-center">
					<Logo />
				</p>
				<Card.Title class="text-2xl">Create an account</Card.Title>
				{#if step === 1}
					<Card.Description>Sign up to create your account</Card.Description>
				{:else if step === 2}
					<Card.Description>Enter the activation code sent to your email</Card.Description>
				{:else if step === 3}
					<Card.Description>Set a password for your account</Card.Description>
				{/if}
			</Card.Header>
			<Card.Content class="grid gap-4 pb-0">
				{#if step === 1}
					<Button variant="outline" class="mb-4 w-full" href="/auth/google">
						<Google class="mr-2 h-4 w-4" />
						Google
					</Button>
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t"></span>
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-card px-2 text-muted-foreground"> Or continue with </span>
						</div>
					</div>
					<BasicInfoForm data={data.form} goToNextStep={setDataForActivationStep}></BasicInfoForm>
				{:else if step === 2}
					<ActivationForm
						data={data.activationForm}
						{email}
						{activationCodeResendAt}
						goToNextStep={setAccessToken}
					></ActivationForm>
				{:else if step === 3}
					<PasswordForm data={data.passwordForm} {accessToken} saveButtonText="Next"></PasswordForm>
				{/if}
			</Card.Content>
			<Card.Footer class="flex-col">
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Have an account already?</p>
					<Button class="ml-1 p-0" variant="link" href="/signin">Sign in</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
