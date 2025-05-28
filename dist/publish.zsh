#!/bin/zsh

if [[ -v BLOG_BUCKET && -v BLOG_DISTRO_ID ]]; then
  files=(${@:-**/*.html})
  for x ($files) aws s3 cp "$x" "s3://$BLOG_BUCKET/$x"

  if (( $#@ )); then
    paths=()
    for x ($files) paths+=("\"/${x%.html}\"")
    paths_str="${(j: :)paths}"
    invalidation_paths_str="--paths ${paths_str}"
  else
    invalidation_paths_str='--paths "/*"'
  fi

  aws cloudfront create-invalidation --distribution-id $BLOG_DISTRO_ID $invalidation_paths_str
else
  echo 'Set BLOG_BUCKET and BLOG_DISTRO_ID variables first'
fi
