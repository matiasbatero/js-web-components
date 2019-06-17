<?php

$json_test = "{ \"page\":2,
        \"order\":\"surname\",
        \"ascending\": true,
        \"canFetchMore\": true,
        \"rows\": [
        {
            \"index\": 1,
            \"index_start_at\": 56,
            \"integer\": 16,
            \"float\": 13.1539,
            \"name\": \"Paige\",
            \"surname\": \"Christensen\",
            \"fullname\": \"Arthur Garrett\",
            \"email\": \"mark@ritchie.ca\",
            \"bool\": false
        },
        {
            \"index\": 2,
            \"index_start_at\": 57,
            \"integer\": 44,
            \"float\": 12.5752,
            \"name\": \"Zachary\",
            \"surname\": \"Monroe\",
            \"fullname\": \"Marc Henry\",
            \"email\": \"suzanne@underwood.uz\",
            \"bool\": true
        },
        {
            \"index\": 3,
            \"index_start_at\": 58,
            \"integer\": 38,
            \"float\": 13.597,
            \"name\": \"Beth\",
            \"surname\": \"Berg\",
            \"fullname\": \"Diana Creech\",
            \"email\": \"chris@morgan.gm\",
            \"bool\": true
        },
        {
            \"index\": 4,
            \"index_start_at\": 59,
            \"integer\": 8,
            \"float\": 14.7075,
            \"name\": \"Lynne\",
            \"surname\": \"Rao\",
            \"fullname\": \"Melanie Lin\",
            \"email\": \"danielle@whitaker.na\",
            \"bool\": true
        },
        {
            \"index\": 5,
            \"index_start_at\": 56,
            \"integer\": 16,
            \"float\": 13.1539,
            \"name\": \"Paige\",
            \"surname\": \"Christensen\",
            \"fullname\": \"Arthur Garrett\",
            \"email\": \"mark@ritchie.ca\",
            \"bool\": false
        },
        {
            \"index\": 6,
            \"index_start_at\": 57,
            \"integer\": 44,
            \"float\": 12.5752,
            \"name\": \"Zachary\",
            \"surname\": \"Monroe\",
            \"fullname\": \"Marc Henry\",
            \"email\": \"suzanne@underwood.uz\",
            \"bool\": true
        },
        {
            \"index\": 7,
            \"index_start_at\": 58,
            \"integer\": 38,
            \"float\": 13.597,
            \"name\": \"Beth\",
            \"surname\": \"Berg\",
            \"fullname\": \"Diana Creech\",
            \"email\": \"chris@morgan.gm\",
            \"bool\": true
        },
        {
            \"index\": 8,
            \"index_start_at\": 59,
            \"integer\": 8,
            \"float\": 14.7075,
            \"name\": \"Lynne\",
            \"surname\": \"Rao\",
            \"fullname\": \"Melanie Lin\",
            \"email\": \"danielle@whitaker.na\",
            \"bool\": true
        },
        {
            \"index\": 9,
            \"index_start_at\": 59,
            \"integer\": 8,
            \"float\": 14.7075,
            \"name\": \"Lynne\",
            \"surname\": \"Rao\",
            \"fullname\": \"Melanie Lin\",
            \"email\": \"danielle@whitaker.na\",
            \"bool\": true
        },
        {
            \"index\": 10,
            \"index_start_at\": 59,
            \"integer\": 8,
            \"float\": 14.7075,
            \"name\": \"Lynne\",
            \"surname\": \"Rao\",
            \"fullname\": \"Melanie Lin\",
            \"email\": \"danielle@whitaker.na\",
            \"bool\": true
        }
        
    ]
}"

$php_object = json_decode($json_test);

echo json_encode( $php_object->rows[0]  );

?>
