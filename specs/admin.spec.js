var request = require('supertest');
var path    = require('path');

var baseURL        = 'http://33.33.33.10';
var defaultTimeOut = 2000;

request = request(baseURL);

describe('Admin Tests', function() {

  // Login as Admin
  beforeEach(function(){
    // Redirects to the login page.
    browser.get(baseURL + '/login.html');
    element(by.id('user-username')).sendKeys('admin');
    element(by.id('user-password')).sendKeys('himitsu');
    element(by.buttonText('Submit')).click();

    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function(url){
        return url == baseURL + '/#/home';
      });
    }, defaultTimeOut);
  });

  afterEach(function(){
    element(by.linkText('Sign Out')).isPresent().then(function(isFound){
      if( isFound == true ) {
        element(by.linkText('Sign Out')).click();
        browser.driver.wait(function(){
          return browser.driver.getCurrentUrl().then(function(url){
            return url == baseURL + '/';
          });
        }, defaultTimeOut);
      }
    });
  });

  describe('Login Spec', function(){
    it('redirects to home page after login', function() {
      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/home');
    });

    it('shows admin page', function(){
      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(true );
      expect( element( by.id('client-page') ).isPresent() ).toBe(false);
    });

  });


  describe('Logout Spec', function(){

    it('lets admin logout', function(){
      element(by.linkText('Sign Out')).click();
      expect(element(by.css('body')).getAttribute('ng-app')).toMatch('login');

      request.get(baseURL + '/user')
        .expect(function (res) {
          res.body.error.message.to.be.equal('Unauthorized');
      });
    });

    it('shows login page after logout', function(){
      element(by.linkText('Sign Out')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/';
        });
      }, defaultTimeOut);

      expect(element(by.css('body')).getAttribute('ng-app')).toMatch('login');
    });

  });


  describe('Admin Panel Spec', function(){
    it('leaves admin panel on logout', function(){
      element(by.linkText('Sign Out')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/';
        });
      }, defaultTimeOut);

      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
    });

    it('only allows admin into admin panel', function(){
      element(by.linkText('Sign Out')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/';
        });
      }, defaultTimeOut);

      browser.setLocation('home');

      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
    });
  });


  describe('User Management Spec', function(){


    describe('Creating Users', function(){

      var username, fname, lname, email, type, password, confirm, submit;

      beforeEach(function(){
        username = element(by.model('user.username'));
        fname    = element(by.model('user.name_first'));
        lname    = element(by.model('user.name_last'));
        email    = element(by.model('user.email'));
        type     = element(by.id('radio-user-type'));
        password = element(by.model('user.password'));
        confirm  = element(by.id('user-password-confirm'));
        submit   = element(by.buttonText('Submit'));
      });

      function addUser( newUserName ) {
        addCustomUser(newUserName, 'Tyler', 'Davidson', 'tyler@david.johnny', 'eduardo');
      }

      function addCustomUser( new_newUserName, new_fname, new_lname, new_email, new_password, new_confirm ) {
          browser.setLocation('users/add');

          if( typeof new_confirm === 'undefined' )
            new_confirm = new_password;

          username.sendKeys( new_newUserName );
          fname.sendKeys( new_fname);
          lname.sendKeys( new_lname );
          email.sendKeys( new_email );
          type.click();
          password.sendKeys( new_password );
          confirm.sendKeys( new_confirm );
          submit.click();

          browser.driver.wait(function(){
            return browser.driver.getCurrentUrl().then(function(url){
              return url == baseURL + '/#/users';
            });
          }, defaultTimeOut);
      }

      function deleteLastUser() {
        browser.setLocation('users');

        // Deletes the user.
        element.all(by.id('delete-button')).last().click();
        browser.refresh();
      }

      it('creates a single user', function(){
        var newUserName = 'SingleUserAddTest';
        addUser( newUserName );
        browser.setLocation('users');
        element.all(by.exactBinding('user.username')).filter(function(elem, index){
          return elem.getText().then(function(text){
            return text === newUserName;
          });
        }).then(function(filteredElements){
            expect( filteredElements.length > 0 ).toBe(true);
        });


        deleteLastUser();
      });

      it('does not create duplicate users', function(){

        // Checks the number of users before the test starts.
        browser.setLocation('users');
        var startCount;
        element.all(by.binding('user.username')).count().then(function(count){
          startCount = count;
        });

        // Check if the user already existed before we try to add.
        var newUserName = 'MultipleTest';
        var alreadyExists = false;
        element.all(by.binding('user.username')).each(function(element, index){
          element.getText().then(function(text){
            if( text == newUserName )
              alreadyExists = true;
          });
        });

        // Tries to add duplicate users.
        for( var i = 0; i < 2; ++i ) {
          addUser( newUserName );
        }

        // Counts after it tries to add duplicate users.
        browser.setLocation('users');
        element.all(by.binding('user.username')).count().then(function(count){
          // Make sure that we didn't add duplicate users.
          expect( count ).toBe( startCount + ((alreadyExists)? 0:1) );
        });

        element.all(by.binding('user.username')).each(function(element, index){
          element.getText().then(function(text){
            if( text == newUserName )
              element.click();
          });
        });

        if( alreadyExists == false ) {
          deleteLastUser();
        }

      });

      // TODO: Catch mongoose errors for this. Same for all probably.
      // This crashes the server.
      it('requires username', function(){
          /*
          browser.setLocation('users/add');

          // username.sendKeys(Test);
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users/add');

          browser.setLocation('users/add');

          username.sendKeys('UsernameRequiredTest');
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users/');

          // Deletes the user.
          element.all(by.id('delete-button')).last().click();
          browser.refresh();
          */
      });

      it('requires password', function(){

      });

      it('requires user type', function(){

      });

      it('requires email address', function(){

      });

      it('does not require first name', function(){
          var newUserName = 'FirstNameNotRequired'

          addCustomUser( newUserName, '', 'Davidson', 'tyler@david.johnny', 'eduardo' )

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

          addUser( newUserName );

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

          deleteLastUser();
      });

      it('does not require last name', function(){
        var newUserName = 'FirstNameNotRequired'

        addCustomUser( newUserName, 'Tyler', '', 'tyler@david.johnny', 'eduardo' )

        expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

        addUser( newUserName );

        expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

        deleteLastUser();
      });

      it('creates multiple users through bulk import', function(){

      });

      it('edits a user', function(){

      });

      it('deletes a user', function(){
        browser.setLocation('users');

        var startCount;
        element.all(by.binding('user.username')).count().then(function(count){
          startCount = count;
        });

        // Adds a user to delete.
        browser.setLocation('users/add');
        var newUserName = 'DeleteUser'

        addUser( newUserName );

        expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

        deleteLastUser();

        // Checks to make sure that the user was deleted.
        element.all(by.binding('user.username')).count().then(function(count){
          expect( count ).toBe( startCount );
        });
      });

    })

  });


  describe('Lesson Spec', function(){

    function addLesson( lessonName ) {
      var filePath = './admin.spec.js';
      var absolutePath = path.resolve(__dirname, filePath);
      browser.setLocation('lessons/add');

      element(by.model('lesson.name')).sendKeys(lessonName);
      element(by.model('lesson.file')).sendKeys(absolutePath);
      element(by.buttonText('Submit')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/lessons';
        });
      }, defaultTimeOut);
    }

    function deleteLast() {
      browser.setLocation('lessons');

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/lessons';
        });
      }, defaultTimeOut);

      // Deletes the lesson.
      element.all(by.id('delete-button')).last().click();
      browser.refresh();
    }

    it('adds lessons', function(){
      var lessonName = 'AddedLesson'
      addLesson( lessonName );

      element.all(by.exactBinding('file.name')).filter(function(elem, index){
        return elem.getText().then(function(text){
          return text === lessonName;
        });
      }).then(function(filteredElements){
          expect( filteredElements.length > 0 ).toBe(true);
      });

      deleteLast();
    });

    it('opens a lesson', function(){

      browser.setLocation('lessons');

      var lessonName = 'OpenLesson';

      addLesson( lessonName );

      element.all(by.id('edit-button')).last().click();

      expect(browser.getCurrentUrl()).toContain(baseURL + '/#/lessons/');
      expect(browser.getCurrentUrl()).toNotBe(baseURL + '/#/lessons');

      browser.setLocation('lessons');
      deleteLast();

    });

    it('deletes a lesson', function(){
      browser.setLocation('lessons');

      var startCount;
      element.all(by.exactBinding('file.name')).count().then(function(count){
        startCount = count;
      });

      var lessonName = 'DeleteFile';
      addLesson(lessonName);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/lessons');

      deleteLast();

      element.all(by.exactBinding('file.name')).count().then(function(count){
        expect( count ).toBe( startCount );
      });
    });

  });


  describe('User Submissions Spec', function(){
    it('views submissions', function(){

    });

    it('submits feedback', function(){

    });

  });


});
