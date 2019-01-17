const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.lms.ehr';
// var window.a=1;
//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connectionProfilection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'ehr';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'ehr';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
 const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

  //disconnect existing connection
  await businessNetworkConnection.disconnect();

  //connect to network using cardName
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//export module
module.exports = {
  loginCard:async function(cardId){
    try{
      await useIdentity(cardName);
    }catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },
  /*
  * Create patient participant and import card for identity
  * @param {String} cardId Import card id for patient
  * @param {String} accountNumber patient account number as identifier on network
  * @param {String} firstName patient first name
  * @param {String} lastName patient last name
  * @param {String} phoneNumber patient phone number
  * @param {String} dob patient dob
  */
 registerPatient: async function (cardId, patientID,firstName, lastName, email , phoneNumber, address,dob) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ehr');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create patient participant
      const patient = factory.newResource(namespace, 'Patient', patientID);
      patient.firstName = firstName;
      patient.lastName = lastName;
      patient.dob = dob;
      patient.email=email;
      patient.phoneNumber=phoneNumber;
      patient.address = address;
      // patient.points = 0;

      //add patient participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      await participantRegistry.add(patient);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Patient#' + patientID, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ehr');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
   registerLab: async function (cardId, labID,name, address,email) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ehr');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create patient participant
      const lab = factory.newResource(namespace, 'Lab', labID);
      lab.name = name;
      lab.address = address;
      lab.email=email;
      lab.myPatients=[];
      // patient.points = 0;

      //add patient participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Lab');
      await participantRegistry.add(lab);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Lab#' + labID, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ehr');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Create Doctor participant and import card for identity
  * @param {String} cardId Import card id for Doctor
  * @param {String} DoctorId Doctor Id as identifier on network
  * @param {String} name Doctor name
  */
  registerDoctor: async function (cardId, DoctorId, firstName, lastName, email, phoneNumber, address, specialisation) {

    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ehr');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create Doctor participant
      const Doctor = factory.newResource(namespace, 'Doctor', DoctorId);
      Doctor.firstName = firstName;
      Doctor.lastName = lastName;
      Doctor.specialisation = specialisation;
      Doctor.email = email;
      Doctor.phoneNumber = phoneNumber;
      Doctor.address = address;
      Doctor.myPatients = [];

      //add Doctor participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      await participantRegistry.add(Doctor);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Doctor#' + DoctorId, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ehr');

      return true;
    }
    catch (err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
    /*
  * Create HealthRecord asset 
  * @param {String} cardId Card id to connect to network
  * @param {String} recordeId 
  * @param {String} temperature
  * @param {String} bloodPressure
  * @param {String} ownerId
  * @param {String} doctorId
  */
  createHealthRecord: async function(cardId,recordId, ownerId,){
    try{
      //connect as client via cardId
      businessNetworkConnection= new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);
      //get the factory for the business network.
      factory= businessNetworkConnection.getBusinessNetwork().getFactory();
      //create healthRecord asset
      const HealthRecord = factory.newResource(namespace, 'HealthRecord', recordId);
      HealthRecord.temperature = '36';
      HealthRecord.bloodPressure = '120/70';
      HealthRecord.xRay='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';
      HealthRecord.owner = factory.newRelationship(namespace, 'Patient', ownerId);
      
      HealthRecord.authorisedDoctors = [];//factory.newRelationship(namespace,'Doctor', '000001');//factory.newRelationship(namespace, 'Doctor',[]);
      //console.log(HealthRecord.authorisedDoctors);
       HealthRecord.authorisedLabs = [];//factory.newRelationship(namespace,'Lab',[]);
      //add Health Record asset
      const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace+ '.HealthRecord');
      await assetRegistry.add(HealthRecord);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);
      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },
    /*
  * Perform GrantAccessHr transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} recordId identified of HealthRecord
  * @param {String} labId identified of Lab
  */
  grantAccessHrTransaction: async function(cardId, recordId, doctorId){
      try{
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //creat transaction
      const grantaccesstoLab= factory.newTransaction(namespace, 'GrantAccessHr');
      grantaccesstoLab.authorisedToModify= factory.newRelationship(namespace, 'Doctor', doctorId);
      grantaccesstoLab.healthRecord= factory.newRelationship(namespace, 'HealthRecord', recordId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(grantaccesstoLab);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);
      return true;

      }catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }
  },
  /*
  * Perform RevokeAccessHr transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} recordId identified of HealthRecord
  * @param {String} labId identified of Lab
  */
  revokeAccessHrTransaction: async function(cardId, recordId, doctorId){
      try{
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //creat transaction
      const revokeaccess= factory.newTransaction(namespace, 'revokeAccessHr');
      revokeaccess.revokeThisDoctor= factory.newRelationship(namespace, 'Doctor', doctorId);
      revokeaccess.healthRecord= factory.newRelationship(namespace, 'HealthRecord', recordId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(revokeaccess);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);
      return true;

      }catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
  /*
  * Perform GrantAccessToLabHr transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} recordId identified of HealthRecord
  * @param {String} labId identified of Lab
  */
  grantAccessToLabHrTransaction: async function(cardId, recordId, labId){
      try{
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //creat transaction
      const grantaccesstoLab= factory.newTransaction(namespace, 'GrantAccessToLabHr');
      grantaccesstoLab.addThislab= factory.newRelationship(namespace, 'Lab', labId);
      grantaccesstoLab.HealthRecord= factory.newRelationship(namespace, 'HealthRecord', recordId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(grantaccesstoLab);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);
      return true;

      }catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Perform EarnPoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  * @param {String} DoctorId Doctor Id of Doctor
  * @param {Integer} points Points value
  */
  earnPointsTransaction: async function (cardId, accountNumber, DoctorId, points) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const earnPoints = factory.newTransaction(namespace, 'EarnPoints');
      earnPoints.points = points;
      earnPoints.patient = factory.newRelationship(namespace, 'patient', accountNumber);
      earnPoints.Doctor = factory.newRelationship(namespace, 'Doctor', DoctorId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(earnPoints);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Perform UsePoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  * @param {String} DoctorId Doctor Id of Doctor
  * @param {Integer} points Points value
  */
  usePointsTransaction: async function (cardId, accountNumber, DoctorId, points) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const usePoints = factory.newTransaction(namespace, 'UsePoints');
      usePoints.points = points;
      usePoints.patient = factory.newRelationship(namespace, 'patient', accountNumber);
      usePoints.Doctor = factory.newRelationship(namespace, 'Doctor', DoctorId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(usePoints);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
    /*
  * Get healthRecord data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  */
  healthRecord: async function (cardId,patientID) {

    try {
      
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);
      let input='resource:org.lms.ehr.Patient#' +patientID;
      // console.log("xxxx:"+ input);
      //get healthRecord from the network
      const healthRecord = await businessNetworkConnection.query('getHealthRecordOfPatient',{patientID:input});
      //disconnect
      // console.log(healthRecord);
      await businessNetworkConnection.disconnect(cardId);

      //return patient object
      return healthRecord;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Get patient data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  */
  patientData: async function (cardId, accountNumber) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get patient from the network
      const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      const patient = await patientRegistry.get(accountNumber);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);
      //console.log(Patient);
      //return patient object
      return patient;
    }
    catch(err) {
      //print and return error
      //console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
   /*
  * Update Health Record 
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  */
  updateHealthRecordData: async function (cardId,recordId,temperature,bloodPressure,image) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);
      const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.HealthRecord');
      const healthRecord = await assetRegistry.get(recordId);
          healthRecord.temperature =temperature;
          healthRecord.bloodPressure=bloodPressure;
          console.log(image.length);
          if(image.length>4)
          {
            healthRecord.xRay=image;
          }

      await assetRegistry.update(healthRecord);

        await businessNetworkConnection.disconnect(cardId);
        return true;
      //get patient from the network
      // const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      // const patient = await patientRegistry.get(accountNumber);

      // //disconnect
      // await businessNetworkConnection.disconnect(cardId);
      // //console.log(Patient);
      // //return patient object
      // return patient;
    }
    catch(err) {
      //print and return error
      //console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
   /*
  * Update Patient Infor
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of patient
  */
  updatePatientInfor: async function (cardId,patientId,firstName, lastName, email, phoneNumber, address) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);
      const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      const patient = await patientRegistry.get(patientId);
        // console.log(patient.address);
        patient.firstName=firstName;
        patient.lastName=lastName;
        patient.email=email;
        patient.phoneNumber=phoneNumber;
        patient.address= address;
      await patientRegistry.update(patient);
      await businessNetworkConnection.disconnect(cardId);
      return true;
    }
    catch(err) {
      //print and return error
      //console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },


  /*
  * Get Doctor data
  * @param {String} cardId Card id to connect to network
  * @param {String} DoctorId Doctor Id of Doctor
  */
  DoctorData: async function (cardId, DoctorId) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get patient from the network
      const DoctorRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      const Doctor = await DoctorRegistry.get(DoctorId);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return Doctor object
      return Doctor;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all Doctors data
  * @param {String} cardId Card id to connect to network
  */
  allDoctorsInfo : async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query all Doctors from the network
      const allDoctors = await businessNetworkConnection.query('getAllDoctor');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return allDoctors object
      return allDoctors;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  /*
  * Get all EarnPoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  earnPointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query EarnPoints transactions on the network
      const earnPointsResults = await businessNetworkConnection.query('selectEarnPoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return earnPointsResults object
      return earnPointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  usePointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query UsePoints transactions on the network
      const usePointsResults = await businessNetworkConnection.query('selectUsePoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return usePointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  }

}
