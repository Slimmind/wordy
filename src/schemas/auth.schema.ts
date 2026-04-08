import { z } from 'zod';

/** Schema for auth user stored in Redux */
export const AuthUserSchema = z.object({
	uid: z.string(),
	displayName: z.string().nullable(),
	email: z.string().nullable(),
	photoURL: z.string().nullable(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
