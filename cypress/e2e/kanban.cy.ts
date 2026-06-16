describe("Kanban Board", () => {
  beforeEach(() => {
    cy.visit("/solicitudes");
    cy.wait(500);
  });

  it("debería cargar el tablero kanban", () => {
    cy.contains("Nueva").should("be.visible");
  });

  it("debería mostrar columnas kanban para cada estado", () => {
    cy.get("span[role='status']").should("exist");
  });

  it("debería tener un campo de búsqueda", () => {
    cy.get('input[type="search"]').should("be.visible");
  });

  it("debería tener un botón para nueva solicitud", () => {
    cy.contains("button", "Nueva Solicitud").should("be.visible");
  });

  it("debería abrir el modal de nueva solicitud al hacer clic en el botón", () => {
    cy.contains("button", "Nueva Solicitud").click();
    cy.contains("Crear Nueva Solicitud").should("be.visible");
  });

  it("debería abrir el modal de detalle al hacer clic en una tarjeta", () => {
    cy.get('[data-cy="kanban-card"]').first().click();
    cy.get('[data-cy="solicitud-modal"]').should("be.visible");
  });

  it("debería filtrar solicitudes por búsqueda", () => {
    cy.get('input[type="search"]').type("Laptop");
    cy.wait(500);
  });
});
