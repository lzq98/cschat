<?php
// this is a page that do not require friendship and for seaching purposes, only display necessary information
// Only display publicly available information. 
//include "./include/requirelogin.php";
include "./include/db.php";
$users = $_POST['users'];
$values = implode(',', $users);
$query = sprintf(
    "SELECT uid, uname, email, avatar, FROM user WHERE uid IN (%s)",
    mysqli_real_escape_string($conn, $values)// SQL injection protection
);

$result = $conn->query($query);

$usersinfo = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $usersinfo[$row['uid']] = $row;
    }
}

echo json_encode($usersinfo);