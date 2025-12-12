describe('User Login', () => {
  const validMember = {
    email: 'robin@gmail.com',   // Ensure this user exists in your DB
    password: 'Robin@01',
  };

  const validAdmin = {
    email: 'chalo@gmail.com',    // Ensure this admin exists
    password: 'Chalo@01',
  };

  const invalidCreds = {
    email: 'wrong@example.com',
    password: 'wrongpass',
  };

  beforeEach(() => {
    cy.visit('/login');                    // Auth page
    localStorage.clear();
    cy.clearCookies();
  });

  it('should display the login form correctly', () => {
    // Check default active tab (login)
    cy.get('[data-cy="tab-login"]').should('have.attr', 'data-state', 'active');
    cy.contains('Email').should('be.visible');
    cy.contains('Password').should('be.visible');
    cy.contains('Sign In').should('be.visible').and('be.enabled');
  });

  it('should toggle password visibility', () => {
    cy.get('input[placeholder="••••••••"]').type(validMember.password);
    cy.get('input[placeholder="••••••••"]').should('have.attr', 'type', 'password');

    // Click the eye icon (inside the relative div)
    cy.get('input[placeholder="••••••••"]').parent().find('button').click();
    cy.get('input[placeholder="••••••••"]').should('have.attr', 'type', 'text');
  });

  it('should show validation errors for invalid inputs', () => {
    cy.contains('Sign In').click();

    // Zod errors appear after submit
    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');

    // Fill invalid data
    cy.get('input[type="email"]').type('bad');
    cy.get('input[type="password"]').type('short');
    cy.contains('Sign In').click();

    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should successfully login a member and redirect to dashboard', () => {
    // Broader intercept to catch proxied/relative URLs
    cy.intercept('POST', '**/users/login').as('loginRequest');

    cy.get('input[type="email"]').type(validMember.email);
    cy.get('input[type="password"]').type(validMember.password);
    cy.contains('Sign In').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user') || '{}');
      expect(user.role).to.eq('Member');
    });
  });

  it('should successfully login an admin and redirect to admin panel', () => {
    cy.intercept('POST', '**/users/login').as('loginRequest');

    cy.get('input[type="email"]').type(validAdmin.email);
    cy.get('input[type="password"]').type(validAdmin.password);
    cy.contains('Sign In').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/admin');

    cy.window().then((win) => {
      const user = JSON.parse(win.localStorage.getItem('user') || '{}');
      expect(user.role).to.eq('Admin');
    });
  });

  it('should handle invalid credentials error', () => {
    cy.intercept('POST', '**/users/login').as('loginRequest');

    cy.get('input[type="email"]').type(invalidCreds.email);
    cy.get('input[type="password"]').type(invalidCreds.password);
    cy.contains('Sign In').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    // Adjust based on your AuthContext toast message
    cy.contains('Invalid email or password').should('be.visible');
    // Or if toast shows backend message
    // cy.contains('Invalid credentials').should('be.visible');
  });

it('should show loader during submission', () => {
  // Delay the entire response by 1000ms
  cy.intercept('POST', '/users/login', {
    delay: 1000,  // ← This is the correct modern way
    fixture: null, // or provide a body if needed
  }).as('slowLogin');

  cy.get('input[type="email"]').type(validMember.email);
  cy.get('input[type="password"]').type(validMember.password);
  cy.contains('Sign In').click();

  cy.contains('Signing in...').should('be.visible');
  cy.get('.animate-spin').should('be.visible');
});

  it('should switch to register tab', () => {
    cy.get('[data-cy="tab-register"]').click();
    cy.get('[data-cy="tab-register"]').should('have.attr', 'data-state', 'active');
    cy.contains('Full Name').should('be.visible');
  });
});