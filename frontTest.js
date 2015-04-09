// frontTest.js
describe('Front End Test', function() {
  var username = element(by.id('user-username'));
  var password = element(by.id('user-password'));
  var loginButton =  element(by.buttonText('Submit'));

  beforeEach(function() {
    browser.get('http://33.33.33.10/login.html');
    username.sendKeys('admin');
    password.sendKeys('himitsu');
    loginButton.click();
  });

  it('Login Test', function() {
    //fails due to redirect to "/admin" which contains no angular
    //Redirect needs to be fixed, changed, or circumvented
    browser.setLocation('/home');
    expect(browser.getTitle()).toEqual('tangelo');
  });

});
