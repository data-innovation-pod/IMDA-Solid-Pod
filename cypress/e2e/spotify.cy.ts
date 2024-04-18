describe("Spotify data ingestion", () => {
  it("Spotify", () => {
    // Login and create folder
    cy.login("test1@gmail.com", "test1");
    cy.get("[data-testid='cy-/your-data-link']").click();
    cy.get("[data-testid='cy-create-folder-popup']").invoke("show");
    cy.get("[data-testid='cy-create-folder-input']").type("spotify");
    cy.get("[data-testid='cy-create-folder-btn']").click();

    // Initial condition
    cy.get("[data-testid='cy-/discover-link']").click();
    cy.get("[data-testid='cy-spotify-modal']").should("not.be.visible");

    // Execute import
    cy.get("[data-testid='cy-spotify-connect-btn']").click();
    cy.get("[data-testid='cy-spotify-modal']").should("be.visible");
    cy.get("[data-testid='cy-import-spotify-btn']").should("be.disabled");
    cy.get("[data-testid='cy-show-select-folder-modal-btn']").click();
    cy.get("[data-testid='cy-select-folder-modal']").should("be.visible");
    cy.get("[data-testid='cy-spotify/-folder']").should("contain.text", "spotify/");
    cy.get("[data-testid='cy-select-spotify/-folder-btn']").click();
    cy.get("[data-testid='cy-confirm-folder-btn']").click();
    cy.get("[data-testid='cy-import-spotify-btn']").click();

    // Login with spotify
    cy.origin("https://accounts.spotify.com", () => {
      cy.get("#login-username").type("spotify.test.user.imda@gmail.com");
      cy.get("#login-password").type("test1234!");
      cy.get("#login-button").click();
      cy.get("[data-testid='auth-accept']").click();
    });

    cy.get("cy-spotify-cb-continue-btn", { timeout: 99999999999 }).click();

    // Execute import again
    cy.get("[data-testid='cy-spotify-connect-btn']").click();
    cy.get("[data-testid='cy-spotify-modal']").should("be.visible");
    cy.get("[data-testid='cy-import-spotify-btn']").should("be.disabled");
    cy.get("[data-testid='cy-show-select-folder-modal-btn']").click();
    cy.get("[data-testid='cy-select-folder-modal']").should("be.visible");
    cy.get("[data-testid='cy-spotify/-folder']").should("contain.text", "spotify/");
    cy.get("[data-testid='cy-select-spotify/-folder-btn']").click();
    cy.get("[data-testid='cy-confirm-folder-btn']").click();
    cy.get("[data-testid='cy-import-spotify-btn']").click();
  });
});
