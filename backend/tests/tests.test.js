const request = require('supertest');
const server = require('../dist/server').app;
const dbConnection = require('../dist/database/dbConnection').client;

describe('Test base', () => {
  afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    try {
      dbConnection.destroy();
    } catch (error) {
      console.log(`
          You did something wrong dummy!
          ${error}
        `);
      throw error;
    }
  });

  test('it GETs /', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
    done();
  });

  test('GET /db/getAllArtists', (done) => {
    request(server)
      .get('/db/getAllArtists')
      //   .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      });
    done();
  }, 30000);
});
