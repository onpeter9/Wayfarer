import chai from 'chai';
import assert from 'assert';
import request from 'supertest';
import faker from 'faker';
import app from '..';

const { expect } = chai;
const should = chai.should();

const newUser = {
  email: faker.internet.email(),
  first_name: faker.fake('{{name.firstName}}'),
  last_name: faker.fake('{{name.firstName}}'),
  password: 'Goodwill374',
  confirmPassword: 'Goodwill374',
};

describe('user signup no error', () => {
  it('should successfully signup a user with valid details', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.haveOwnProperty('status');
        res.status.should.equal(201);
        res.should.haveOwnProperty('headers');
        res.headers.should.be.an('object');
        res.headers.should.haveOwnProperty('authorization');
        res.headers.authorization.should.be.a('string');
        const { body } = res;
        body.should.haveOwnProperty('status');
        body.status.should.equal(201);
        body.should.haveOwnProperty('data');
        const { data } = body;
        data.should.be.an('object');
        data.should.haveOwnProperty('token');
        data.token.should.be.a('string');
        data.should.haveOwnProperty('id');
        data.id.should.be.a('string');
        data.should.haveOwnProperty('email');
        data.email.should.be.a('string');
        data.should.haveOwnProperty('first_name');
        data.first_name.should.be.a('string');
        data.should.haveOwnProperty('last_name');
        data.last_name.should.be.a('string');
        data.should.haveOwnProperty('is_admin');
        data.is_admin.should.be.a('boolean'); 

        done();
      });
  });
});

describe('user signup email already registered error', () => {
  it('should unsuccessfully signup a user with a registered email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .send(newUser)
      .end((err, res) => {
        const { body } = res;     
        expect(res).to.haveOwnProperty('status');
        expect(res.status).to.be.a('number');
        expect(res.status).to.be.equal(409);
        expect(body).to.be.an('object');
        expect(body).to.haveOwnProperty('status');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(409);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal('Already registered with this email! Please use another email');

        done();
      });
  });
});

describe('user signup error invalid last name', () => {
  it('should unsuccessfully signup a user with invalid last name', (done) => {
    newUser.lastName = `. ..@ 
                         \n'''''....`;
    request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.haveOwnProperty('status');
        expect(res.status).to.be.a('number');
        expect(res.status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.haveOwnProperty('status');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body).to.haveOwnProperty('error');

        done();
      });
  });
});

describe('user signup error improper password', () => {
  it('should unsuccessfully signup a user with improper password', (done) => {
    newUser.password = 'fresse';
    request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        const { body } = res;
        expect(res).to.haveOwnProperty('status');
        expect(res.status).to.be.a('number');
        expect(res.status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.haveOwnProperty('status');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal(`Your Password must be between 6-25 characters long lowercase alphabets or including at least 1 uppercase, and 1 digit Eg: People12`);

        done();
      });
  });
});

describe('user signup error invalid email', () => {
  it('should unsuccessfully signup a user with invalid email', (done) => {
    newUser.email = 'Darkseidlord';
    request(app)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        const { body } = res;        
        expect(res).to.haveOwnProperty('status');
        expect(res.status).to.be.a('number');
        expect(res.status).to.be.equal(400);
        expect(body).to.be.an('object');
        expect(body).to.haveOwnProperty('status');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equal(400);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal('Please enter a valid email address. Example 0: "darkseid@apocalypse.com"'); 

        done();
      });
  });
});
