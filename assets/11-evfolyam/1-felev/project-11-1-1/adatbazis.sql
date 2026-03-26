-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 03. 11:50
-- Kiszolgáló verziója: 10.4.27-MariaDB
-- PHP verzió: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `adatbazis`
--
CREATE DATABASE IF NOT EXISTS `adatbazis` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `adatbazis`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idovonal`
--

CREATE TABLE `idovonal` (
  `id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `cim` varchar(100) NOT NULL,
  `leiras` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `idovonal`
--

INSERT INTO `idovonal` (`id`, `datum`, `cim`, `leiras`) VALUES
(1, '2024-11-09', 'Adatbázis', 'Weblap: Alapok és keretszerkezet elkészítése'),
(2, '2024-11-12', 'Magyar', 'Adatbázis elkészítése.'),
(3, '2024-11-23', 'Történelem', 'PowerPoint bemutató elkészítése.'),
(5, '2024-11-21', 'IKT Projekt', 'Összefoglaló PPT elkezdése.'),
(6, '0000-00-00', 'Hálózat', 'Hálózat összeállítása.'),
(8, '0000-00-00', 'Adatbázis', 'Weblap befejezése'),
(9, '0000-00-00', 'IKT Projekt', 'Összefoglaló PPT Befejezése.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `koltok`
--

CREATE TABLE `koltok` (
  `id` int(11) NOT NULL,
  `nev` varchar(250) NOT NULL,
  `szul_ido` date NOT NULL,
  `szul_hely` varchar(250) NOT NULL,
  `hal_ido` date NOT NULL,
  `muvek` text NOT NULL,
  `leiras` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `koltok`
--

INSERT INTO `koltok` (`id`, `nev`, `szul_ido`, `szul_hely`, `hal_ido`, `muvek`, `leiras`) VALUES
(1, 'Petőfi Sándor', '1823-01-01', 'Kiskőrös', '1849-07-31', 'A helység kalapácsa, A Tisza, Az apostol', 'Petőfi Sándor magyar költő, forradalmár, nemzeti hős, a magyar költészet egyik legismertebb és egyik legkiemelkedőbb alakja.'),
(2, 'Arany János', '1817-03-02', 'Nagyszalonta', '1882-10-22', 'Szondi két apródja, Az elveszett alkotmány, Toldi', 'Arany János magyar költő, tanár, lapszerkesztő, a Kisfaludy Társaság igazgatója, a Magyar Tudományos Akadémia tagja és főtitkára.'),
(3, 'Ady Endre', '1877-11-22', 'Érmindszent', '1919-01-27', 'Vér és arany, A halottak élén, Szeretném, ha szeretnének', 'Diósadi Ady Endre, születési nevén: Ady András Endre a huszadik század egyik legjelentősebb magyar költője. A magyar politikai újságírás egyik legnagyobb alakja.'),
(4, 'Babits Mihály', '1883-11-26', 'Szekszárd', '1941-08-04', 'Timár Virgil fia, Halál fiai, Kártyavár', 'Szentistváni Babits Mihály László Ákos költő, író, történész, műfordító, a 20. század eleji magyar irodalom jelentős alakja, a Nyugat első nemzedékének tagja.'),
(5, 'Kosztolányi Dezső', '1885-03-29', 'Szabadka', '1936-11-03', 'Négy fal között, Boszorkányos esték, Pacsirta', 'Nemeskosztolányi Kosztolányi Dezső, teljes nevén Kosztolányi Dezső István Izabella író, költő, műfordító, kritikus, esszéista, újságíró, eszperantista, a Nyugat első nemzedékének kimagasló formaművésze, a 20. századi magyar széppróza és líra egyik legnagyobb alakja.');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `idovonal`
--
ALTER TABLE `idovonal`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `koltok`
--
ALTER TABLE `koltok`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `idovonal`
--
ALTER TABLE `idovonal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `koltok`
--
ALTER TABLE `koltok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
