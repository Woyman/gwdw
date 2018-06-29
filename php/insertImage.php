<?php 
	
	// print_r($_FILES);

	$file = $_FILES['inputfile']['tmp_name'];
	$nameFile = $_FILES['inputfile']['name'];
	$move = move_uploaded_file($file, '../img/template/'.$nameFile);

	if($move) 
	{ 
		echo $nameFile;
	}

?>