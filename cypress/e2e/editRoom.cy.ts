describe('Edit Room and Verify Persistence', () => {
  it('Should edit a room facility and verify it persists after reload', () => {
    // 1. Login successfully.
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('user1@gmail.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    // Verify login success and redirected to dashboard or discover
    cy.url({ timeout: 15000 }).should('not.include', '/login');

    // 2. Wait for dashboard to load (since login redirects here via callbackUrl)
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
    cy.get('[data-testid="my-rooms-button"]', { timeout: 10000 }).should('be.visible');

    // Intercept room fetch requests for waiting
    cy.intercept('GET', '/dashboard/my-rooms*').as('getMyRooms');

    // 3. Click "My Rooms".
    cy.get('[data-testid="my-rooms-button"]').click();
    
    // Wait for the rooms page to load
    cy.url({ timeout: 15000 }).should('include', '/dashboard/my-rooms');
    
    // 4. Open one of the user's rooms.
    cy.get('[data-testid="room-card"]', { timeout: 15000 }).first().should('be.visible').click();

    // 5. Click Edit Room.
    cy.get('[data-testid="edit-room-button"]', { timeout: 10000 }).should('be.visible').click();

    // Ensure we are on the edit page
    cy.url({ timeout: 15000 }).should('include', '/edit');

    // Wait for form to populate (just checking a facility button exists)
    cy.get('[data-testid="facility-laundry"]', { timeout: 10000 }).should('exist');

    // 6. Modify at least one facility. (Toggle "laundry")
    // Store the initial state using an alias instead of a nested .then() block
    cy.get('[data-testid="facility-laundry"]').invoke('attr', 'class').as('initialClassList');

    // Add a short visual pause so viewers can see what's about to happen
    cy.wait(1000);

    // Toggle the facility
    cy.get('[data-testid="facility-laundry"]').click();

    // Add a short visual pause so viewers can see the state change
    cy.wait(1000);

    // Intercepts for Server Actions can be flaky, so we rely on the success toast instead

    // 7. Save changes.
    // Ensure the button is enabled before clicking (React Hook Form state update delay)
    cy.get('[data-testid="save-room-button"]').should('not.be.disabled').click();

    // 8. Verify success toast appears.
    cy.contains('Room Updated', { timeout: 15000 }).should('be.visible');

    // Wait for the room page redirect
    cy.url({ timeout: 15000 }).should('not.include', '/edit');

    // 9. Reload the page (we are on the public room details page now)
    cy.reload();

    // 10. Scroll down to facilities section so viewers can see it
    cy.wait(1000); // Visual pause
    cy.contains('Facilities').scrollIntoView();
    cy.wait(1000); // Visual pause

    // 11. Verify the modified facility state directly on the public page
    cy.get('@initialClassList').then((initialClassList) => {
      // If it was selected initially, it was toggled OFF, so it should NOT exist now.
      // If it was NOT selected initially, it was toggled ON, so it SHOULD exist now.
      const isSelectedInitially = String(initialClassList).includes('text-[rgb(29,93,185)]');
      
      if (isSelectedInitially) {
        cy.get('[data-testid="room-facility-laundry"]', { timeout: 10000 }).should('not.exist');
      } else {
        cy.get('[data-testid="room-facility-laundry"]', { timeout: 10000 }).should('be.visible');
      }
    });
  });
});
