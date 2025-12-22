describe('Member Dashboard and Sidebar Navigation', () => {
  const memberCreds = {
    email: 'tony@gmail.com',
    password: 'Tony@01',
  };

  beforeEach(() => {
    // Login as member
    cy.visit('/login');
    cy.get('input[type="email"]').type(memberCreds.email);
    cy.get('input[type="password"]').type(memberCreds.password);
    cy.contains('Sign In').click();
    cy.url().should('include', '/dashboard');
    cy.viewport(1280,720);  
    
    // Clear any storage if needed, but usually not
    // localStorage.clear();
  });

  it('should display the dashboard correctly after login', () => {
    // Welcome message
    cy.contains('Welcome back,').should('be.visible'); // Partial, as username may vary
    cy.contains('You are logged in as Member').should('be.visible');

    // Stats cards
    cy.contains('Total Books').should('be.visible');
    cy.contains('Available Now').should('be.visible');
    // If loading, wait or check values (assume data exists)
    cy.get('.text-3xl.font-bold').should('have.length.gte', 2); // Value elements

    // Latest reviews section
    cy.contains('Latest Member Reviews').should('be.visible');
    // If no reviews: cy.contains('No reviews yet').should('be.visible');
    // Or check for review cards if data exists
    cy.get('.grid.gap-6.md\\:grid-cols-2').find('.hover\\:shadow-lg').should('exist'); // Review cards

    // Footer message
    cy.contains('Explore the library — your next favorite book is waiting').should('be.visible');
  });

  it('should navigate to Browse Books page from sidebar', () => {
    // Click sidebar link
    cy.contains('Browse Books').click();
    cy.url().should('include', '/books');

    // Verify key elements on Books page
    cy.contains('Browse Books').should('be.visible'); // Header
    cy.get('input[placeholder="Search by title or author..."]').should('be.visible');
    cy.contains('All Genres').should('be.visible'); // Select trigger
    // Book grid
    cy.get('.grid.grid-cols-1').find('.group').should('exist'); // Book cards
    cy.contains('Borrow').should('be.visible'); // Button in cards
  });

  it('should navigate to My Borrows page from sidebar', () => {
    // Click sidebar link
    cy.contains('My Borrows').click();
    cy.url().should('include', '/borrow-history');

    // Verify key elements on Borrows page
    cy.contains('Borrow History').should('be.visible'); // Header
    cy.contains('Your Borrow Records').should('be.visible');
    // If no borrows: cy.contains('No borrow history yet').should('be.visible');
    // Table
    cy.get('table').should('exist');
    cy.contains('Book Title').should('be.visible'); // Header cell
    cy.contains('Return Book').should('be.visible'); // If applicable
  });

  it('should handle System Settings dropdown in sidebar', () => {
    // Open dropdown
    cy.contains('System Settings').click();
    // Check items
    cy.contains('Theme & Appearance').should('be.visible');
    cy.contains('Date Format').should('be.visible');

    
  });

  it('should logout from sidebar and redirect to login', () => {
    // Click logout
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
    cy.contains('Sign In').should('be.visible'); // Back on auth page

    // Verify localStorage cleared (assuming AuthContext clears it)
    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null;
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should show loading states if data is slow', () => {
    // Intercept and delay API calls
    cy.intercept('GET', '**/books', { delay: 1000 }).as('getBooks');
    cy.intercept('GET', '**/comments', { delay: 1000 }).as('getComments');

    // Reload to trigger
    cy.reload();
    cy.contains('Loading...').should('be.visible'); // Stats loading
    cy.contains('Loading reviews...').should('be.visible');

    // Wait for resolution
    cy.wait('@getBooks');
    cy.wait('@getComments');
    cy.contains('Total Books').should('be.visible');
  });

  it('should handle no data scenarios gracefully', () => {
    // Mock empty responses (if DB has no data, this verifies messages)
    cy.intercept('GET', '**/books', { body: { data: [] } }).as('emptyBooks');
    cy.intercept('GET', '**/comments', { body: { data: [] } }).as('emptyComments');

    cy.reload();
    cy.wait('@emptyBooks');
    cy.wait('@emptyComments');

    cy.contains('0').should('have.length.gte', 1); // Stats show 0
    cy.contains('No reviews yet').should('be.visible');
  });
});