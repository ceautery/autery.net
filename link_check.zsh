#!/bin/zsh

if [ $# -eq 0 ]; then
  echo "Usage: ./link_check.zsh <glob_pattern>"
  exit 1
fi

local skip_domains=("stackoverflow.com" "pubs.aip.org" "peacemaker.un.org" "academic.oup.com")
local get_domains=("audible.com")

# Use ag to find all markdown files
for file in $~1; do
  # Use ag to extract links from the markdown file
  links=($(ag -o '(?<=\()(http.*?)(?=\))' "$file"))

  # Check each link
  for link in $links; do
    for domain in $skip_domains; do
      if [[ $link =~ $domain ]]; then
        printf "\r%*s\r" $(tput cols) ""
        echo "Skipping $link"
        continue 2
      fi
    done

    printf "\r%*s\r" $(tput cols) ""
    printf "\rProcessing %s..." "$link"

    use_get=0
    for domain in $get_domains; do
      if [[ $link =~ $domain ]]; then
        use_get=1
        break
      fi
    done

    if [ $use_get -eq 1 ]; then
      response=$(curl -s -i -A "LinkCheckerBot/1.0" "$link" | head)
    else
      response=$(curl -s -I -A "LinkCheckerBot/1.0" "$link")
    fi

    status_code=$(echo "$response" | head -n 1 | cut -d ' ' -f 2)

    if [ $status_code -eq 301 ] || [ $status_code -eq 302 ]; then
      location=$(echo "$response" | grep -i '^Location:' | cut -d ':' -f 2- | tr -d '\r')
      printf "\r%*s\r" $(tput cols) ""
      echo "Redirected link in $file: $link -> $location ($status_code)"
    elif ! echo "$response" | grep -q '^HTTP/.* 2'; then
      printf "\r%*s\r" $(tput cols) ""
      echo "Broken link in $file: $link ($status_code)"
    fi
  done
done
