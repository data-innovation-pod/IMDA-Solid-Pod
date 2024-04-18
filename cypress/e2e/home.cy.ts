describe("Home page", () => {
  it("Normal login", () => {
    cy.login("test1@gmail.com", "test1");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length.above", 1);
  });

  it("Invalid credentials during login", () => {
    // Login page
    cy.visit("/");
    cy.get("[data-testid='cy-login-button']").click();

    // CSS login page
    cy.origin("http://localhost:3000/.account/login/", () => {
      cy.get("#email").type("test1@gmail.com");
      cy.get("#password").type("wrong");
      cy.get('[type="submit"]').click();
    });

    cy.origin("http://localhost:3000/.account/login/", () => {
      cy.get("#error").should("contain.text", "Invalid email/password combination.");
    });
  });

  it("Cancel in CSS login page", () => {
    // Login page
    cy.visit("/");
    cy.get("[data-testid='cy-login-button']").click();

    // CSS login page
    cy.origin("http://localhost:3000/.account/login/", () => {
      cy.get("#cancel").click();
    });

    // Login page
    cy.url().should("contain", "http://localhost:3001");
  });

  it("Cancel in CSS authorise page", () => {
    // Login page
    cy.visit("/");
    cy.get("[data-testid='cy-login-button']").click();

    // CSS login page
    cy.origin("http://localhost:3000/.account/login/", () => {
      cy.get("#email").type("test1@gmail.com");
      cy.get("#password").type("test1");
      cy.get('[type="submit"]').click();
    });

    // CSS authorise page
    cy.origin("http://localhost:3000/.account/oidc/consent/", () => {
      cy.get("#cancel").click();
    });

    // Login page
    cy.url().should("contain", "http://localhost:3001");
  });
});
