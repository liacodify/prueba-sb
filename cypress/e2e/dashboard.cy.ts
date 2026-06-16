describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(500);
  });

  it("debería cargar la página del dashboard", () => {
    cy.get("h1").contains("Panel de Control").should("be.visible");
  });

  it("debería mostrar el título del dashboard", () => {
    cy.contains("h1", "Panel de Control").should("be.visible");
  });

  it("debería mostrar tarjetas de resumen con conteos", () => {
    cy.get('[data-cy="summary-card"]').should("exist");
    cy.get('[data-cy="summary-card"]').should("have.length.greaterThan", 0);
  });

  it("debería navegar a la página de solicitudes", () => {
    cy.get('a[href="/solicitudes"]').first().click({ force: true });
    cy.url().should("include", "/solicitudes");
  });

  it("debería mostrar la lista de solicitudes recientes", () => {
    cy.get('[data-cy="recent-solicitudes"]').should("exist");
  });
});
