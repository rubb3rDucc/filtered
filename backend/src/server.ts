import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server has started running on port http://${hostname}/${port}.`);
});