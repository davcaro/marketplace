describe('View User Test', () => {
  beforeEach(() => {
    cy.fixture('user.json').as('userJSON');
    cy.fixture('userItems.json').as('userItemsJSON');
    cy.fixture('userScore.json').as('userScoreJSON');
    cy.fixture('userReviews.json').as('userReviewsJSON');
    cy.fixture('item.json').as('itemJSON');

    cy.server();

    cy.route({
      url: '/api/users/*',
      response: '@userJSON'
    }).as('getUser');

    cy.route({
      url: '/api/users/*/items*',
      response: '@userItemsJSON'
    }).as('getUserItems');

    cy.route({
      url: '/api/users/*/reviews',
      response: '@userReviewsJSON'
    }).as('getUserReviews');

    cy.route({
      url: '/api/users/*/score',
      response: '@userScoreJSON'
    }).as('getUserScore');

    cy.route({
      url: '/api/items/*',
      response: '@itemJSON'
    }).as('getItem');
  });

  it('Visits a user', () => {
    cy.visit('/user/0');
  });

  it('Clicking on an item navigates to a new url', () => {
    cy.get('.item').its('length').should('be.eq', 5);
    cy.get('.item').first().click();

    cy.location('pathname').should('contains', '/item/');
    cy.go('back');
    cy.wait('@getUserItems');
  });

  it('Clicking on the next page button sends a new request', () => {
    cy.get('nz-pagination .ant-pagination-next').click();
    cy.get('@getUserItems').should(req => {
      expect(req.url).to.contains('offset=5');
    });
  });

  it('Clicking on the sold items tab shows items', () => {
    cy.get('.ant-tabs-tab').eq(1).click();
    cy.get('.item').its('length').should('be.eq', 5);
  });

  it('Clicking on the reviews tab shows reviews', () => {
    cy.get('.ant-tabs-tab').eq(2).click();
    cy.get('.review').its('length').should('be.eq', 5);
  });

  it('Hides the user info in another tab in small devices', () => {
    // User info is visible in medium devices and above
    cy.viewport('ipad-2');
    cy.get('.user-card').should('be.visible');
    cy.get('.location-card').should('be.visible');

    // User info is hidden in small devices
    cy.viewport('iphone-xr');
    cy.get('.user-card').should('not.be.visible');
    cy.get('.location-card').should('not.be.visible');

    // A new "info" tab is visible
    cy.get('.ant-tabs-tab').last().click();
    cy.get('.user-card').should('be.visible');
    cy.get('.location-card').should('be.visible');
  });
});
