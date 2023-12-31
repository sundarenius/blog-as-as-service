import createError from 'http-errors';
import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import apiRouter from './routes/api-router';

// eslint-disable-next-line no-underscore-dangle

const app: any = express();

const whiteListedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:3030/',
  'http://13.48.104.149', // ec2 instance
  'https://www.blog.jwdate.org',
  'https://www.jwdate.org',
  'http://www.jwdate.org',
  'https://www.philippinebeauty.com',
  'http://www.philippinebeauty.com',
  'https://www.blog.philippinebeauty.com',
  'https://www.queenofafrica.org',
  'https://www.blog.queenofafrica.org',
  'https://www.globeromance.com',
  'https://www.blog.globeromance.org',
  'https://www.blog.disabilitymatch.org',
  'https://www.disabilitymatch.org',
];

const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;
  if (whiteListedOrigins.includes(req.header('Origin'))) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// USE AWS gateway for cors and auth
const initExpressConfig = async () => {
  app.use(cors(corsOptionsDelegate));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Custom middlewares
  app.use((res: any, req: any, next: any) => {
    console.log('Custom middleware triggered, doing nothing');
    next();
  });

  app.use('/api/v1', apiRouter);

  if (process.env.SERVE_STATIC) {
    serveStatic(app);
  }

  // error handlers
  app.use((req: any, res: any, next: any) => {
    next(createError(404));
  });
  app.use((err: any, req: any, res: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const serveStatic = (app: Express) => {
  console.log('Mode: process.env.PROD_AND_SERVE_STATIC');
};

export default initExpressConfig;
