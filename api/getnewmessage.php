<?php
include "./include/requirelogin.php";
include "./include/db.php";
//{"relation": id, "count": 0, "request": 20}

$relation = $_POST['relation'];
$lastmessage = $_POST['lastmessage'];
// first check if the relationship exists or relation id is valid
if (is_numeric($relation) && is_numeric($lastmessage)) {
    if (array_key_exists($relation, $_SESSION['relations'])) {
        //echo "relation exists";
    }
}


$query = sprintf(
    "SELECT chatid, time, type, sender, receiver FROM chat WHERE relationid = %s AND chatid > %s",
    mysqli_real_escape_string($conn, $relation),
    mysqli_real_escape_string($conn, $lastmessage)
);

$result = $conn->query($query);

$chatHistory = array();
if (mysqli_num_rows($result) > 0) {
    // user have new messages
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($chatHistory, $row);
    }

    // clear unread count
    $query = sprintf(
        "UPDATE `friends` SET %s = 0 WHERE relationid = %s",
        $_SESSION['relations'][$relation] === "sender" ? "sunread" : "runread",
        mysqli_real_escape_string($conn, $relation)
    );
    $conn->query($query); 
    // Do not need result
}

echo json_encode($chatHistory);
