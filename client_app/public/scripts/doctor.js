var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-doctor').click(function() {

  //get user input data
  var formDoctorId = $('.doctor-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"doctorid" : "' + formDoctorId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'doctorData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        console.log(data);
        //update heading
        $('.heading').html(function() {
          var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
          str = str + '<h2><b>' + data.doctorId + '</b></h2>';
          return str;
        });

        //update dashboard
        $('.dashboards').html(function() {
          var str = '<b style="color:red;">Name: </b>' + data.firstName + ' ' + data.lastName +'<br>';
          str = str + '<b style="color:red;">Identifed: </b> ' + data.doctorId +'<br>';
          str = str + '<b style="color:red;">Email: </b>' + data.email +'<br>';
          str = str + '<b style="color:red;">phoneNumber: </b>' + data.phoneNumber +'<br>';
          str = str + '<b style="color:red;">Specialisation: </b>' + data.specialisation +'<br>';
          str = str + '<b style="color:red;">Address: </b>' + data.address +'<br>';
          //str = str + '<h2><b>' + data.points + '</b></h2>';
          return str;
        });

        $('.get-healthRecord select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          let myPatients = data.myPatients;
          for (var i = 0; i < myPatients.length; i++) {
            let dataPatient=myPatients[i].split("#")[1];
            str = str + '<option patient-id=' + dataPatient + '> ' + dataPatient + '</option>';
          }
          return str;
        });

        //remove login section
        document.getElementById('loginSection').style.display = "none";
        //display transaction section
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });

});

$('.submit-get-healthRecord').click(function(){
  getHealthRecord();
});

function getHealthRecord(){
  // var formAccountNum = $('.patient-id input').val();
  var formCardId = $('.card-id input').val();
  var formPatienId = $('.get-healthRecord select').find(":selected").attr('patient-id');
  var inputData = '{' +'"patientId" : "' + formPatienId + '", '+ '"cardid" : "' + formCardId  + '"}';
  console.log(inputData);
  $.ajax({
    type: 'POST',
    url: apiUrl + 'getHealthRecordForDoctor',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
    },
    success: function(data) {

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        console.log(data);

        $('.view-healthRecord').html(function() {
           
          var str =  '<br><h3> Patient Information</h3>';
          str = str + '<b style="color:red;">Name: </b>' + data.firstName + ' ' + data.lastName +'<br>';
          str = str + '<b style="color:red;">Email: </b>' + data.email +'<br>';
          str = str + '<b style="color:red;">phoneNumber: </b>' + data.phoneNumber +'<br>';
          str = str + '<b style="color:red;">Specialisation: </b>' + data.dob+'<br>';
          str = str + '<b style="color:red;">Address: </b>' + data.address +'<br><br>';
          str = str +'<h3> Health Record Information</h3>';
          str = str + '<b style="color:red;">Temperature: </b>' + data.temperature +' °C<br>';
          str = str + '<b style="color:red;">Blood Pressure: </b>' + data.bloodPressure +' (mm/Hg)<br>';
          str =str  + '<b style="color:red;">XRay: </b><br> <img src="data:image/jpeg;base64,' + data.xRay + "\"/><br><br><br>";
          return str;
        });
        // console.log(data);
        //update member page and notify successful transaction
        // updateMember();
        // console.log('Transaction successful');
        // alert('Transaction successful');
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  }); 

}
