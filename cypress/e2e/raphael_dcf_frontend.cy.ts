describe("Raphael DCF Frontend - Login and Register Pages", () => {
  const baseUrl = "http://localhost:3000" // Replace with your actual base URL

  beforeEach(() => {
    cy.visit(baseUrl)
  })

  it("should display the register form and allow registration", () => {
    // Navigate to the register view
    cy.visit(`${baseUrl}#register`)
    cy.get("#register-form").should("be.visible")

    // Fill out the form
    cy.get("#register-username").type("testuser")
    cy.get("#register-email").type("testuser@example.com")
    cy.get("#register-password").type("Test@1234")
    cy.get("#register-confirm-password").type("Test@1234")

    // Submit the form
    cy.get("#register-form").submit()

    // Confirm success or error response
    cy.on("window:alert", (message) => {
      if (message.includes("Account created")) {
        expect(message).to.equal("Account created! Please login.")
      } else {
        expect(message).to.not.contain("Error submitting form")
      }
    })

    // Redirect to login view after registration
    cy.hash().should("equal", "#login")
  })

  it("should display the login form and allow login", () => {
    // Navigate to the login view
    cy.visit(`${baseUrl}#login`)
    cy.get("#login-form").should("be.visible")

    // Fill out the form
    cy.get("#login-email").type("testuser@example.com")
    cy.get("#login-password").type("Test@1234")

    // Submit the form
    cy.get("#login-form").submit()

    // Confirm success or error response
    cy.on("window:alert", (message) => {
      if (message.includes("Login Success")) {
        expect(message).to.equal("Login Success!")
      } else {
        expect(message).to.not.contain("Error submitting form")
      }
    })

    // Redirect to game view after successful login
    cy.hash().should("equal", "#game")
  })

  it("should validate invalid inputs on the register form", () => {
    // Navigate to the register view
    cy.visit(`${baseUrl}#register`)
    cy.get("#register-form").should("be.visible")

    // Fill out the form with invalid data
    cy.get("#register-username").type("te") // Too short
    cy.get("#register-email").type("invalid-email")
    cy.get("#register-password").type("password") // Missing complexity
    cy.get("#register-confirm-password").type("differentpassword")

    // Attempt to submit the form
    cy.get("#register-form").submit()

    // Check for validation alerts
    cy.on("window:alert", (message) => {
      expect(message).to.satisfy((msg: string) =>
        [
          "Username must be at least 3 characters long",
          "Please enter a valid email address",
          "Password must contain at least one uppercase letter",
          "Passwords do not match",
        ].some((error) => msg.includes(error)),
      )
    })
  })

  it("should validate invalid inputs on the login form", () => {
    // Navigate to the login view
    cy.visit(`${baseUrl}#login`)
    cy.get("#login-form").should("be.visible")

    // Fill out the form with invalid email
    cy.get("#login-email").type("invalid-email")
    cy.get("#login-password").type("short")

    // Attempt to submit the form
    cy.get("#login-form").submit()

    // Check for validation alerts
    cy.on("window:alert", (message) => {
      expect(message).to.satisfy((msg: string) =>
        [
          "Please enter a valid email address",
          "Password must be at least 8 characters",
        ].some((error) => msg.includes(error)),
      )
    })
  })
})
