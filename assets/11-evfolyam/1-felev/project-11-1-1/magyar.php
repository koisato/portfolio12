<?php

$conn = new mysqli("localhost", "root", "", "adatbazis"); // felcsatlakozás

$sql = "SELECT nev, szul_ido, szul_hely, hal_ido, muvek, leiras FROM koltok";
$result = $conn->query($sql);

$koltok = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $koltok[] = $row;  //ez csinál listát
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weblap</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark navszin">
    <div class="container-fluid">
    <a class="navbar-brand btn btn-primary" href="index.php">Vissza a főoldalra</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav"> 
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

    <div class="asd">
        <h1>Magyar költők táblázata</h1>
    </div>

    <table>
        <thead>
            <tr class="header-row">
                <th>Név</th>
                <th>Születési idő</th>
                <th>Születési hely</th>
                <th>Elhunyt</th>
                <th>Művek</th>
                <th>Leírás</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($koltok as $kolto): ?>
                <tr class="poet-row" onclick="toggleBiography(this)">
                    <td><?= htmlspecialchars($kolto['nev']) ?></td>
                    <td><?= htmlspecialchars($kolto['szul_ido']) ?></td>
                    <td><?= htmlspecialchars($kolto['szul_hely']) ?></td>
                    <td><?= htmlspecialchars($kolto['hal_ido']) ?></td>
                    <td><?= htmlspecialchars($kolto['muvek']) ?></td>
                    <td><?= htmlspecialchars($kolto['leiras']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
</body>
</html>
