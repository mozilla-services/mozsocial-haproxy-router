# mozsocial-haproxy-router
haproxy router

## test config
haproxy -f haproxy.cfg -c

## test via node:
MOZSOC_HOST=stage.moztodon.nonprod.webservices.mozgcp.net MOZSOC_URL=https://stage.mozsoc-router.nonprod.webservices.mozgcp.net npm run start
