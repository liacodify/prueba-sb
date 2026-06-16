/// <reference types="cypress" />

Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

let failures: string[] = [];

Cypress.Commands.add("scrollToTop", () => {
  cy.scrollTo("top");
});

Cypress.on("fail", (error, runnable) => {
  let message = error.message;

  const translations: [RegExp, string][] = [
    [/expected "([^"]+)"/gi, 'esperado "$1"'],
    [/to equal/gi, "ser igual a"],
    [/to be/gi, "ser"],
    [/to contain/gi, "contener"],
    [/to have length/gi, "tener longitud"],
    [/to be visible/gi, "ser visible"],
    [/to be hidden/gi, "ser oculto"],
    [/to be checked/gi, "estar marcado"],
    [/to be unchecked/gi, "estar desmarcado"],
    [/to be disabled/gi, "estar deshabilitado"],
    [/to be enabled/gi, "estar habilitado"],
    [/to exist/gi, "existir"],
    [/to not exist/gi, "no existir"],
    [/received/gi, "recibido"],
    [/expected/gi, "esperado"],
    [/assertions/gi, "afirmaciones"],
    [/Timing/gi, "Tiempo"],
    [/Failed retry/gi, "Reintento fallido"],
    [/but/gi, "pero"],
    [/and/gi, "y"],
    [/\.should\(/g, ".debería("],
    [/\.expect\(/g, ".esperar("],
  ];

  translations.forEach(([pattern, replacement]) => {
    message = message.replace(pattern, replacement);
  });

  error.message = message;
  throw error;
});

Cypress.on("uncaught:exception", (err, runnable) => {
  let message = err.message;
  const translations: [RegExp, string][] = [
    [/expected/gi, "esperado"],
    [/to be/gi, "ser"],
    [/to equal/gi, "igual a"],
    [/received/gi, "recibido"],
  ];

  translations.forEach(([pattern, replacement]) => {
    message = message.replace(pattern, replacement);
  });

  err.message = message;
});

export {};
