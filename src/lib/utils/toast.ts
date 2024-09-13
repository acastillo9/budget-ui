import { toast as toastStore } from '../../stores/toast';

function push(type: string, message: string) {
	toastStore.set({ type, message });
}

export const toast = {
	showError: (message: string) => {
		push('error', message);
	},
	showSuccess: (message: string) => {
		push('success', message);
	}
};
