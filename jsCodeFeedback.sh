# To run this file: bash jsCodeFeedback.sh

function installEslintIfMissing() {
  if ! [ -x "$(command -v eslint)" ]; then
    echo 'Error: eslint is not set up or installed.'
    npm install # this will install all the dependencies in package.json
    # could specifically install these dependencies:
    # npm install --save-dev eslint eslint-config-google eslint-plugin-html
  fi
}

function giveFeedback() {
  eslint templates/*.html
  # example: 11:9  error  This line has a length of 87. Maximum allowed is 80   max-len
  # 11 means "line 11"
  echo
  echo "JS linter finished checking JS code."
}

installEslintIfMissing
giveFeedback
