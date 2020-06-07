describe('Search Test', () => {
  it('Visits the Marketplace Search page', () => {
    cy.visit('/search');
  });

  it('Apply Category filter', () => {
    cy.get('.category-filter').click();

    // Contains categories
    cy.get('.categories-wall').find('.category-col').its('length').should('be.gt', 1);

    cy.get('.categories-wall .category-col:first-child').click();

    cy.location('search').should('contains', 'category');
  });

  it('Apply Price filter', () => {
    cy.get('.price-filter').click();

    cy.get('.min-price input').clear().type('4000');
    cy.get('.max-price input').clear().type('18000');

    cy.get('.close-popover a').click();

    cy.location('search').should('contains', 'min_price=4000');
    cy.location('search').should('contains', 'max_price=18000');
  });

  it('Apply Publication date filter', () => {
    cy.get('.date-filter').click();

    cy.get('.date-list li').its('length').should('be.eq', 4);
    cy.get('.date-list li').last().click();

    cy.get('.close-popover a').click();

    cy.location('search').should('contains', 'published=3m');
  });

  it('Apply Location filter', () => {
    cy.get('.location-filter').click();

    cy.contains('30 Km').click();

    cy.get('.close-popover a').click();

    cy.location('search').should('contains', 'distance=30');
  });

  it('Apply Order filter', () => {
    cy.get('.order-filter').scrollIntoView().click();

    cy.get('.order-list li').its('length').should('be.eq', 4);
    cy.get('.order-list li').first().click();

    cy.get('.close-popover a').click();

    cy.location('search').should('contains', 'order=newest');
  });

  it('Clear all filter', () => {
    cy.get('.clear-filters').scrollIntoView().click();

    cy.location().should(location => {
      expect(location.pathname).to.eq('/search');
      expect(location.search).to.not.contains('category');
      expect(location.search).to.not.contains('min_price');
      expect(location.search).to.not.contains('max_price');
      expect(location.search).to.not.contains('published');
      expect(location.search).to.not.contains('latitude');
      expect(location.search).to.not.contains('longitude');
      expect(location.search).to.not.contains('distance');
      expect(location.search).to.not.contains('order');
    });
  });
});
