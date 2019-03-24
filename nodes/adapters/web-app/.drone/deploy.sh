#! /bin/bash

cd build

git init

git config user.email "thibault.friedrich@gmail.com"
git config user.name "Thibault Friedrich"

git add .
git commit -am "new files"
git remote add deploy git@github.com:assistant-os/assistant-os.github.io.git

echo $GIT_PUSH_SSH_KEY > .ssh_key

# mkdir ~/.ssh
# touch ~/.ssh/config
# echo "Host github.com" > ~/.ssh/config
# echo "  User git" >> ~/.ssh/config
# echo "  Hostname github.com" >> ~/.ssh/config
# echo "  IdentityFile $PWD/.ssh_key" >> ~/.ssh/config

GIT_SSH_COMMAND="ssh -i $PWD/.ssh_key -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"

git push -f deploy master
