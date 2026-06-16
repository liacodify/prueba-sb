/// <reference types="jest" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom";

declare global {
	namespace jest {
		interface Matchers<R, T>
			extends TestingLibraryMatchers<unknown, R> {}
	}
}
