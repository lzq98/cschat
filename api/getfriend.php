<?php
include "./include/requirelogin.php";
include "./include/db.php";

$uid = $_SESSION['uid'];

$query = sprintf(
    "SELECT relationid, sender, receiver, time, message FROM friends WHERE (sender='%s' OR receiver='%s') AND isfriend=true",
    $uid,
    $uid
); // no need for SQL injection protection because no user input
$result = $conn->query($query);

$friends = array();
$_SESSION['relations'] = [];
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $friends[$row['sender'] == $uid ? $row['receiver'] : $row['sender']] =
            array('relationid' => $row['relationid'],
            'time' => $row['time'],
            'message' => $row['message']
        );
        $_SESSION['relations'][$row['relationid']] = true;
    }
}

$query = sprintf(
    "SELECT uid, uname, name, email, avatar, publickey FROM user WHERE uid IN (%s)",
    implode(',', array_keys($friends))
);

$result = $conn->query($query);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $friends[$row['uid']]["info"] = $row;
    }
}
echo json_encode($friends);
