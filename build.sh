#!/bin/bash
npm run build
cp public/_redirects build/
cp public/404.html build/
