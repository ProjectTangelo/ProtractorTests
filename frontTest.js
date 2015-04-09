// frontTest.js
describe('Front End Test', function() {
  it('Login Test', function() {
    browser.get('http://33.33.33.10/login.html');

    var username = element(by.id('user-username'));
    var password = element(by.id('user-password'));
    var submitB =  element(by.buttonText('Submit'));

    username.sendKeys('admin');
    password.sendKeys('himitsu');
    submitB.click();

    //browser.get('http://33.33.33.10/#/home');
    //expect(browser.getTitle()).toEqual('tangelo');
  });
  /*
  it('Logged in?', function() {
    browser.get('http://33.33.33.10');

    expect(browser.getTitle()).toEqual('tangelo');
  });
  */
});
