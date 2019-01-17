/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.lms.ehr.GrantAccess} giveAccessToEHR -- give EHR access to Doctor
 * @transaction
 */

 async function grantAccessToDoctor(giveAccessToEHR){
    giveAccessToEHR.medicalRecord.authorisedDoctors.push(giveAccessToEHR.authorisedToModify);
    let assetRegistry = await getAssetRegistry('org.lms.ehr.MedicalRecord');
    await assetRegistry.update(giveAccessToEHR.medicalRecord);
   
   
    giveAccessToEHR.authorisedToModify.myPatients.push(giveAccessToEHR.medicalRecord.owner);
    let DoctorRegistry = await getParticipantRegistry('org.lms.ehr.Doctor');
    await DoctorRegistry.update(giveAccessToEHR.authorisedToModify);

   
 }

/**
 * Sample transaction
 * @param {org.lms.ehr.GrantAccessHr} giveAccessToHR -- give HR access to Doctor
 * @transaction
 */

 async function grantAccessToDoctorHr(giveAccessToHR){

    giveAccessToHR.healthRecord.authorisedDoctors.push(giveAccessToHR.authorisedToModify);
    let assetRegistry = await getAssetRegistry('org.lms.ehr.HealthRecord');
    await assetRegistry.update(giveAccessToHR.healthRecord);
  
    giveAccessToHR.authorisedToModify.myPatients.push(giveAccessToHR.healthRecord.owner);
    let DoctorRegistry = await getParticipantRegistry('org.lms.ehr.Doctor');
    await DoctorRegistry.update(giveAccessToHR.authorisedToModify);

   
 }

  /**
 * Sample transaction
 * @param {org.lms.ehr.revokeAccessHr} revokeAccessHrOfDoctor -- revoke HR access to Doctor
 * @transaction
 */
 async function revokeAccessHr(revokeAccessHrOfDoctor){
    var list = revokeAccessHrOfDoctor.healthRecord.authorisedDoctors;
    var index = list.map(x => {
        return x.DoctorId;
      }).indexOf(revokeAccessHrOfDoctor.revokeThisDoctor.DoctorId);
      
      list.splice(index, 1);
    let assetRegistry = await getAssetRegistry('org.lms.ehr.HealthRecord');
    await assetRegistry.update(revokeAccessHrOfDoctor.healthRecord);

    var patientList = revokeAccessHrOfDoctor.revokeThisDoctor.myPatients;
    var index = patientList.map(x => {
        return x.patientId;
      }).indexOf(revokeAccessHrOfDoctor.healthRecord.owner.patientId);
      
      patientList.splice(index, 1);
    let DoctorRegistry = await getParticipantRegistry('org.lms.ehr.Doctor');
    await DoctorRegistry.update(revokeAccessHrOfDoctor.revokeThisDoctor);
 }


 
 /**
 * Sample transaction
 * @param {org.lms.ehr.revokeAccess} revokeAccessOfDoctor -- revoke EHR access to Doctor
 * @transaction
 */

  async function revokeAccess(revokeAccessOfDoctor){
    var list = revokeAccessOfDoctor.medicalRecord.authorisedDoctors;
    var index = list.map(x => {
        return x.DoctorId;
      }).indexOf(revokeAccessOfDoctor.revokeThisDoctor.DoctorId);
      
      list.splice(index, 1);
    let assetRegistry = await getAssetRegistry('org.lms.ehr.MedicalRecord');
    await assetRegistry.update(revokeAccessOfDoctor.medicalRecord);

    var patientList = revokeAccessOfDoctor.revokeThisDoctor.myPatients;
    var index = patientList.map(x => {
        return x.patientId;
      }).indexOf(revokeAccessOfDoctor.medicalRecord.owner.patientId);
      
      patientList.splice(index, 1);
    let DoctorRegistry = await getParticipantRegistry('org.lms.ehr.Doctor');
    await DoctorRegistry.update(revokeAccessOfDoctor.revokeThisDoctor);
 }

 /**
 * Sample transaction
 * @param {org.lms.ehr.GrantAccessToLab} GrantAccessToLab -- give EHR access to Lab
 * @transaction
 */

async function GrantAccessToLab(GrantAccessToLab){
  GrantAccessToLab.medicalRecord.authorisedLabs.push(GrantAccessToLab.addThislab);
  let assetRegistry = await getAssetRegistry('org.lms.ehr.MedicalRecord');
  await assetRegistry.update(GrantAccessToLab.medicalRecord);

  GrantAccessToLab.addThislab.myPatients.push(GrantAccessToLab.medicalRecord.owner);
  let labRegistry = await getParticipantRegistry('org.lms.ehr.Lab');
  await labRegistry.update(GrantAccessToLab.addThislab);

}

 /**
 * Sample transaction
 * @param {org.lms.ehr.GrantAccessToLabHr} GrantAccessToLabHr -- give EHR access to Lab
 * @transaction
 */

async function GrantAccessToLabHr(GrantAccessToLabHr){
  GrantAccessToLabHr.healthRecord.authorisedLabs.push(GrantAccessToLabHr.addThislab);
  let assetRegistry = await getAssetRegistry('org.lms.ehr.MedicalRecord');
  await assetRegistry.update(GrantAccessToLabHr.healthRecord);

  GrantAccessToLabHr.addThislab.myPatients.push(GrantAccessToLabHr.healthRecord.owner);
  let labRegistry = await getParticipantRegistry('org.lms.ehr.Lab');
  await labRegistry.update(GrantAccessToLabHr.addThislab);

}

/**
 * Sample transaction
 * @param {org.lms.ehr.revokeAccessFromLab} revokeAccessFromLab -- revoke EHR access from lab
 * @transaction
 */
async function revokeAccessFromLab(revokeAccessFromLab){
  var list = revokeAccessFromLab.medicalRecord.authorisedLabs;
  var index = list.map(x => {
      return x.labId;
    }).indexOf(revokeAccessFromLab.revokeThisLab.labId);
    
    list.splice(index, 1);
  let assetRegistry = await getAssetRegistry('org.lms.ehr.MedicalRecord');
  await assetRegistry.update(revokeAccessFromLab.medicalRecord);

  var patientList = revokeAccessFromLab.revokeThisLab.myPatients;
    var index = patientList.map(patient => {
        return patient;
      }).indexOf(revokeAccessFromLab.revokeThisLab.myPatients.patient);
      
      patientList.splice(index, 1);
    let labRegistry = await getParticipantRegistry('org.lms.ehr.Lab');
    await labRegistry.update(revokeAccessFromLab.revokeThisLab);
}


/**
 * Create record Transaction
 * @param {org.lms.ehr.CreateMedicalRecord} recordData
 * @transaction
 */
function CreateMedicalRecord(recordData) {
  // Get the Asset Registry
  return getAssetRegistry('org.lms.ehr.MedicalRecord')
      .then(function(medicalRecordRegistry){
          var  factory = getFactory();
          var  NS =  'org.lms.ehr';
          var  recordId = generateRecordId(recordData.owner.patientId);
          var  medicalRecord = factory.newResource(NS,'MedicalRecord',recordId);
          medicalRecord.medicalHistory = recordData.medicalHistory;
          medicalRecord.Allergies = recordData.Allergies;
          medicalRecord.currentMedication = recordData.currentMedication;
          medicalRecord.lastConsultationWith = recordData.lastConsultationWith;
          medicalRecord.owner = recordData.owner;
          medicalRecord.owner = recordData.owner;
          medicalRecord.owner = recordData.owner;
          medicalRecord.owner = recordData.owner;
          medicalRecord.owner = recordData.owner;
          medicalRecord.owner = recordData.owner;
          // 4. Add to registry
          return medicalRecordRegistry.add(medicalRecord);
      });
}


/****
* Creates the medical record 
*/
function generateRecordId(email){
  var number = Math.random();
  var id = email+number;
  return id;
}

/**
 * Handle a transaction that returns a string.
 * @param {org.lms.ehr.getUserType} data The transaction.
 * @transaction
 */
async function getUserType(data) {
  return getParticipantRegistry('org.lms.ehr.Doctor')
  .then(function (participantRegistry) {
    return participantRegistry.get(data.email);
  })
  .then(function (Doctor) {
    if(Doctor){
      return "Doctor"
    }
  })
  .catch(function (error) {
    return getParticipantRegistry('org.lms.ehr.Patient')
    .then(function (patientRegistry) {
      return patientRegistry.get(data.email);
    })
    .then(function (patient) {
      if(patient){
        return "Patient"
      }
    })
    .catch(function (error) {
      return getParticipantRegistry('org.lms.ehr.Lab')
       .then(function (labRegistry) {
         return labRegistry.get(data.email);
       })
       .then(function (lab) {
          if(lab){
            return "Lab"
          }
       })
       .catch(function (error) {
           return "no data"
       });
    });
  });
  
}

