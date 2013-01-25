<?php
$key = $spaceId = "movie-" . $_GET['i'];



if($spaceId != '') {

  $output = '';
  $output = apc_fetch($key);
  if($output == '') {
    //echo "nope";

    //$imdbAPI = "http://www.omdbapi.com/?r=json";
    //$imdbAPI .= "&i=" . $spaceId;

    $movieDbAPI    =  "http://api.themoviedb.org/3/movie/";
    $movieDbAPI   .=  $spaceId . "?api_key=cfff74e77ce61bec9d33ba1c6d7003b2";

    ob_start();

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $movieDbAPI);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Linux - cURL');
    curl_setopt($ch, CURLOPT_HEADER, 0);

    curl_exec($ch);
    curl_close($ch);
    error_log('calling the API');
    $output = ob_get_contents();
    ob_end_clean();
    
    apc_store($key, $output, 900);
  }
  echo $output;





}
else {
	echo "Nothing to lookup!"; 
}

?>
