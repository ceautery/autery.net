#!/bin/zsh

if [[ -v bucket ]]; then
  cd dist
  for x (**/*.html) aws s3 cp $x s3://$bucket/$x
else
  echo 'Set bucket variable first'
fi
