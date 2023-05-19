describe('TOS', () => {
  it('should set info in localstorage on confirmation click', () => {
    cy.visit('/')
    cy.acceptTOS()
    cy.getAllLocalStorage().then((result) => {
      expect(result['http://localhost:3000'].acceptTOS).to.not.be.undefined
    })
  })
})
