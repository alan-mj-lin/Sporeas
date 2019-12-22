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
  echo
  read -p "Do you want to continue and get feedback on templates/index.html? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    eslint templates/index.html
  fi
  echo
  read -p "Do you want to continue and get feedback on templates/form.html? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    eslint templates/form.html
  fi
  echo
  echo "Done."
}

installEslintIfMissing
giveFeedback
