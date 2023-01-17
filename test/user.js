const expect = require('chai').expect;
// const app = require('../app.js');
// const request = require('supertest');
var request = require("supertest");

request = request("http://192.168.0.241:3000/");  

describe("User API Endpoint Tests ", async function () {
    it("POST Registration Function", async () => {
        let user = {
             email_id: 'testuser@gmail.com1',
             password: 'Test@123',
             reg_type:1
           };
           const response = await request.post("api/v1/registration").send(user);
           if(response.body.statusCode == 200){
           expect(response.body.statusCode).to.equal(200);  
           expect(response.body.statusMessage).to.equal('OK. user added successfully.');  
           } 
           if(response.body.statusCode == 400){
               expect(response.body.statusCode).to.equal(400);  
               expect(response.body.statusMessage).to.equal('User Already Exists');  
           }  
       });

    it("POST Login Function", async () => {
     let user = {
          email_id: 'testuser@gmail.com1',
          password: 'Test@123'
        };
        const response = await request.post("api/v1/login").send(user);
        if(response.body.statusCode == 200){
        expect(response.body.statusCode).to.equal(200);  
        expect(response.body.statusMessage).to.equal('Login Successfully');  
        } 
        if(response.body.statusCode == 400){
            expect(response.body.statusCode).to.equal(400);  
            expect(response.body.statusMessage).to.equal('Login credentials does not matched');  
        }  
    });

    it("POST Email OR Mobile Number Validation", async () => {
        let data = {
             email_id: 'testuser@gmail.com'
           };
           const response = await request.post("api/v1/validation").send(data);
           if(response.body.statusCode == 200){
           expect(response.body.statusCode).to.equal(200);  
           expect(response.body.statusMessage).to.equal('Email new one!');  
           } 
           if(response.body.statusCode == 400){
               expect(response.body.statusCode).to.equal(400);  
               expect(response.body.statusMessage).to.equal(data.email_id+' Email already exist!');  
           }  
       });

       it("POST Resend OTP", async () => {
        let data = {
             email_id: 'testuser@gmail.com'
           };
           const response = await request.post("api/v1/resendOTP").send(data);
           console.log(response.body.statusMessage)
        //    if(response.body.statusCode == 200){
        //    expect(response.body.statusCode).to.equal(200);  
        //    expect(response.body.statusMessage).to.equal('Email new one!');  
        //    } 
        //    if(response.body.statusCode == 400){
        //        expect(response.body.statusCode).to.equal(400);  
        //        expect(response.body.statusMessage).to.equal(data.email_id+' Email already exist!');  
        //    }  
       });


});

