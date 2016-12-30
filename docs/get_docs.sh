#!/bin/bash

wget https://raw.githubusercontent.com/thenativeweb/limes/master/README.md -O limes.md
wget https://raw.githubusercontent.com/zappajs/zappajs/3.x/docs/reference.md -O zappajs.md
wget https://raw.githubusercontent.com/barrysteyn/node-scrypt/master/README.md -O scrypt.md
wget https://raw.githubusercontent.com/jfromaniello/express-unless/master/README.md -O express-unless.md
wget https://raw.githubusercontent.com/lodash/lodash/master/doc/README.md -O lodash.md
wget https://raw.githubusercontent.com/groupon/cson-parser/master/README.md -O cson-parser.md
wget https://raw.githubusercontent.com/denghongcai/node-lru-addon/master/README.md -O lru-addon.md
wget https://raw.githubusercontent.com/aseemk/requireDir/master/README.md -O require-dir.md
wget https://raw.githubusercontent.com/ljharb/qs/master/README.md -O qs.md
wget https://raw.githubusercontent.com/expressjs/morgan/master/README.md -O morgan.md
wget https://raw.githubusercontent.com/request/request/master/README.md -O request.md
wget https://raw.githubusercontent.com/chjj/marked/master/README.md -O marked.md
wget https://raw.githubusercontent.com/leungwensen/marked-plus/master/README.md -O marked-plus.md
wget https://raw.githubusercontent.com/visionmedia/debug/master/Readme.md -O debug.md
wget https://raw.githubusercontent.com/goodeggs/teacup/master/README.md -O teacup.md
wget https://raw.githubusercontent.com/goodeggs/teacup-camel-to-kebab/master/README.md -O teacup-camel-to-kebab.md
wget https://raw.githubusercontent.com/philbooth/check-types.js/master/README.md -O check-types.md

git clone https://github.com/1602/jugglingdb.git
mv jugglingdb/docs/ .
rm -Rf jugglingdb/
mv docs/ jugglingdb

git clone https://github.com/postcss/postcss
mv postcss/docs/ .
rm -Rf postcss/
mv docs/ postcss
