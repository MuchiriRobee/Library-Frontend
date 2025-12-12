describe('User Registration', () => {
  // Generate unique email for each test run
  const generateUniqueEmail = () => `testuser_${Date.now()}@example.com`;

  const testUser = {
    username: 'Test User',
    email: generateUniqueEmail(),
    password: 'StrongPass123',
    confirmPassword: 'StrongPass123',
  };

  beforeEach(() => {
    cy.visit('/login');
    // Switch to Register tab
    cy.contains('button', 'Register').click();
    cy.get('button').contains('Register').should('have.attr', 'data-state', 'active');
  });

  it('should display the registration form correctly', () => {
    cy.contains('Full Name').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('Password').should('be.visible');
    cy.contains('Confirm Password').should('be.visible');

    cy.get('input[placeholder="John Doe"]').should('be.visible').and('have.value', '');
    cy.get('input[placeholder="john@example.com"]').should('be.visible').and('have.value', '');
    cy.get('input[placeholder="Create strong password"]').should('be.visible').and('have.value', '');
    cy.get('input[placeholder="Repeat password"]').should('be.visible').and('have.value', '');

    cy.contains('Create Account').should('be.visible').and('be.enabled');
  });

  it('should toggle password visibility for both fields', () => {
    cy.get('input[placeholder="Create strong password"]').type(testUser.password);
    cy.get('input[placeholder="Repeat password"]').type(testUser.confirmPassword);

    // Initially hidden
    cy.get('input[placeholder="Create strong password"]').should('have.attr', 'type', 'password');
    cy.get('input[placeholder="Repeat password"]').should('have.attr', 'type', 'password');

    // Toggle password field
    cy.get('input[placeholder="Create strong password"]')
      .parent()
      .find('button')
      .click();
    cy.get('input[placeholder="Create strong password"]').should('have.attr', 'type', 'text');

    // Toggle confirm password field
    cy.get('input[placeholder="Repeat password"]')
      .parent()
      .find('button')
      .click();
    cy.get('input[placeholder="Repeat password"]').should('have.attr', 'type', 'text');
  });

  it('should show validation errors for invalid inputs', () => {
    cy.contains('Create Account').click();

    cy.contains('Name must be at least 2 characters').should('be.visible');
    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');

    // Fill partially invalid
    cy.get('input[placeholder="John Doe"]').type('T'); // too short
    cy.get('input[placeholder="john@example.com"]').type('invalid');
    cy.get('input[placeholder="Create strong password"]').type('short');
    cy.get('input[placeholder="Repeat password"]').type('different');

    cy.contains('Create Account').click();

    cy.contains('Name must be at least 2 characters').should('be.visible');
    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
    cy.contains("Passwords don't match").should('be.visible');
  });

  it('should successfully register a new user and switch to login tab', () => {
    cy.intercept('POST', '**/users/register').as('registerRequest');

    cy.get('input[placeholder="John Doe"]').type(testUser.username);
    cy.get('input[placeholder="john@example.com"]').type(testUser.email);
    cy.get('input[placeholder="Create strong password"]').type(testUser.password);
    cy.get('input[placeholder="Repeat password"]').type(testUser.confirmPassword);

    cy.contains('Create Account').click();

    // Wait for successful API call
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);

    // Check success toast from sonner
    cy.contains('Account created successfully! Please sign in.').should('be.visible');

    // Should automatically switch to login tab
    cy.get('button').contains('Log In').should('have.attr', 'data-state', 'active');

    // Form should be reset
    cy.get('[data-cy="tab-login"]').should('have.attr', 'data-state', 'active');  });

  it('should show loader during submission', () => {
    cy.intercept('POST', '**/users/register', {
      delay: 1500, // Simulate slow network
      statusCode: 201,
      body: {
        success: true,
        message: "User registered successfully",
        data: { /* mock user */ }
      }
    }).as('slowRegister');

    cy.get('input[placeholder="John Doe"]').type(testUser.username);
    cy.get('input[placeholder="john@example.com"]').type(testUser.email);
    cy.get('input[placeholder="Create strong password"]').type(testUser.password);
    cy.get('input[placeholder="Repeat password"]').type(testUser.confirmPassword);

    cy.contains('Create Account').click();

    cy.contains('Creating account...').should('be.visible');
    cy.get('.animate-spin').should('be.visible'); // Loader2 icon

    // Wait for mocked response
    cy.wait('@slowRegister');
    cy.contains('Account created successfully! Please sign in.').should('be.visible');
  });

it('should handle duplicate email error gracefully', () => {
  const duplicateEmail = generateUniqueEmail();

  // First registration - success
  cy.intercept('POST', '**/users/register').as('registerRequest');

  cy.get('input[placeholder="John Doe"]').type('First User');
  cy.get('input[placeholder="john@example.com"]').type(duplicateEmail);
  cy.get('input[placeholder="Create strong password"]').type(testUser.password);
  cy.get('input[placeholder="Repeat password"]').type(testUser.confirmPassword);
  cy.contains('Create Account').click();

  cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
  cy.contains('Account created successfully! Please sign in.').should('be.visible');
  cy.get('button').contains('Log In').should('have.attr', 'data-state', 'active');

  // Second attempt - duplicate email
  cy.visit('/login');
  cy.contains('button', 'Register').click();

  cy.get('input[placeholder="John Doe"]').type('Second User');
  cy.get('input[placeholder="john@example.com"]').type(duplicateEmail);
  cy.get('input[placeholder="Create strong password"]').type(testUser.password);
  cy.get('input[placeholder="Repeat password"]').type(testUser.confirmPassword);
  cy.contains('Create Account').click();

  cy.wait('@registerRequest').its('response.statusCode').should('eq', 400);

  // Only error toast
  cy.contains('Email already registered').should('be.visible');

  // No success toast
  cy.contains('Account created successfully! Please sign in.').should('not.exist');

  // Still on register tab
  cy.get('button').contains('Register').should('have.attr', 'data-state', 'active');
});

  // Optional: Add this if you want to navigate back
  it('should have working "Back to Home" link', () => {
    cy.contains('Back to Home').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});