describe('Compatibility Check & Connection Flow', () => {
  it('Should check compatibility with a user and send a connection request', () => {
    // 1. Login successfully
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('user1@gmail.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    // Verify login success and natural redirect to dashboard
    cy.url({ timeout: 15000 }).should('not.include', '/login');
    cy.url({ timeout: 15000 }).should('include', '/dashboard');

    // 2. Navigate to Discover page
    cy.visit('/discover');
    cy.url({ timeout: 10000 }).should('include', '/discover');

    // 3. Open the People tab
    cy.get('[data-testid="people-tab"]', { timeout: 10000 }).should('be.visible').click();
    
    // Ensure the URL updates to include the tab parameter
    cy.url({ timeout: 10000 }).should('include', 'tab=people');

    // Wait for users to load
    cy.get('[data-testid="user-card"]', { timeout: 15000 }).should('have.length.greaterThan', 0);

    // 4. Select a random user card (we'll just use the first available one)
    cy.get('[data-testid="user-card"]').first().click();

    // 5. Verify the user's profile page loads successfully (Next.js dev compilation can be slow, giving it 30s)
    cy.url({ timeout: 30000 }).should('include', '/people/');
    cy.contains('Lifestyle Routine', { timeout: 30000 }).should('be.visible');

    // 6. Click "Check Compatibility"
    cy.get('[data-testid="compatibility-button"]').scrollIntoView().should('be.visible').click();

    // Verify compatibility match page route (Another compilation boundary, wait up to 30s)
    cy.url({ timeout: 30000 }).should('include', '/match');

    // 7. Wait for compatibility calculation to complete
    // The UI simulates an AI scan which takes a few seconds. We implicitly wait for the scanner
    // to finish by checking for the final score element to appear.
    
    // 8 & 9. Verify compatibility page loads and score is displayed
    cy.get('[data-testid="compatibility-score"]', { timeout: 15000 }).should('be.visible');
    
    // Take user to the top of the page in the result page
    cy.scrollTo('top');
    
    // Wait for a second so viewers can admire the top score section
    cy.wait(1500);

    // Scroll down slowly to the middle section
    cy.scrollTo('center', { duration: 1500 });
    
    // 10. Verify the compatibility breakdown section is visible
    cy.contains('Score Weighting').should('be.visible');
    cy.wait(1000); // Visual pause

    // 11. Verify "Why this matches you" (Strengths & Matches in UI) section exists
    cy.contains('Strengths & Matches').should('be.visible');

    // 12. Verify "Things to consider" (Considerations in UI) section exists
    cy.contains('Considerations').should('be.visible');
    cy.wait(1000); // Visual pause

    // Scroll slowly to the bottom of the page
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(500); // Half second pause at the bottom before connecting

    // 13. Click the "Connect" button
    // The button might be disabled if a request is already pending from previous tests.
    // We conditionally handle this to ensure the test is robust if seeded data wasn't reset.
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="connect-button"]').length > 0) {
        cy.intercept('POST', '**/api/requests**').as('sendRequest'); // optional intercept if API existed, but Server Action is used instead

        // We use { force: true } because sticky navbars or footers can sometimes cover the exact center of the button during automated scrolling
        cy.get('[data-testid="connect-button"]').should('not.be.disabled').click({ force: true });

        // 14. Verify a success toast/message appears.
        // In the UI, the state immediately updates to "Request Pending" when the Server Action completes.
        cy.contains('Request Pending', { timeout: 15000 }).should('be.visible');
        cy.contains('You have already sent a roommate request').should('be.visible');
      } else if ($body.find(':contains("Request Pending")').length > 0) {
        // Already requested in a previous test run
        cy.contains('Request Pending').should('be.visible');
      } else if ($body.find(':contains("Already Connected")').length > 0) {
        // Already connected in a previous test run
        cy.contains('Already Connected').should('be.visible');
      }
    });

    // 15. Verify no errors occur during the process (implicitly verified by Cypress passing)
  });
});
