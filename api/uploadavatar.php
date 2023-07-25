<?php
include "./include/requirelogin.php";
include "./include/db.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //var_dump($_FILES);
    $result = ["status" => "failed"];
    $file = $_FILES["image"];
    if ($file["error"] == 0) {
        // success received img
        $filetype = explode("/", $file["type"]);
        if ($filetype[0] == "image") {
            // is image
            if (in_array($filetype[1], array("jpg", "png", "jpeg"))) {
                // only accept jpg, png and jpeg images

                $hash = md5_file($file["tmp_name"]);
                $dir = "../upload/img/avatar/";
                $newfilename = $hash . "." . $filetype[1];

                $newpath = $dir . $newfilename;

                if (move_uploaded_file($file["tmp_name"], $newpath)){
                    $_SESSION['avatar'] = $newfilename;

                    $query = sprintf(
                        "UPDATE user SET avatar = '%s' WHERE uid = '%s'",
                        $newfilename,
                        $_SESSION['uid']
                    );
                    if ($conn->query($query) === TRUE) {
                        $result = ["status" => "success", "avatar" => $newfilename];
                    }
                }
            }
        }
    }
    echo json_encode($result);
} else {
    echo "This page can only accessed by POST method.";
    header("Location:/index.html");
}
