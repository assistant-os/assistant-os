#! /bin/bash

echo $GIT_PUSH_SSH_KEY > .ssh_key

cd build



git init

git config user.email "thibault.friedrich@gmail.com"
git config user.name "Thibault Friedrich"

git add .
git commit -am "new files"
git remote add deploy git@github.com:assistant-os/assistant-os.github.io.git


GIT_SSH_COMMAND="ssh -i ./ssh_key" git push -f deploy master
