describe("Edit profile", () => {
  beforeEach(() => {
    cy.login("test1@gmail.com", "test1");
    cy.visit("/profile");
    cy.authorise();
  });

  it("Updata data", () => {
    // Initial condition
    cy.get("[data-testid='cy-error-message']").should("not.be.visible");

    // Save wrong email format
    cy.get("[data-testid='cy-name-input']").type("Test 1");
    cy.get("[data-testid='cy-email-input']").type("wrong_format");
    cy.get("[data-testid='cy-save-profile-button']").click();
    cy.get("[data-testid='cy-error-message']").should("be.visible");

    // Save correct format
    cy.get("[data-testid='cy-email-input']").clear();
    cy.get("[data-testid='cy-email-input']").type("test1@gmail.com");
    cy.get("[data-testid='cy-save-profile-button']").click();
    cy.get("[data-testid='cy-error-message']").should("not.be.visible");

    // Check new data is reflected
    cy.get("[data-testid='cy-name-input']").should("have.value", "Test 1");
    cy.get("[data-testid='cy-email-input']").should("have.value", "test1@gmail.com");

    // Clear all inputs
    cy.get("[data-testid='cy-name-input']").clear({ force: true });
    cy.get("[data-testid='cy-email-input']").clear({ force: true });
    cy.get("[data-testid='cy-save-profile-button']").should("be.disabled");
  });
});
