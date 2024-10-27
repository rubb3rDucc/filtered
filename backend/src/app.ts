import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';

const publicDir = process.argv[2] || __dirname + "/public";
const allowedOrigins = ["http://localhost:*"];

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan(':id :method :url :response-time'));
app.use(express.static(publicDir));
// for cors
app.use((req, res, next) => {
    const origin = req.headers.origin!;
  
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
  
    next();
});


export { app };
