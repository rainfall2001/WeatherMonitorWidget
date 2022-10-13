<?php

	//connect to the database 
    require_once('connect.php');

    //create the sql query and send it
    $query = "SELECT * FROM `town`";
    $result = $con->query($query);

    $towns = array();

    if($result != FALSE){
        while($row = $result->fetch()) {
            $towns[] = $row;
        }
    }
    echo json_encode($towns);   
?>