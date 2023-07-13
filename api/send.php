<?php
include "./include/requirelogin.php";
include "./include/db.php";

$relation = $_POST['relation'];
$type = $_POST['type'];
$sender = $_POST['sender'];
$receiver = $_POST['receiver'];
$time = floor(microtime(true) * 1000);
// first check if the relationship exists or relation id is valid
if (is_numeric($relation) && is_numeric($type)) {
    if (array_key_exists($relation, $_SESSION['relations'])) {
        //echo "relation exists";
    }
}


$query = sprintf(
    "INSERT INTO chat (`relationid`, `time`, `type`, `sender`, `receiver`) VALUES (%s, %s, %s, '%s', '%s')",
    mysqli_real_escape_string($conn, $relation),
    $time, // current timestamp
    mysqli_real_escape_string($conn, $type),
    mysqli_real_escape_string($conn, $sender),
    mysqli_real_escape_string($conn, $receiver)
);
$sendresult = ["status" => "failed"];
if ($conn->query($query) === TRUE) {
    $sendresult = ["status" => "partial"];
    $query = sprintf(
        "SELECT LAST_INSERT_ID()"
    );

    $result = $conn->query($query);
    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_assoc($result);
        $lastmessageid = $row['LAST_INSERT_ID()'];
        $query = sprintf(
            "UPDATE `friends` SET `time` = '%s', `message` = '%s' WHERE `friends`.`relationid` = %s",
            $time,
            $lastmessageid,
            mysqli_real_escape_string($conn, $relation),
        );
        if ($conn->query($query) === TRUE){
            $sendresult = ["status" => "success"];
        }
    }
}
echo json_encode($sendresult);
