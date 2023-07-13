<?php
//include "./include/requirelogin.php";
include "./include/db.php";
$users = $_POST['users'];
$values = implode(',', $users);
$query = sprintf(
    "SELECT uid, uname, name, email, phone, avatar, publicKey FROM user WHERE uid IN (%s)",
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