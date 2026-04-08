/**
 * Router context type for TanStack Router route guards.
 * Provides authentication state to route `beforeLoad` hooks.
 */
export interface RouterContext {
	auth: {
		isAuthenticated: boolean;
		userId: string | null;
	};
}
