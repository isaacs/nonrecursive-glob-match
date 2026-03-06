#!/bin/bash

m () {
  [ -e "$1" ] || mkdir -p "$1"
}

m t/zy
m t/by
m t/xxy
m t/ay
m t/zzy
m t/z
m t/.foo
m t/zxy
m t/foo
m t/axy
m t/xzy
m t/aaaaaa
m t/x
m t/xy
m t/y
m t/xby
