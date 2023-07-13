<?php
include "./include/requirelogin.php";
include "./include/db.php";
//{"relation": id, "count": 0, "request": 20}

$relation = $_POST['relation'];
$count = $_POST['count'];
// first check if the relationship exists or relation id is valid
if (is_numeric($relation) && is_numeric($count)){
    if (array_key_exists($relation, $_SESSION['relations'])){
        //echo "relation exists";
    }
}


$query = sprintf(
    "SELECT time, type, sender, receiver FROM chat WHERE relationid = %s ORDER BY chatid DESC LIMIT %s, 20",
    mysqli_real_escape_string($conn, $relation),
    mysqli_real_escape_string($conn, $count)// SQL injection protection
);

$result = $conn->query($query);

$chatHistory = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($chatHistory, $row);
    }
}

echo json_encode($chatHistory);