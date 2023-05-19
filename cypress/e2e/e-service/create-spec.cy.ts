describe('e-service create spec', () => {
  it('should create an e-service', () => {
    cy.visit('/it/erogazione/e-service')
    cy.acceptTOS()
    cy.get('button').contains('Crea nuovo').click()

    cy.get('input[name="name"]').type(`${new Date().toLocaleString()} e2e test`)
    cy.get('textarea[name="description"]').type(
      `${new Date().toLocaleDateString()} e2e test description`
    )

    cy.get('button').contains('+ Aggiungi nuovo attributo').first().click()
    cy.get('button').contains('+ Aggiungi').click()

    cy.get('input[placeholder="Inserisci nome attributo"]').type('Enti Pubblici Non Economici')
    cy.get('li[role="option"]').contains('Enti Pubblici Non Economici').click()
    cy.get('button').contains('Aggiungi').click()
  })
})
