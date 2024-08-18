export enum UserSidebarActionTypes {
	Hide,
	Show,
	Toggle
}

export interface UserSidebarAction {
	type: UserSidebarActionTypes;
	payload?: boolean;
	modal_name?: string;
}

export function showUserSidebar(name: string): UserSidebarAction {
	return {
		type: UserSidebarActionTypes.Show,
		payload: true,
		modal_name: name,
	};
}

export function hideUserSidebar(name: string): UserSidebarAction {
	return {
		type: UserSidebarActionTypes.Hide,
		payload: false,
		modal_name: name,
	};
}

export function toggleUserSidebar(name: string): UserSidebarAction {
	return {
		type: UserSidebarActionTypes.Toggle,
		modal_name: name,
	};
}