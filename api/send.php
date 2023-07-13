<?php
include "./include/requirelogin.php";
include "./include/db.php";

$relation = $_POST['relation'];
$type = $_POST['type'];
$sender = $_POST['sender'];
$receiver = $_POST['receiver'];
// first check if the relationship exists or relation id is valid
if (is_numeric($relation) && is_numeric($type)){
    if (array_key_exists($relation, $_SESSION['relations'])){
        //echo "relation exists";
    }
}


$query = sprintf(
    "INSERT INTO chat (`relationid`, `time`, `type`, `sender`, `receiver`) VALUES (%s, %s, %s, '%s', '%s')",
    mysqli_real_escape_string($conn, $relation),
    floor(microtime(true) * 1000), // current timestamp
    mysqli_real_escape_string($conn, $type),
    mysqli_real_escape_string($conn, $sender),
    mysqli_real_escape_string($conn, $receiver)
);
if ($conn->query($query) === TRUE) {
    echo json_encode(["status"=>"success"]);
}else{
    echo json_encode(["status"=>"false"]);
}