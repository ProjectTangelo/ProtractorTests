var request = require('supertest');

var baseURL = 'http://33.33.33.10';
var defaultTimeOut = 2000;

var testUserName     = 'TestUser',
    testUserEmail    = 'test@email.com',
    testUserPassword = 'asdf';

describe('Basic User Tests', function(){

  beforeAll(function(){

    admin_login();
    /*
    // TODO: Create user with random credentials.
    // Create the test user
    var username, fname, lname, email, type, password, confirm, submit;

    username = element(by.model('user.username'));
    fname    = element(by.model('user.name_first'));
    lname    = element(by.model('user.name_last'));
    email    = element(by.model('user.email'));
    type     = element(by.id('radio-user-type'));
    password = element(by.model('user.password'));
    confirm  = element(by.id('user-password-confirm'));
    submit   = element(by.buttonText('Submit'));

    browser.setLocation('users/add');

    username.sendKeys( testUserName );
    email.sendKeys( testUserEmail );
    type.click();
    password.sendKeys( testUserPassword );
    confirm .sendKeys( testUserPassword );
    submit.click();

    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function(url){
        return url == baseURL + '/#/users';
      });
    }, defaultTimeOut);
    */
    admin_logout();

  });

  afterAll(function(){
    admin_login();

    // TODO: Delete the created user.
    // browser.setLocation('users');

    admin_logout();
  });

  // TODO: Create a default basic user to login with.
  // Login as a basic user
  beforeEach(function() {
    browser.get(baseURL + '/login.html');
    element(by.id('user-username')).sendKeys(testUserName);
    element(by.id('user-password')).sendKeys(testUserPassword);
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

  //Login test for user
  describe('Login Spec User', function(){
    it('redirects to home page after login', function() {
      expect(browser.getTitle()).toEqual('tangelo');
    });

    it('shows admin page', function(){
      // expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
      // expect( element( by.id('client-page') ).isPresent() ).toBe(true );
    });

  });

  /*//Logging out as a user, does not work
  describe('Logout Spec User', function(){

    it('lets admin logout', function(){

      element(by.linkText('Sign Out')).click();

      var options = {
        url: baseURL + '/user',
        method: 'GET',
        json: true
      };

      request(options, function(error, response, body){
        expect( body.error.message ).toBe('Unauthorized');
      });

    });

    // TODO: This fails because we just go directly to /logout to logout. No other routing is happening.
    it('shows login page after logout', function(){
      element(by.linkText('Sign Out')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/login.html';
        });
      }, 2000);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/login.html');
    });

  });
  */

  //Testing the panels
  describe('Panel Tests', function(){

    it('Submissions', function(){
      element(by.linkText('Submissions')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/submissions';
        });
      }, defaultTimeOut);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/submissions');
      //test to be added later
    });

    it('Scratch Pad', function(){
      element(by.partialLinkText('ScratchPad')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/scratch';
        });
      }, defaultTimeOut);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/scratch');
      var randTxt = element(by.model('scratchText.value'));

      var sentText = 'Guns N Roses';
      randTxt.sendKeys(sentText);
      expect(randTxt.getAttribute('value')).toEqual(sentText);
    });

    it('Lesson Plans', function(){
      element(by.partialLinkText('Lesson Plans')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/lesson';
        });
      }, defaultTimeOut);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/lesson');
      var lessonEx = element.all(by.binding('value.name'));
      expect(lessonEx.count()).toBeGreaterThan(0);
    });

  });
});

function admin_login(){
  // Login as admin
  browser.get(baseURL + '/login.html');
  element(by.id('user-username')).sendKeys('admin');
  element(by.id('user-password')).sendKeys('himitsu');
  element(by.buttonText('Submit')).click();

  browser.driver.wait(function(){
    return browser.driver.getCurrentUrl().then(function(url){
      return url == baseURL + '/#/home';
    });
  }, defaultTimeOut);
}

function admin_logout(){
  // Logout from admin
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
}
