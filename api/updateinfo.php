<?php
include "./include/requirelogin.php";
include "./include/db.php";

$uname = $_POST['uname'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// valid and sanitize input
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    // email
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Invalid email";
    echo json_encode($obj);
    exit();
}
if (!preg_match("/^[0-9]{9,10}$/", $phone) && $phone != "") {
    // RSA public key
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Invalid phone number";
    echo json_encode($obj);
    exit();
}
$uname = htmlentities($uname);
$name = htmlentities($name);
$email = strtolower(htmlentities($email));

$query = sprintf(
    "UPDATE `user` SET `uname` = '%s', `name` = '%s', `email` = '%s', `phone` = '%s' WHERE `uid` = %s",
    mysqli_real_escape_string($conn, $uname),
    mysqli_real_escape_string($conn, $name),
    mysqli_real_escape_string($conn, $email),
    $phone,
    $_SESSION['uid']
);
if ($conn->query($query) === TRUE) {
    $obj = new stdClass();
    $obj->success = true;
    echo json_encode($obj);
} else {
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Unknown error, please contact costomer service";
    echo json_encode($obj);
}
