#!/usr/bin/env bash
# Merge sleep log
# Copyright (c) 2018 Koichi OKADA. All rights reserved.

awk '{printf("%s,%d,%s\n", $1$2, NR, $0)}' "$@" \
| sort -n \
| sed -r -e 's/^([^,]*,){2}//g'
