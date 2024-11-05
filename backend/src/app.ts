import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';
const port = process.env.PORT;
const publicDir = process.argv[2] || __dirname + "/public";
const allowedOrigins = `http://localhost:${port}`;

const app = express();

// Middleware
app.use(cors());
app.use(express.static(publicDir));
app.use(helmet());
app.use(morgan('dev'));
// for cors
app.use((req, res, next) => {
    // const origin : string | undefined = req.headers.origin;
  
    if (allowedOrigins) {
      res.header("Access-Control-Allow-Origin", allowedOrigins);
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
