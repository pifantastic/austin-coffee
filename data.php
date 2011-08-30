<?php

$url = 'https://spreadsheets.google.com/feeds/list/tOpuOgOLKLO0VmyDUFE51ew/od6/public/values?alt=json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$output = curl_exec($ch);
curl_close($ch);
$data = json_decode($output);

$shops = array(
  "strangebrew" => array(
    "name" => "Strange Brew",
    "color" => "red",
    "stroke" => "black",
    "data" => array()
  ),
  "bennu" => array(
    "name" => "Bennu",
    "color" => "blue",
    "stroke" => "black",
    "data" => array()
  ),
  "epoch" => array(
    "name" => "Epoch",
    "color" => "green",
    "stroke" => "black",
    "data" => array()
  )
);

$attributes = array(
  'taste',
  'price',
  'wifi',
  'hours',
  'ambiance',
);

foreach ($data->feed->entry as $n => $row) {
  $row = (array) $row;
  foreach ($shops as $id => $shop) {
    foreach ($attributes as $attr) {
      $cell = (array) $row["gsx$" . $id . $attr];

      if (!isset($shops[$id]['data'][$attr]))
        $shops[$id]['data'][$attr] = array();

      if ($cell['$t'] && is_numeric($cell['$t']))
        $shops[$id]['data'][$attr][] = (int) $cell['$t'];
    }
  }
}

foreach ($shops as $id => $shop) {
  foreach ($attributes as $attr) {
    $shops[$id]['data'][$attr] = array_sum($shops[$id]['data'][$attr]) / count($shops[$id]['data'][$attr]);
  }
}

$response = array(
  'success' => TRUE,
  'shops' => $shops,
);

if (isset($_REQUEST['callback'])) {
  header('Content-Type: text/javascript; charset=utf8');
  echo "// Austin Coffee Shop Data\n";
  echo sprintf("%s(%s);", $_REQUEST['callback'], json_encode($response));
}
else {
  header('Content-Type: application/json; charset=utf8');
  echo json_encode($response);
}
