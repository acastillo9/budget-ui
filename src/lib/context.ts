import { getContext, setContext } from 'svelte';
import type { UserSession } from './types';

const key = 'user';

export function setUserContext(user: UserSession) {
	setContext(key, user);
}

export function getUserContext(): UserSession {
	return getContext(key);
}
