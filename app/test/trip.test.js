import chai from 'chai';
import chaiUUID from 'chai-uuid';
import assert from 'assert';
import request from 'supertest';
import { Pool } from 'pg';
import app from '..';
import config from '../config';


chai.use(chaiUUID);
const should = chai.should();

const { dbUrl } = config;

const pool = new Pool({
  connectionString: dbUrl,
});

describe('admin creates a trip: "no error"', () => {
  pool.connect();
  let adminToken;

  before('Get adminToken', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({ email: config.admin, password: config.adminPassword })
      .catch((errors) => {
        console.error(errors);
        throw errors;
      });
    adminToken = await res.body.data.token;
  });

  it('should create a trip', async () => {
    let bus_id;
    let newTrip;
    try {
      const results = await pool.query('SELECT * FROM buses;');
      bus_id = await results.rows[0].id;
      newTrip = await {
        token: adminToken,
        bus_id,
        origin: 'krypton',
        destination: 'kandor',
        fare: 1000,
      };
    } catch (e) {
      return console.error(e);
    }
    
    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(201);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('success');
    resp.body.should.haveOwnProperty('data');
    const { data } = resp.body;
    data.should.be.an('object');
    data.should.haveOwnProperty('id');
    data.id.should.be.a('string');
    data.id.should.be.a.uuid('v4');
    data.should.haveOwnProperty('bus_id');
    data.bus_id.should.be.a('string');
    data.bus_id.should.be.a.uuid('v4');
    data.should.haveOwnProperty('origin');
    data.origin.should.be.a('string');
    data.should.haveOwnProperty('destination');
    data.destination.should.be.a('string');
    data.should.haveOwnProperty('trip_date');
    data.trip_date.should.be.a('string');
    data.should.haveOwnProperty('fare');
    data.should.haveOwnProperty('status');
    data.status.should.be.a('string');
    data.status.should.equal('active');
  });

  it('should fail to create a trip: "invalid token error"', async () => {
    let bus_id;
    let newTrip;
    try {
      const results = await pool.query('SELECT * FROM buses');
      bus_id = await results.rows[0].id;
      newTrip = await {
        token: `${adminToken}jorel`,
        bus_id,
        origin: 'krypton',
        destination: 'kandor',
        fare: 10000,
      };
    } catch (e) {
      return console.error(e);
    }

    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(401);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('error');
    resp.body.should.haveOwnProperty('error');
    resp.body.error.should.be.a('string');
    resp.body.error.should.equal('Unauthorized: Admin Invalid token');
  });

  it('should fail to create a trip: "Invalid bus id"', async () => {
    const newTrip = await {
      token: adminToken,
      bus_id: 'kalel',
      origin: 'krypton',
      destination: 'kandor',
      fare: 10000,
    };

    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(400);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('error');
    resp.body.should.haveOwnProperty('error');
    resp.body.error.should.be.a('string');
    resp.body.error.should.equal(
      'Please enter a valid bus id. The bus_id format shoud be "uuid version 4"',
    );
  });

  it('should fail to create a trip: "Invalid origin error"', async () => {
    let bus_id;
    let newTrip;
    try {
      const results = await pool.query('SELECT * FROM buses');
      bus_id = await results.rows[0].id;
      newTrip = await {
        token: adminToken,
        bus_id,
        origin: 777,
        destination: 'kandor',
        fare: 10000,
      };
    } catch (e) {
      return console.error(e);
    }

    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(400);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('error');
    resp.body.should.haveOwnProperty('error');
    resp.body.error.should.be.a('string');
    resp.body.error.should.equal(
      'Please enter the origin. It should be alphanumerical with least 2 or at most 30 characters',
    );
  });


  it('should fail to create a trip: "Invalid destination error"', async () => {
    let bus_id;
    let newTrip;
    try {
      const results = await pool.query('SELECT * FROM buses');
      bus_id = await results.rows[0].id;
      newTrip = await {
        token: adminToken,
        bus_id,
        destination: 8870,
        origin: 'krypton',
        fare: 1000,
      };
    } catch (e) {
      return console.error(e);
    }

    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(400);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('error');
    resp.body.should.haveOwnProperty('error');
    resp.body.error.should.be.a('string');
    resp.body.error.should.equal(
      'Please enter the destination. It should be alphanumerical with at least 2 or at most 30 characters',
    );
  });

  it('should fail to create a trip: "Invalid fare error"', async () => {
    let bus_id;
    let newTrip;
    try {
      const results = await pool.query('SELECT * FROM buses');
      bus_id = await results.rows[0].id;
      newTrip = await {
        token: adminToken,
        bus_id,
        destination: 'kandor',
        origin: 'krypton',
        fare: 100,
      };
    } catch (e) {
      return console.error(e);
    }

    const resp = await request(app)
      .post('/api/v1/trips')
      .send(newTrip);

    resp.status.should.equal(400);
    resp.body.should.haveOwnProperty('status');
    resp.body.status.should.be.a('string');
    resp.body.status.should.equal('error');
    resp.body.should.haveOwnProperty('error');
    resp.body.error.should.be.a('string');
    resp.body.error.should.equal(
      'Please enter the fare. It should be at least 500',
    );
  });
});
