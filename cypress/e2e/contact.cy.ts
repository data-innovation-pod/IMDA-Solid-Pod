describe("Contacts page", () => {
  it("Contacts", () => {
    // Login
    cy.login("test1@gmail.com", "test1");
    cy.visit("/contacts");
    cy.authorise();

    // Initial condition
    cy.get("[data-testid='cy-contact-err-msg']").should("not.exist");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 1);

    // Input invalid webId
    cy.get("[data-testid='cy-contact-dropdown']").invoke("show"); // show contact input dropdown
    cy.get("[data-testid='cy-contact-input']").type("invalid_web_id");
    cy.get("[data-testid='cy-add-contact-btn']").click();
    cy.get("[data-testid='cy-contact-err-msg']").should("exist");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 1);

    // Input own webId
    cy.get("[data-testid='cy-contact-input']").clear();
    cy.get("[data-testid='cy-contact-input']").type("http://localhost:3000/test1pod1/profile/card#me");
    cy.get("[data-testid='cy-add-contact-btn']").click();
    cy.get("[data-testid='cy-contact-err-msg']").should("exist");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 1);

    // Input valid webId
    cy.get("[data-testid='cy-contact-input']").clear();
    cy.get("[data-testid='cy-contact-input']").type("http://localhost:3000/test1pod2/profile/card#me");
    cy.get("[data-testid='cy-add-contact-btn']").click();
    cy.get("[data-testid='cy-contact-err-msg']").should("not.exist");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 2);

    // Input exisiting webId
    cy.get("[data-testid='cy-contact-input']").clear();
    cy.get("[data-testid='cy-contact-input']").type("http://localhost:3000/test1pod2/profile/card#me");
    cy.get("[data-testid='cy-add-contact-btn']").click();
    cy.get("[data-testid='cy-contact-err-msg']").should("exist");
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 2);
    cy.get("[data-testid='cy-contact-dropdown']").invoke("hide"); // hide contact input dropdown

    // Show profile
    cy.get("[data-testid='cy-dropdown-menu-0']").invoke("show"); // show action menu dropdown
    cy.get("[data-testid='cy-profile-btn-0']").click();
    cy.get("[data-testid='cy-profile-modal']").should("be.visible");

    // Delete webId
    cy.get("[data-testid='cy-delete-btn-0']").click();
    cy.get("[data-testid='cy-pod-content']").children().should("have.length", 1);
  });
});
