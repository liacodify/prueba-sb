describe("Gestor de Solicitudes - E2E", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.wait(2000);
	});

	describe("Dashboard", () => {
		it("carga y muestra el dashboard", () => {
			cy.get("body").should("contain", "Panel de Control");
		});

		it("tiene tarjetas de resumen por estado", () => {
			cy.get("body").should("contain", "Pendiente");
			cy.get("body").should("contain", "En Revisión");
			cy.get("body").should("contain", "Aprobada");
		});

		it("muestra últimas solicitudes", () => {
			cy.get("body").should("contain", "Recientes");
		});

		it("navega a solicitudes desde el dashboard", () => {
			cy.get('a[href="/solicitudes"]').first().click({ force: true });
			cy.url().should("include", "/solicitudes");
		});
	});

	describe("Bandeja Kanban", () => {
		beforeEach(() => {
			cy.visit("/solicitudes");
			cy.wait(2000);
		});

		it("carga la página de solicitudes", () => {
			cy.get("body").should("not.be.empty");
		});

		it("tiene campo de búsqueda", () => {
			cy.get('input[type="search"]').should("exist");
		});

		it("busca por título", () => {
			cy.get('input[type="search"]').type("Laptop");
			cy.wait(500);
		});

		it("tiene botón de filtros", () => {
			cy.get('button svg[class*="lucide"]').should("exist");
		});

		it("muestra columnas Kanban en desktop", () => {
			cy.viewport(1280, 720);
			cy.get("span[role='status']").should("exist");
		});

		it("tiene botón para nueva solicitud", () => {
			cy.contains("button", "Nueva").should("exist");
		});
	});

	describe("Formulario de Nueva Solicitud", () => {
		it("carga formulario de creación", () => {
			cy.visit("/solicitudes/new");
			cy.wait(2000);
			cy.get("body").should("contain", "Crear");
		});

		it("tiene campos obligatorios", () => {
			cy.visit("/solicitudes/new");
			cy.wait(1000);
			cy.get('input[name="title"]').should("exist");
			cy.get('textarea[name="description"]').should("exist");
		});
	});

	describe("Navegación", () => {
		it("navega entre páginas", () => {
			cy.get('a[href="/solicitudes"]').first().click({ force: true });
			cy.url().should("include", "/solicitudes");
			cy.go("back");
			cy.wait(1000);
		});
	});
});
