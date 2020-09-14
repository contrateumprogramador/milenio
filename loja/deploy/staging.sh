#!/bin/bash
npm run build
rsync -arPv dist milenio@server.mileniomoveis.com.br:/home/milenio/staging