var apiUrl = location.protocol + '//' + location.host + "/api/";
console.log(apiUrl);
console.log("at register.js");
// console.log(a);
//console.log("test:"+username);
//check user input and call server to create dataset
$('.register-patient').click(function() {

  //get user input data
  var formPatientId = $('.patient-id input').val();
  var formCardId = $('.card-id input').val();
  var formFirstName = $('.first-name input').val();
  var formLastName = $('.last-name input').val();
  var formEmail = $('.email input').val();
  var formDob = $('.dob input').val();
  var formPhoneNumber = $('.phone-number input').val();
  var formAdress = $('.address-patient input').val();
  // console.log(formAdress);
  //create json data
  var inputData = '{' + '"dob" : "' + formDob + '", ' + '"address" : "' + formAdress + '", ' + '"firstname" : "' + formFirstName + '", ' + '"lastname" : "' + formLastName + '", ' + '"email" : "' + formEmail + '", ' + '"phonenumber" : "' + formPhoneNumber + '", ' + '"PatientId" : "' + formPatientId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerPatient',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});


//check user input and call server to create dataset
$('.register-partner').click(function() {

  //get user input data
  var formName = $('.name input').val();
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"name" : "' + formName + '", ' + '"partnerid" : "' + formPartnerId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerPartner',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});

//

//check user input and call server to create dataset
$('.register-doctor').click(function () {

  //get user input data
  var formFirstName = $('.firstName input').val();
  var formDoctorId = $('.doctor-id input').val();
  var formCardId = $('.card-id input').val();
  var formLastName = $('.lastName input').val();
  var formEmail = $('.email input').val();
  var formSpecialisation = $('.specialisation input').val();
  var formPhoneNumber = $('.phone-number input').val();
  var formAddress = $('.address-doctor input').val();

  //create json data
  var inputData = '{' + '"firstName" : "' + formFirstName + '", ' + '"DoctorId" : "' + formDoctorId + '", ' + '"cardid" : "' + formCardId
    + '", ' + '"lastName" : "' + formLastName + '", ' + '"email" : "' + formEmail + '", ' + '"specialisation" : "' + formSpecialisation + '", ' + '"phoneNumber" : "' + formPhoneNumber + '", ' + '"address" : "' + formAddress + '"}';
  console.log(inputData)

  //make ajax call to add the dataset
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerDoctor',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function () {
      //display loading
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function (data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //notify successful registration
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});
