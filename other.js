//Other Tests
//Add in to main file once complete

it('Login Test', function() {
  browser.setLocation('/users/add');
  var username = element(by.model('user.username'));
  var firstName = element(by.model('user.name_first'));
  var lastName = element(by.model('user.name_last'));
  var email = element(by.model('user.email'));
  var type = element(by.model('user.type')).all(by.css('label'));
  var password = element(by.model('user.password'));
  var confirmPass = element(by.id('user-password-confirm'));
  var submit =  element(by.buttonText('Submit'));

  username.sendKeys('Slayer');
  firstName.sendKeys('Ruby');
  lastName.sendKeys('Rose');
  email.sendKeys('ruby.rose@beacon.com');
  type.get(0).click();
  password.sendKeys('rwby');
  confirmPass.sendKeys('rwby');
  submit.click();
});

it('Login Test', function() {
  browser.setLocation('/lessons/add');
  var lessonName = element(by.model('lesson.name'));
  var upload = element(by.model('lesson.file'));
  var submit =  element(by.buttonText('Submit'));

  lessonName.sendKeys("Red Like Roses Part II");
  //File path stuff need to be added
  upload.sendKeys(/*file path*/);
  submit.click();
});
