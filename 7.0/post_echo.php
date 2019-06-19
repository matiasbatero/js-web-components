<?php

$req = json_decode( file_get_contents('php://input') );


$response = new stdClass();
$response->rows = array();
$response->pagesize = $req->pagesize;
$response->page = $req->page;
$response->order = $req->order;
$response->ascending = $req->ascending;

echo json_encode( $response );

?>
