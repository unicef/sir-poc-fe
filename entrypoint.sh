#!/bin/bash

envsubst < /code/index.html > /tmp/index.html
mv /tmp/index.html /code/index.html

exec "${@}"
