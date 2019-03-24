#! /bin/bash

cd build

git init

git config user.email "thibault.friedrich@gmail.com"
git config user.name "Thibault Friedrich"

git add .
git commit -am "new files"
git remote add deploy git@github.com:assistant-os/assistant-os.github.io.git

echo $GIT_PUSH_SSH_KEY > .ssh_key

ssh-agent sh -c 'ssh-add .ssh_key;
git push -f deploy master
