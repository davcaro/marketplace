describe('Landing Page Test', () => {
  it('Visits the Marketplace', () => {
    cy.visit('');
  });

  it('Contains categories', () => {
    cy.get('.category-col').its('length').should('be.gt', 1);
  });

  it('Clicking on a category navigates to a new url', () => {
    cy.get('.category-col:first-child').click();

    cy.location('pathname').should('eq', '/search');
  });

  it('Can perfom a search', () => {
    cy.visit('');

    cy.get('.search .search-box .keywords-item input').type('bmw').should('have.value', 'bmw').type('{enter}');

    cy.location().should(location => {
      expect(location.pathname).to.eq('/search');
      expect(location.search).to.contains('keywords=bmw');
    });
  });

  it('Clicking on login button opens a modal', () => {
    cy.visit('');

    cy.get('.header-right .login-btn').click();

    cy.get('.auth-modal').find('.auth-modal-body').should('be.visible');
  });

  it('Clicking on upload item button when logged out opens the login modal', () => {
    cy.visit('');

    cy.get('.header-right .upload-item-btn').click();

    cy.get('.auth-modal').find('.auth-modal-body').should('be.visible');
  });

  it('Header collapses on small devices', () => {
    cy.visit('');

    // Header is not collapsed on medium devices and above
    cy.viewport('ipad-2');
    cy.get('.header-right').should('be.visible');
    cy.get('.collapsed-menu').should('not.be.visible');

    // Header is collapsed on small devices
    cy.viewport('iphone-xr');
    cy.get('.header-right').should('not.be.visible');
    cy.get('.collapsed-menu').should('be.visible');
  });
});
