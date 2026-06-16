import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { renderWithProviders } from "../utils/render-with-providers";

describe("DeleteConfirmationDialog", () => {
	it("renderiza el botón de eliminar", () => {
		renderWithProviders(<DeleteConfirmationDialog onConfirm={() => {}} />);
		expect(
			screen.getByRole("button", { name: /Eliminar/i }),
		).toBeInTheDocument();
	});

	it("muestra 'Cargando...' cuando isPending es true", () => {
		renderWithProviders(
			<DeleteConfirmationDialog onConfirm={() => {}} isPending={true} />,
		);
		expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
	});

	it("deshabilita el botón cuando isPending es true", () => {
		renderWithProviders(
			<DeleteConfirmationDialog onConfirm={() => {}} isPending={true} />,
		);
		expect(screen.getByRole("button", { name: /Cargando.../i })).toBeDisabled();
	});
});
