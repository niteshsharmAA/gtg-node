var expect  = require('chai').expect;
var request = require('request');
const db = require("../models");
const encryption = require('../middleware/encryption')
const User = db.user;

it('User Service Unit Tests', function(done) {

    describe("Get Login functionality", function () {
        it("should return login status", async function () {
          const loginObject = {
            phone_number:9500508055,
            password: encryption.encrypt("Test@123")
          }
          const returnedUser = await User.findOne({loginObject});
          console.log('return ',returnedUser.phone_number,' obj ',loginObject.phone_number)

          expect(returnedUser.phone_number).to.equal(loginObject.phone_number)
          done();
        //   expect(returnedUser.password).to.equal(1)
        //   expect(returnedUser.totalExperience).to.eql(5)
        });
    })
    // describe("User Register functionality", function () {
    //     it("should successfully add a user if the number of users in the DB with the same profiled is zero", async function () {
    //       const email_id = "testuser11@gmail.com";
    //     //   const mobile_number = 8223432423;
    //       const reg_type =1;
    //       const password = "test@123";
    //       const returnedUser = await User.create({
    //         email_id,
    //         // mobile_number,
    //         password,
    //         reg_type
    //       });
    //       expect(returnedUser.email_id).to.equal(email_id);
    //     //   expect(returnedUser.dob.toString()).to.equal((new Date(dob)).toString());
    //     //   experience.map((exp, index) => {
    //     //     expect(returnedUser.experience[index].years).to.equal(exp.years);
    //     //     expect(returnedUser.experience[index].organizationName).to.equal(exp.organizationName);  
    //     //   })
    //     });
    //     it("should throw an error if the number of users with the same profileId is not zero", async function () {});
    //   });

      


});