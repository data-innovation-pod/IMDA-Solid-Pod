/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    authorise(): Chainable<void>;
  }
}

Cypress.Commands.add("login", (email, password) => {
  // Login page
  cy.visit("/");
  cy.get("[data-testid='cy-login-button']").click();

  // CSS login page
  cy.origin(
    "http://localhost:3000/.account/login/",
    {
      args: { email, password },
    },
    ({ email, password }) => {
      cy.get("#email").type(email);
      cy.get("#password").type(password);
      cy.get('[type="submit"]').click();
    }
  );

  // CSS authorise page
  cy.origin("http://localhost:3000/.account/oidc/consent/", () => {
    cy.get("#webIdList > :nth-child(1) > label").click();
    cy.get('[type="submit"]').click();
  });
});

Cypress.Commands.add("authorise", () => {
  // CSS authorise page
  cy.origin("http://localhost:3000/.account/oidc/consent/", () => {
    cy.get("#webIdList > :nth-child(1) > label").click();
    cy.get('[type="submit"]').click();
  });
});
