describe('Authentication Flow', () => {
  it('Redirects unauthenticated user to login and allows them to log in', () => {
    // 1. User visits / while not authenticated
    cy.visit('/');
    cy.wait(2000);

    // 2. User visits /discover while not authenticated
    cy.visit('/discover');
    cy.wait(1000);
    
    // 2. User should automatically be redirected to the login page
    cy.url().should('include', '/login');
    
    // 3. Login using the seeded account
    cy.get('[data-testid="email-input"]').type('user1@gmail.com');
    cy.get('[data-testid="password-input"]').type('password');
    
    // 4. Submit the login form
    cy.get('[data-testid="login-button"]').click();
    
    // 5. Verify the user is redirected back to the Discover page
    cy.url({ timeout: 15000 }).should('include', '/discover');
    
    // 6. Verify Discover page content is visible
    cy.get('[data-testid="discover-page"]').should('be.visible');
  });
});
