/* eslint-disable no-underscore-dangle */
import clc from 'cli-color';
import express from 'express';
import { routes } from './routes';
import { Methods } from '../types/globals';
import { formatPayloadAndReturnHandler } from '../middlewares/middlewares';

const apiRouter = express.Router();

const getPath = () => `http://localhost:${process.env.PORT || '3030'}/api/v1`;

// ***************** ROUTES *****************

console.log(clc.white(`
*********** ROUTES ***********`));
routes.forEach((route) => {
  if (route.Methods.includes(Methods.GET)) {
    apiRouter.get(route.path, formatPayloadAndReturnHandler(route.handler));
    console.log(`GET: ${clc.green(getPath())}${clc.blueBright(route.path)}`);
  }
  if (route.Methods.includes(Methods.POST)) {
    apiRouter.post(route.path, formatPayloadAndReturnHandler(route.handler));
    console.log(`POST: ${clc.green(getPath())}${clc.blueBright(route.path)}`);
  }
  if (route.Methods.includes(Methods.PUT)) {
    apiRouter.put(route.path, formatPayloadAndReturnHandler(route.handler));
    console.log(`PUT: ${clc.green(getPath())}${clc.blueBright(route.path)}`);
  }
  if (route.Methods.includes(Methods.DELETE)) {
    apiRouter.delete(route.path, formatPayloadAndReturnHandler(route.handler));
    console.log(`DELETE: ${clc.green(getPath())}${clc.blueBright(route.path)}`);
  }
});
console.log(clc.white('*********** ROUTES ***********'));

// ***************** ROUTES *****************

export default apiRouter;
