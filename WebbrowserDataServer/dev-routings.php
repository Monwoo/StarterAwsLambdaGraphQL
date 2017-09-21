<?php

// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

function consoleLog($level, $msg) {
    file_put_contents("php://stdout", "[" . $level . "] " . $msg . "\n");
}

consoleLog('info', "Will check route for : " . $_SERVER["REQUEST_URI"]);

/////////////////////////////////// Routes rewritings : ////////////////////////

if (preg_match('/^\/$/', $_SERVER["REQUEST_URI"])) {
    include __DIR__ . '/build/serveur.html';
} else {
    return false;
}
