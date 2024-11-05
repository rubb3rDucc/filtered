import dotenv from 'dotenv';
import { app } from './app';
import { client } from './database/dbConnection';
import request from 'supertest';

dotenv.config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

app.listen(port, () => {
  // console.log(`Server has started running on port http://${hostname}/${port}.`);
});

app.get("/", (req, res) => {
  res.send('Hello');
});

app.get('/db/getAllArtists', async (req, res) => {
  const artists = await client.selectFrom('songs').select('artist_name').execute();
  // console.log(artists);
  res.send(artists);
});

module.exports = {
  app
}

