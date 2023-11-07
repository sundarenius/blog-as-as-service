echo "Running 'start-cmd.sh' script"
echo "The value of ENVIRONMENT is (set in heroku) ${ENVIRONMENT}"
yarn start:${ENVIRONMENT}