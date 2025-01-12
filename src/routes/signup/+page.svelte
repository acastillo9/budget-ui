<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import BasicInfoForm from '$lib/components/register-form/basic-info-form.svelte';
	import ActivationForm from '$lib/components/register-form/activation-form.svelte';
	import PasswordForm from '$lib/components/register-form/password-form.svelte';
	import Logo from '$lib/components/logo.svelte';

	let { data }: { data: PageData } = $props();

	let step = $state(1);
	let email: string | undefined = $state(undefined);
	let activationCodeResendAt: Date | undefined = $state(undefined);
	let accessToken: string | undefined = $state(undefined);

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
				<Card.Title class="text-2xl">Create your account</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if step === 1}
					<BasicInfoForm data={data.form} goToNextStep={setDataForActivationStep}></BasicInfoForm>
				{:else if step === 2}
					<ActivationForm
						data={data.activationForm}
						{email}
						{activationCodeResendAt}
						goToNextStep={setAccessToken}
					></ActivationForm>
				{:else if step === 3}
					<PasswordForm data={data.passwordForm} {accessToken}></PasswordForm>
				{/if}
			</Card.Content>
			<Card.Footer>
				<div class="flex items-center">
					<p class="text-sm text-muted-foreground">Have an account already?</p>
					<Button variant="link" href="/signin">Log in</Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
