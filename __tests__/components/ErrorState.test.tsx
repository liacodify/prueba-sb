import { screen } from "@testing-library/react";
import { ErrorState } from "@/components/shared/ErrorState";
import { renderWithProviders } from "../utils/render-with-providers";

describe("ErrorState", () => {
	it("renderiza título y mensaje por defecto", () => {
		renderWithProviders(<ErrorState />);
		expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
		expect(
			screen.getByText("Error al procesar la solicitud"),
		).toBeInTheDocument();
	});

	it("renderiza título y mensaje personalizado", () => {
		renderWithProviders(
			<ErrorState
				title="Error personalizado"
				message="Mensaje de error personalizado"
			/>,
		);
		expect(screen.getByText("Error personalizado")).toBeInTheDocument();
		expect(
			screen.getByText("Mensaje de error personalizado"),
		).toBeInTheDocument();
	});

	it("renderiza botón de reintento cuando se proporciona onRetry", () => {
		const onRetry = jest.fn();
		renderWithProviders(<ErrorState onRetry={onRetry} />);
		const button = screen.getByText("Reintentar");
		expect(button).toBeInTheDocument();
		button.click();
		expect(onRetry).toHaveBeenCalled();
	});

	it("no renderiza botón de reintento cuando no se proporciona onRetry", () => {
		renderWithProviders(<ErrorState />);
		expect(screen.queryByText("Reintentar")).not.toBeInTheDocument();
	});
});
