<?php
include "./include/db.php";
// $conn for established mysql connections
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$publickey = $_POST['publickey'];

// valid and sanitize input
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    // email
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Invalid email";
    echo json_encode($obj);
    exit();
}
if (!preg_match("/^.*\=$/", $publickey) || strlen($publickey) != 172) {
    // RSA public key
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Invalid publickey";
    echo json_encode($obj);
    exit();
}
if (!preg_match("/^[0-9a-fA-F]*$/", $password) || strlen($password) != 64) {
    // SHA256 password
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Invalid password";
    echo json_encode($obj);
    exit();
}
$name = htmlentities($name);
$email = strtolower(htmlentities($email));
$password = htmlentities($password);
$publickey = htmlentities($publickey);

$query = sprintf(
    "SELECT email FROM user WHERE email='%s'",
    mysqli_real_escape_string($conn, $email)
); // generate query string with SQL injection protection
$result = $conn->query($query);
if ($result->num_rows === 0) {
    $query = sprintf(
        "INSERT INTO `user` (`password`, `uname`, `email`, `publicKey`) VALUES ('%s', '%s', '%s', '%s')",
        mysqli_real_escape_string($conn, $password),
        mysqli_real_escape_string($conn, $name),
        mysqli_real_escape_string($conn, $email),
        mysqli_real_escape_string($conn, $publickey),
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
} else if ($result->num_rows >= 0) {
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Email already exists";
    echo json_encode($obj);
} else {
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Unknown error, please contact costomer service";
    echo json_encode($obj);
}
