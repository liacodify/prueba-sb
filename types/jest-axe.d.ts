declare module "jest-axe" {
	import { AxeResults } from "axe-core";
	export function toHaveNoViolations(): void;
	export type JestAxe = (
		container: Element,
	) => Promise<{ passes: AxeResults[]; violations: AxeResults[] }>;
	export const axe: JestAxe;
}
