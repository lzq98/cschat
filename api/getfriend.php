<?php
include "./include/requirelogin.php";
include "./include/db.php";

$uid = $_SESSION['uid'];

$query = sprintf(
    "SELECT friends.relationid, friends.sender, friends.receiver, friends.time, 
    chat.type, chat.sender AS stext, chat.receiver AS rtext FROM friends 
    LEFT JOIN chat ON friends.message=chat.chatid 
    WHERE (friends.sender=1 OR friends.receiver=1) AND isfriend=true ",
    $uid,
    $uid
); // no need for SQL injection protection because no user input
$result = $conn->query($query);

$friends = array();
$_SESSION['relations'] = [];
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $friends[$row['sender'] == $uid ? $row['receiver'] : $row['sender']] =
            array(
                'relationid' => $row['relationid'],
                'time' => $row['time'],
                'message' => array(
                    'type' => $row['stext'],
                    'sender' => $row['stext'],
                    'receiver' => $row['rtext']
                )
            );
        $_SESSION['relations'][$row['relationid']] = $row['sender'] == $uid ? "sender" : "receiver";
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
