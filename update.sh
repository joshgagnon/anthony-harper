git pull
rm -rf node_modules/anthony-harper-templates


yarn install --check-files
rm serviceIsLive.flag
pm2 stop ah.config.json
NODE_ENV=production webpack
pm2 start ah.config.json --env production

