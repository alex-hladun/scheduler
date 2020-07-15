describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should visit Tuesday", () => {
    cy.visit("/");
    // cy.get("li").next().click()
    // cy.get("li").contains("Tuesday").click();


    cy.contains("[data-testid=day]", "Tuesday").click()
      .should("have.class", "day-list__item--selected");
  })
});

// postgres://
// dfwnxjfwqgwuuf
// :
// 31d4c12b2475bb3a6ea8ce8990a90fbae3f49970cae5bc4c8b04ee7123c1f0ec
// @
// ec2-54-165-36-134.compute-1.amazonaws.com
// :
// 5432
// /
// d5dghtn7u66iok

// psql -h ec2-54-165-36-134.compute-1.amazonaws.com -p 5432 -U dfwnxjfwqgwuuf -d d5dghtn7u66iok