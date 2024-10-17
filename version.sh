#!/bin/bash
set -e

function version() {
    local args=()
    local pattern="default-unprefixed"
    while [[ $# -gt 0 ]]; do case "$1" in
            --since-release) pattern='^((?P<epoch>\d+)!)?(?P<base>\d+(\.\d+)*)$'; shift;;
            --pattern) pattern=$2; shift 2;;
            *) args+=("$1"); shift;;
    esac done
    set -- "${args[@]}"
    dunamai from git --strict --ignore-untracked --pattern "$pattern" $@
}

if [ -n "$CI_COMMIT_TAG" ]
then
    echo "$CI_COMMIT_TAG"
else
    if [ "x$(version --format '{distance}')" = "x0" ]
    then
        version --style=semver
    else
        branch="${CI_MERGE_REQUEST_SOURCE_BRANCH_NAME:-${CI_COMMIT_BRANCH:-$(dunamai from git --format '{branch}')}}"
        stage="$(version --format '{stage}')"
        case "$branch" in
            develop|dev) version --bump --since-release --format "{base}-dev.{distance}";;
            feature/*) version --bump --since-release --format "{base}-dev.{distance}_${branch/#feature\//}";;
            main|master) version --bump --format "{base}-${stage:-prod}{revision}.{distance}";;
            release*) version --bump --format "{base}-${stage:-rc}{revision}.{distance}";;
            bugfix/*) version --bump --format "{base}-${stage:-hf}{revision}.{distance}_${branch/#bugfix\//}";;
            '') version --bump --style=semver | sed 's/[^a-zA-Z\d_.-]/_/g';;
            *) version --bump --since-release --format "{base}-dev.{distance}_{branch_escaped}";;
        esac
    fi
fi
