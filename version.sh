#!/bin/bash

if [ -n "$CI_COMMIT_TAG" ]
then
    echo "$CI_COMMIT_TAG"
else
    if [ "x$(dunamai from git --format '{distance}')" = "x0" ]
    then
        dunamai from git --style=semver --ignore-untracked
    else
        branch="${CI_COMMIT_BRANCH:-$(dunamai from git --format '{branch}')}"
        stage="$(dunamai from git --format '{stage}')"
        case "$branch" in
            develop|dev) dunamai from git --ignore-untracked --pattern '^v((?P<epoch>\d+)!)?(?P<base>\d+(\.\d+)*)$' --bump --format "{base}-dev.{distance}";;
            feature/*) dunamai from git --ignore-untracked --pattern '^v((?P<epoch>\d+)!)?(?P<base>\d+(\.\d+)*)$' --bump --format "{base}-dev.{distance}+${branch/#feature\//}";;
            main|master) dunamai from git --ignore-untracked --bump --format "{base}-${stage:-prod}{revision}.{distance}";;
            release*) dunamai from git --ignore-untracked --bump --format "{base}-${stage:-rc}{revision}.{distance}";;
            bugfix/*) dunamai from git --ignore-untracked --bump --format "{base}-${stage:-hf}{revision}.{distance}+${branch/#bugfix\//}";;
            '') dunamai from git --style=semver --ignore-untracked;;
            *) dunamai from git --ignore-untracked --pattern '^v((?P<epoch>\d+)!)?(?P<base>\d+(\.\d+)*)$' --bump --format "{base}-dev.{distance}+{branch_escaped}";;
        esac
    fi
fi
