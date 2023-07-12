<?php
include "./include/db.php";
// $conn for established mysql connections
$email = $_POST['email'];
$password = $_POST['password'];
$query = sprintf("SELECT * FROM user WHERE email='%s' AND password='%s'", 
    mysqli_real_escape_string($conn, $email),
    mysqli_real_escape_string($conn, $password)
); // generate query string with SQL injection protection
$result = $conn->query($query);
if ($result->num_rows === 1){
    //login successful
    session_start();
    $userinfo = $result->fetch_assoc();

    // set variables in session
    $_SESSION['uid'] = $userinfo['uid'];
    $_SESSION['uname'] = $userinfo['uname'];
    $_SESSION['name'] = $userinfo['name'];
    $_SESSION['email'] = $userinfo['email'];
    $_SESSION['phone'] = $userinfo['phone'];
    $_SESSION['avatar'] = $userinfo['avatar'];

    $info = new stdClass();
    $info->uid = $userinfo['uid'];
    $info->uname = $userinfo['uname'];
    $info->name = $userinfo['name'];
    $info->email = $userinfo['email'];
    $info->phone = $userinfo['phone'];
    $info->avatar = $userinfo['avatar'];
    $obj = new stdClass();
    $obj->success = true;
    $obj->info = $info;
    echo json_encode($obj);
}else if($result->num_rows === 0){
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Wrong email or password";
    echo json_encode($obj);
}else{
    $obj = new stdClass();
    $obj->success = false;
    $obj->error = "Unknown error, please contact costomer service";
    echo json_encode($obj);
}
