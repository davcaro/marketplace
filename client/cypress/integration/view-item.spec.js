describe('View Item Test', () => {
  beforeEach(() => {
    cy.fixture('item.json').as('itemJSON');
    cy.fixture('user.json').as('userJSON');

    cy.server();

    cy.route({
      url: '/api/items/*',
      response: '@itemJSON'
    }).as('getItem');

    cy.route({
      url: '/api/users/*',
      response: '@userJSON'
    }).as('getUser');
  });

  it('Visits an item', () => {
    cy.visit('/item/0');
  });

  it('Clicking on the user navigates to a new url', () => {
    cy.get('.card-header .header-user').click();
    cy.location('pathname').should('contains', '/user/');
    cy.go('back');
    cy.wait('@getItem');

    cy.get('.quick-chat .header-user').click();
    cy.location('pathname').should('contains', '/user/');
    cy.go('back');
    cy.wait('@getItem');
  });

  it('Clicking on the category navigates to a new url', () => {
    cy.get('.category-link').click();

    cy.location().should(location => {
      expect(location.pathname).to.eq('/search');
      expect(location.search).to.contains('category');
    });

    cy.go('back');
    cy.wait('@getItem');
  });

  it('Clicking on favorite or chat buttons when logged out opens the auth modal', () => {
    cy.get('.favorite-btn').click();
    cy.get('.auth-modal .auth-modal-body').should('be.visible');
    cy.get('.auth-modal .ant-modal-close').click();

    cy.get('.chat-btn').click();
    cy.get('.auth-modal .auth-modal-body').should('be.visible');
    cy.get('.auth-modal .ant-modal-close').click();
  });

  it('Clicking on a predefined message writes it on the input', () => {
    // For each predefined message, click on it and check input value
    cy.get('.quick-message').each(msg => {
      cy.wrap(msg)
        .click()
        .invoke('text')
        .then(text => {
          cy.get('.quickmessage-form input').should('have.value', text.trim());
        });
    });

    cy.get('.quickmessage-form input').clear().type('Test message').should('have.value', 'Test message');
  });

  it('Quick chat opens authentication modal when logged out', () => {
    cy.get('.quickmessage-form .send-btn').click();

    cy.get('.auth-modal').find('.auth-modal-body').should('be.visible');
  });
});
