<?php
session_start();
session_destroy();

$obj = new stdClass();
$obj->success = true;
echo json_encode($obj);
