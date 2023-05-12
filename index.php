<?php
    include('ecrit_apropos/langues.txt.php');

    $lg = 'fr';
?>
<!DOCTYPE html>

<html lang="fr">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>4 heures</title> 
  <!-- Ou "Quatre heures" ? -Max -->

  <link rel="stylesheet" href="styles.css?v=3.0">
  <link
			href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video-js.min.css"
			rel="stylesheet"
		/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video.min.js"></script>
  <!-- Google tag (gtag.js) --> 
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-LZGFJRCG6X"></script> 
  
</head>

<body>
  <header>
    <h1>4h</h1>
    <nav class="nav_menu">
      <ul>
        <li class="btn_langues"><?= $langues['fr']['btn_langues'] ?></li>
        <li class="apropos"><?= $langues['fr']['apropos'] ?></li>
      </ul>
    </nav>
    <nav class="list_langues">
      <ul>
        <li class="fr" onClick="<?php $lg = 'fr' ?>"><?= $langues[$lg]['btn_fr'] ?></li>
        <li class="en"><?= $langues['fr']['btn_en'] ?></li>
        <li class="bs"><?= $langues['fr']['btn_bs'] ?></li>
        <li class="es"><?= $langues['fr']['btn_es'] ?></li>
      </ul>
    </nav>
  </header>


  
  <div class="div_contenu">
    
  </div>

  <div>
     <i class="fa-regular fa-circle-xmark" style="font-size:100px;color:white;"></i>
  </div>
  

  <div class="grille_video">
    
  </div>

  <script src="scripts.js"></script>



</body>

</html> 