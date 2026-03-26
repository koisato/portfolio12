<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weblap</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="idovonal.css">

</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark navszin">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">nt11a</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#fooldal">Főoldal</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#rolunk">Rólunk</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#idovonal">Idővonal</a>
          </li>  
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Projektek</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="magyar.php">Magyar</a></li>
              <li><a class="dropdown-item" href="töri.php">Történelem</a></li>
              <li><a class="dropdown-item" href="halozat.php">Hálózat</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
                           
  <!-- Főoldal -->
    <section class="fooldal" id="fooldal">
      <div class="text-center">
        <h1>Üdvözöljük oldalunkon</h1>
        <p>Készítette: Katona Péter és Hernádi Bence</p>
      </div>
    </section>
  <!-- Kép+Infók -->
<div id="rolunk"></div>
  <div class="container">
    <h2>Rólunk</h2>
    <div class="row">
      <div class="col-md-6">
        <img src="Peti.png" alt="Bence" class="img-fluid">
      </div>
      <div class="col-md-6">
        <img src="Bence.png" alt="Peti" class="img-fluid">
      </div>
    </div>
    <div class="kozepre">
      <div class="inforolunk">
        <p class="text-center">
          <b>Mi vagyunk:</b> Katona Péter (18), Hernádi Bence (17)<br>
          <b>Iskolánk:</b> Tatabányai SZC Mikes Kelemen Technikum<br>
          <b>Szak:</b> Informatikai rendszer-és alkalmazás-üzemeltető technikus<br>
        </p>
      </div>
    </div>
</div>
<div class="container py-5" id="idovonal">
    <h2>Feladataink idővonalon</h2>
  <div class="row">
	<?php
	
	  $con = mysqli_connect('localhost','root','','adatbazis');
	  if($con == true) {
		  // Idővonal megjelenítése
		  echo '<div class="col-md-12">
				 <div id="content">
				  <ul class="timeline-1 text-black">';
		  
		  $idovonal = mysqli_query($con, "SELECT * FROM idovonal ORDER BY datum DESC");  
		  while($idopont = mysqli_fetch_assoc($idovonal)) {
			  // A datum mező UNIX timestamp-mé alakítása, ha szükséges
			  $datum = strtotime($idopont['datum']);
			  
			  // Formázott dátum kiírása
			  echo '<li class="event" data-date="'.date('Y.m.d.', $datum).'">';
			  echo '<h4 class="mb-3">'.$idopont['cim'].'</h4>';
			  echo '<p>'.$idopont['leiras'].'</p>';
			  echo '</li>';
		  }
		  
		  echo '  </ul>
				 </div>
				</div>';
		  
	  } else {
		  echo 'Adatbázis kapcsolódási hiba!';
	  }
	?>
  </div>
</div>
  <!-- Kopirájt cucc -->
  <div class="footer">
    <small>&copy; 2024. Minden jog fenntartva.</small>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
</body>
</html>
