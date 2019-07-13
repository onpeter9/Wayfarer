const pg = require('pg');
require('custom-env').env(true);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const password = process.env.HASHED_PASSWORD;
const adminPassword = process.env.HASHED_ADMIN_PASSWORD;

const seed = async () => {
  try {
    const seedTables = `
  INSERT INTO users (first_name, last_name, email, password) VALUES ('darkseid', 'darkseid', 'darkseid@apocalypse.com', '${password}');
  INSERT INTO users (first_name, last_name, email, password) VALUES ('Orion', 'darkseid', 'Orion@apocalypse.com', '${password}');
  INSERT INTO users (first_name, last_name, email, password) VALUES ('kalibak', 'darkseid', 'kalibak@apocalypse.com', '${password}');
  INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ('Peter', 'Ebuzome', 'onpeter9@wayfarer.com', '${adminPassword}', true);
  INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ('grayven', 'darkseid', 'grayven@wayfarer.com', '${adminPassword}',true);

  INSERT INTO buses (number_plate, manufacturer, model, year, capacity) VALUES ('APP420EL', 'BMW', 'SCANIA', '2016-02-01', 27);
  INSERT INTO buses (number_plate, manufacturer, model, year, capacity) VALUES ('GBA620TY', 'Toyota', 'Coaster', '2013-02-09', 25);
  INSERT INTO buses (number_plate, manufacturer, model, year, capacity) VALUES ('MUS120wG', 'Toyota', 'Coaster', '2012-02-09', 25);
  INSERT INTO buses (number_plate, manufacturer, model, year, capacity) VALUES ('FST854EJ', 'Mercedes', 'Brabus', '2011-04-10', 30);
  `;

    await pool.query(seedTables);
    console.log('Tables seeded successfully!');
  } catch (error) {
    console.log(error.message);
  }
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = seed;

seed();

require('make-runnable');
