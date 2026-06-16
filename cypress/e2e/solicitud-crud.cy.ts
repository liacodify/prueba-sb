describe("Solicitud CRUD", () => {
  beforeEach(() => {
    cy.visit("/solicitudes");
    cy.wait(500);
  });

  describe("Crear Solicitud", () => {
    it("debería abrir el modal de creación y llenar el formulario", () => {
      cy.contains("button", "Nueva Solicitud").click();
      cy.contains("Crear Nueva Solicitud").should("be.visible");

      cy.get('input[name="title"]').type("Título de Prueba");
      cy.get('input[name="requester"]').type("Usuario de Prueba");
      cy.get('textarea[name="description"]').type("Descripción de prueba para la solicitud");

      cy.get('[data-slot="select-trigger"]').eq(0).click({ force: true });
      cy.contains("Hardware").click({ force: true });
      cy.get('[data-slot="select-trigger"]').eq(1).click({ force: true });
      cy.contains("Alta").click({ force: true });
    });

    it("debería mostrar errores de validación al enviar formulario vacío", () => {
      cy.contains("button", "Nueva Solicitud").click();
      cy.contains("button", "Crear").click();
      cy.contains("El título debe tener al menos 5 caracteres").should("be.visible");
    });
  });

  describe("Editar Solicitud", () => {
    it("debería abrir el modal de edición desde la vista de detalle", () => {
      cy.get('[data-cy="kanban-card"]').first().click();
      cy.get('[data-cy="solicitud-modal"]').should("be.visible");
      cy.contains("button", "Editar").click();
      cy.contains("Editar Solicitud").should("be.visible");
    });

    it("debería actualizar el título y guardar", () => {
      cy.get('[data-cy="kanban-card"]').first().click();
      cy.contains("button", "Editar").click();
      cy.get('input[name="title"]').clear().type("Título Actualizado");
      cy.contains("button", "Guardar").click();
      cy.contains("Solicitud actualizada").should("be.visible");
    });
  });

  describe("Eliminar Solicitud", () => {
    it("debería eliminar una solicitud", () => {
      cy.get('[data-cy="kanban-card"]').first().click();
      cy.get('[data-cy="solicitud-modal"]').should("be.visible");
      cy.contains("button", "Eliminar").click();
      cy.get('button').contains("Eliminar").click({ force: true });
      cy.contains("Solicitud eliminada").should("be.visible");
    });
  });

  describe("Cambios de Estado", () => {
    it("debería cambiar estado de una solicitud", () => {
      cy.get('[data-cy="kanban-card"]').first().click();
      cy.get('[data-cy="solicitud-modal"]').should("be.visible");
      cy.get("button").contains(/Aprobar|Rechazar|Mover a Revisión|Reabrir/).click({ force: true });
    });
  });
});
