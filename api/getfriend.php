<?php
include "./include/requirelogin.php";
include "./include/db.php";

$uid = $_SESSION['uid'];
$uid = '1';
$query = sprintf(
    "SELECT * FROM friends WHERE (sender='%s' OR receiver='%s') AND isfriend=true ORDER BY time DESC",
    $uid,
    $uid
); // no need for SQL injection protection because no user input
$result = $conn->query($query);

$contactlist = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($contactlist, $row);
    }
}

echo json_encode($contactlist);