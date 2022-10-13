<?php
//connect to the database
try{
    $con = new PDO('mysql:host=localhost','root','');
} catch (PDOException $e) {
    echo "New Database connection error " . $e->getMessage();
}
?>