declare global {
	/**
	 * Creates a new type that includes all properties of `U` except for the
	 * property named `T`.
	 *
	 * @param U The original type containing the properties.
	 * @param T The property name to exclude from the new type. Must be a valid
	 * key of `U`.
	 *
	 * @example
	 *
	 * ```typescript
	 * interface User {
	 *   name: string;
	 *   age: number;
	 *   email: string;
	 * }
	 *
	 * type UserWithoutName = ExcludeProperties<User, 'name'>;
	 *
	 * const user: UserWithoutName = {
	 *   age: 25, // valid
	 *   email: 'john.doe@example.com', // valid
	 *   // name: 'John Doe', // error: property 'name' is excluded
	 * };
	 * ```
	 */
	type ExcludeProperties<U, T extends keyof U> = {
		[K in keyof U as K extends T ? never : K]: U[K];
	};
}

export {};