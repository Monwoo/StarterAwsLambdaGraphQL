#!/usr/bin/env bash
# Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

# path to the data folder containg mongo db datas
DATA_FOLDER_PATH=./data
SCRIPT_ACTION=$1
TEST_DB_NAME=demoTest


GREEN='\033[32m'
RED='\033[31m'
YELLOW='\033[33m'
BLUE='\033[34m'
BG_RED='\033[41m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'
COLOR_RESET='\033[0m'

function info() {
    echo -e "$YELLOW$@$COLOR_RESET"
}

# set -x # echo commandes
# echo commandes in green colors
trap 'echo -e "${GREEN}#$LINENO: $BASH_COMMAND$COLOR_RESET";export DEBUGTRAP=$BASH_COMMAND' DEBUG
function err_handler ()
{
    local error_code=${1:-$?}
    echo -e "${BG_RED}# [$error_code] $DEBUGTRAP$COLOR_RESET"
    kill $(jobs -p) # killall background do not seem to work, so using jobs
    wait # wait for all background process to end
    exit "${error_code}"
}
trap err_handler ERR INT TERM

set -e # exit on errors
# $(exit 42) # => throw error code 42 if you use this commande

if [ "$SCRIPT_ACTION" = "show-colors" ]; then
    wget https://www.admin-linux.fr/wp-content/uploads/2013/09/tabColor.sh -O tabColor
    chmod u+x tabColor
    ./tabColor
fi

if [ ! -e "$DATA_FOLDER_PATH" ]; then
    mkdir -p "$DATA_FOLDER_PATH"
    info "Creating directory $DATA_FOLDER_PATH OK"
fi

if [ "$SCRIPT_ACTION" = "install" -o ! -e "$(which mongod)" ]; then
    # https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
    brew install mongodb --with-openssl
    # Before running mongod for the first time, ensure that the user account running mongod has read and write permissions for the directory.
    mongod --version # or in mongo shell, call : db.version()

    SCRIPT_ACTION="load-fixtures" # go to next step
    info 'Install Completed OK'
fi

mongod --dbpath "$DATA_FOLDER_PATH" & # start mongo deamon in backgrond
sleep 2 # wait for mongod to be launched for nexts cmd to work

# for mongo cmd : If a database name is not provided, 'test' will be used.
# In .mongorc.js
# If you want to set a default database without specifying on the command line each time, you can add a line to the .mongorc.js file in your home directory:
# db = db.getSiblingDB("mydb")
# The .mongorc.js file is executed after the mongo shell is started, so if you set a default here it will override a database specified on the command line.

if [ "$SCRIPT_ACTION" = "load-fixtures" ]; then
    mongo $TEST_DB_NAME scripts/fixtures.js

    SCRIPT_ACTION="show-loaded-fixtures" # go to next step
    info 'Fixtures loading OK'
fi

if [ "$SCRIPT_ACTION" = "show-loaded-fixtures" ]; then
    # mongo $TEST_DB_NAME --eval " printjson(db.users.find().toArray())"
    mongo $TEST_DB_NAME scripts/query-users.js

    info 'Fixtures display OK'
fi

# fg => ./start.sh: line 75: fg: no job control, not usable inside script
# fg # bring back mongod to first plan for it to catch script inputs
# but need to enable : set -m, and it's best practice to use wait inside script

# wait for all backgrounds to end
wait

# check of mongod launched :
# ps aux | grep mongod
