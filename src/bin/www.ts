#!/usr/bin/env node

/**
 * Module dependencies.
 */
import initExpressConfig from '../main';

/**
  * Get port from environment and store in Express.
  */

const port = process.env.PORT || '3030';

const handleStart = async () => {
  const app = await initExpressConfig();
  app.set('port', port);

  app.listen(app.get('port'), () => console.log(`🚀 Server ready at port: ${port}`));
};

handleStart();
