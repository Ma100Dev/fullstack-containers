describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users',
            {
                username: 'testUser',
                password: 'newPassword',
                name: 'Test Person'
            })
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('username')
        cy.contains('password')
        cy.get('input[name="Username"]')
            .should('be.visible')
        cy.get('input[name="Password"]')
            .should('be.visible')
        cy.get('button')
            .contains('login')
    })
    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('input[name="Username"]')
                .type('testUser')
            cy.get('input[name="Password"]')
                .type('newPassword')
            cy.get('button')
                .click()
            cy.get('.success').contains('Welcome')
            cy.contains('blogs')
            cy.contains('Test Person logged in')
            cy.get('button#create')
                .should('be.visible')
        })
        it('fails with wrong credentials', function () {
            cy.get('input[name="Username"]')
                .type('testUser')
            cy.get('input[name="Password"]')
                .type('badPassword')
            cy.get('button')
                .click()
            cy.get('.error')
                .contains('wrong credentials')
                .should('have.css', 'color')
                .and('match', /^rgb\(255, 0, 0\)$/)
            cy.get('blogs')
                .should('not.exist')
            cy.get('Test Person logged in')
                .should('not.exist')
            cy.get('button#create')
                .should('not.exist')
        })
    })
    describe('When logged in', function () {
        beforeEach(function () {
            cy.request('POST', 'http://localhost:3003/api/login',
                {
                    username: 'testUser',
                    password: 'newPassword'
                }).then(response => {
                    localStorage.setItem('user', JSON.stringify(response.body))
                    cy.visit('http://localhost:3000')
                })
        })
        it('A blog can be created', function () {
            cy.get('button#create')
                .should('be.visible')
                .click()
            cy.get('input#title')
                .should('be.visible')
                .type('Very Creative Blog Title')
            cy.get('input#author')
                .should('be.visible')
                .type('New Author')
            cy.get('input#url')
                .should('be.visible')
                .type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            cy.get('button#submit')
                .click()
            cy.get('.success')
                .contains('A new blog')
            cy.get('.success')
                .contains('added')
            cy.contains('Very Creative Blog Title, New Author')
            cy.reload(true)
            cy.contains('Very Creative Blog Title, New Author')
        })
        it('A blog can be liked', function () {
            cy.get('button#create')
                .should('be.visible')
                .click()
            cy.get('input#title')
                .should('be.visible')
                .type('Very Creative Blog Title')
            cy.get('input#author')
                .should('be.visible')
                .type('Very Creative Blog Title')
            cy.get('input#url')
                .should('be.visible')
                .type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            cy.get('button#submit')
                .click()
            cy.contains('view')
                .click()
            cy.contains('likes 0')
            cy.contains('like')
                .click()
            cy.contains('likes 1')
            cy.reload(true)
            cy.contains('view')
                .click()
            cy.contains('likes 1')
        })
        it('A blog can be deleted by its poster', function () {
            cy.get('button#create')
                .should('be.visible')
                .click()
            cy.get('input#title')
                .should('be.visible')
                .type('Very Creative Blog Title')
            cy.get('input#author')
                .should('be.visible')
                .type('New Author')
            cy.get('input#url')
                .should('be.visible')
                .type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            cy.get('button#submit')
                .click()
            cy.contains('view')
                .click()
            cy.get('.blog')
                .should('be.visible')
            cy.get('button#remove_VeryCreativeBlogTitle')
                .click()
            cy.get('.blog')
                .should('not.exist')
            cy.reload(true)
            cy.get('.blog')
                .should('not.exist')
        })
        it('Blogs are sorted by likes', function () {
            cy.get('button#create')
                .click()
            cy.get('input#title')
                .type('A')
            cy.get('input#author')
                .type('A')
            cy.get('input#url')
                .type('A')
            cy.get('button#submit')
                .click()

            cy.get('button#create')
                .click()
            cy.get('input#title')
                .type('B')
            cy.get('input#author')
                .type('B')
            cy.get('input#url')
                .type('B')
            cy.get('button#submit')
                .click()
            cy.contains('B, B')
            cy.get('div#blogsList').as('blogsList')
            cy.contains('A, A')
            cy.contains('B, B')
            cy.get('@blogsList').find('div').first().as('first')
            cy.get('@blogsList').find('div').last().as('last').find('button').click()
            cy.contains('like')
                .click()
            cy.contains(1)
            cy.contains('like')
                .click()
            cy.contains(2)
            cy.reload(true)
            cy.contains('A, A')
            cy.contains('B, B')
            cy.get('@blogsList').then(function ($div) {
                assert.equal(
                    $div
                        .find('div')
                        .first()
                        .text(),
                    'B, B view')
            })
            cy.get('@last').find('button').click()
            cy.contains('like')
                .click()
            cy.contains(1)
            cy.contains('like')
                .click()
            cy.contains(2)
            cy.contains('like')
                .click()
            cy.contains(3)
            cy.reload(true)
            cy.contains('A, A')
            cy.contains('B, B')
            cy.get('@blogsList').then(function ($div) {
                assert.equal(
                    $div
                        .find('div')
                        .first()
                        .text(),
                    'A, A view')
            })
        })
    })
})