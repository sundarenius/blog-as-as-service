echo "Push to baas-server-production" &&
echo "heroku container:push web -a baas-server-production --arg APP_ENV=production:" &&
heroku container:push web -a baas-server-production --arg APP_ENV=production &&
echo "container:release web -a baas-server-production:" &&
heroku container:release web -a baas-server-production

echo "Deployed!"