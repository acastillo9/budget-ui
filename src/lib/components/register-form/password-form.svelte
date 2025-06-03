<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { passwordSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Control } from 'formsnap';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	interface Props {
		data: SuperValidated<{
			password: string;
		}>;
		accessToken: string;
		saveButtonText?: string;
	}

	let { data, accessToken, saveButtonText }: Props = $props();
	let showPassword = $state(false);

	const form = superForm(data, {
		validators: zodClient(passwordSchema),
		onSubmit({ formData, cancel }) {
			if (!accessToken) {
				cancel();
			}
			formData.set('accessToken', accessToken);
		}
	});

	const { form: formData, isTainted, tainted, allErrors, delayed, enhance } = form;
</script>

<form method="POST" action="?/password" use:enhance>
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

	<Button
		class="mt-5 w-full"
		type="submit"
		disabled={$delayed || !isTainted($tainted?.password) || $allErrors.length}
	>
		{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
		{saveButtonText || 'Save'}
	</Button>
</form>
