// barca.js - Dashboard Barça 2025-26
// Projet perso pour suivre les stats de l'effectif, les comparaisons,
// le mercato simulé, etc.
// Toutes les données sont ont été recup depuis fbref, fotmob et le site officiel.
//
// TODO : ajouter les stats de Copa del Rey proprement
// TODO : regarder si je peux automatiser la mise à jour des notes matchs
//
// Structure globale :
//   - PHOTOS + SQUAD + PRETS : les données brutes
//   - les fonctions render : tout ce qui touche l'affichage
//   - init() en bas qui lance tout au chargement


// URLs des photos - j'essaie de prendre les photos officielles du site du Barça
// pour les autres (prêtés, recrues) je passe par transfermarkt ou footmercato
// si l'image charge pas, fallback sur les initiales du joueur

// raccourci pour pas réécrire l'URL entière à chaque fois
var BP = 'https://www.fcbarcelona.com/photo-resources/';
var TM = 'https://img.a.ltximg.com/image/upload/f_auto,c_limit,h_234,w_200/';

var PHOTOS = {

  // gardiens
  'Marc-André ter Stegen': 'https://statics-maker.llt-services.com/gir/images/2026/01/26/small-wp/0204ac50-e988-4053-a098-1ade8f12d0e6-126.webp',
  'Joan Garcia': BP + '2025/09/09/81c7699c-1298-45d6-834e-df72d8c550c8/01-Joan_Garcia.png?width=220&height=220',
  'Szczesny': 'https://www.fcbarcelona.com/photo-resources/2025/09/09/01ac5137-9725-4e97-858e-711344d43fb5/25-Szczesny.jpg?width=640&height=400',
  'Inaki Pena': 'https://statics-maker.llt-services.com/elc/images/2025/09/17/small-wp/6cc77417-faff-47af-97c2-442505d68beb-317.webp',
  'Diego Kochen': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/eae1b89d-c767-4d84-8db0-5e386faae119/1-Kochen.jpg?width=640&height=400',
  'Eder Aller': 'https://img.a.transfermarkt.technology/portrait/header/1066202-1758897924.jpg?lm=1',

  // défenseurs
  'Cancelo': 'https://www.fcbarcelona.com/photo-resources/2026/01/15/79a75f80-8fb9-4213-b87f-f6fa2c4f4ec4/00-Cancelo.jpg?width=640&height=400',
  'Balde': BP + '2025/09/09/0d332686-2eee-4297-a099-bab75c7c35bb/03-Balde.png?width=220&height=220',
  'Araujo': BP + '2025/09/09/072afc10-1ec9-483e-a4a5-8775cb6cea23/04-Araujo.png?width=220&height=220',
  'Cubarski': BP + '2025/09/09/8c77ff44-6a20-4b1f-9991-bb3937af9ce4/02-Cubarsi.png?width=220&height=220',
  'Christensen': BP + '2025/09/09/d2083355-8ef0-4398-94ae-7d84615de3c2/15-Christensen.png?width=220&height=220',
  'Gerard': BP + '2025/09/09/a4ea019d-b5b3-4b6e-a970-79fe8afc8bfd/18-Martin.png?width=220&height=220',
  'Kounde': BP + '2025/09/09/089a6980-e8be-46fe-900c-4202293ef729/23-Kounde.png?width=220&height=220',
  'Eric Garcia': BP + '2025/09/09/bbfb1ea9-ad02-466c-80ba-ab2da4c3ce25/24-Eric_Garcia.png?width=220&height=220',
  'Jofre Torrents': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/ac92710c-05a5-448b-9058-fc8a598f2732/17-Jofre.jpg?width=640&height=400',
  'Alvaro Cortés': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/1700b884-4331-4228-9a5b-59b548835298/4-Alvaro-Cortes.jpg?width=640&height=400',
  'Xavi Espart': 'https://www.fcbarcelona.com/photo-resources/2025/10/15/ac205eff-9077-4bc2-be11-09ef76b60554/22-Xavi-Espart.jpg?width=640&height=400',

  // milieux
  'Gavi': BP + '2025/09/09/7f610def-b5e6-46ce-9891-9e6988b89e29/06-Gavi.png?width=220&height=220',
  'Pedri': BP + '2025/09/09/3dd2346c-01bb-4ad9-9b62-ed5cbf8d8b06/08-Pedri.png?width=220&height=220',
  'Fermin': 'https://www.fcbarcelona.com/photo-resources/2025/09/09/4e851606-cfd6-4dc4-9042-c3dee40dbeb7/16-Fermin.jpg?width=640&height=400',
  'Casado': 'https://www.fcbarcelona.com/photo-resources/2025/09/09/aee1292c-f40e-46e9-8b45-c19646ad3a04/17-Casado.jpg?width=640&height=400',
  'Dani Olmo': BP + '2025/09/09/eec9fdad-d078-4780-b0c3-4d9fe2f3b328/20-Olmo.png?width=220&height=220',
  'Frenkie': BP + '2025/09/09/b62d13a8-5712-4823-b627-18dcce921378/21-De_Jong.png?width=220&height=220',
  'Bernal': BP + '2025/09/09/a4f602c5-5476-4db3-9148-0a6fee1767fb/22-Bernal.png?width=220&height=220',
  'Thomas Marques': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/979fbda1-9810-460e-b4ca-7cda55b6f6f1/14-Tommy-Marque-s.jpg?width=640&height=400',
  'Daniel Rodriguez': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/55b5dff9-0c2b-4ca6-a369-2a3c09017840/7-Dani-Rodriguez_.jpg?width=640&height=400',
  'Guillermo Fernandez': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/7cc11f3e-75cc-44bc-b78d-d603b5d7c17e/10-Guillermo-Fernandez.jpg?width=640&height=400',
  'Juan Hernández': 'https://img.uefa.com/imgml/TP/players/1/2026/324x324/250184344.jpg',
  'Toni Fernández': 'https://www.fcbarcelona.com/photo-resources/2025/10/09/4b8dff83-be59-4e8b-b182-2b8b4faba6e2/16-A-Fernandez.jpg?width=640&height=400' ,

  // attaquants
  'F.Torres': BP + '2025/09/09/05ad9394-0706-4043-8315-1795193f17ad/07-Ferran_Torres.png?width=220&height=220',
  'Lewandowski': BP + '2025/09/09/3f98839a-bac3-451e-9431-6d58b79588d5/09-Lewandowski.png?width=220&height=220',
  'Lamine Yamal': BP + '2025/09/09/aae1899c-adb7-450a-b705-61cad72d2508/10-Lamine.png?width=220&height=220',
  'Raphinha': BP + '2025/09/09/369f0d8e-3301-4f3d-9507-246371f8e3d2/11-Raphinha.png?width=220&height=220',
  'Rashford': BP + '2025/09/09/6e30bc77-d2b9-4c6f-9a93-6a55628c4d5b/14-Rashford.png?width=220&height=220',
  'Bardghji': BP + '2025/09/09/9b946f2d-3dc7-4c96-ab7c-4a0e36e679cf/28-Bardghji.png?width=220&height=220',
  // prêtés
  'Iñaki Peña': 'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/inaki-pena.png',
  'Héctor Fort': 'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/hector-fort-garcia.png',
  'Ansu Fati': 'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/ansu-fati.png',
  'Ter Stegen': 'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/marc-andre-ter-stegen.png',
  'Ander Astralaga': 'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/ander-astralaga-aranguren.png',
};

// si l'image charge pas, on met les initiales à la place
function getPlayerPhoto(name, imgElement) {
  var url = PHOTOS[name];
  if (!url) { renderInitials(name, imgElement); return; }

  var img = new Image();
  img.onload = function () { imgElement.src = url; };
  img.onerror = function () {

    // si ça marche pas non plus - on choisit less initiales
    var tmSlug = name.toLowerCase()
      .replace(/[àáâã]/g, 'a').replace(/[éèê]/g, 'e')
      .replace(/[íì]/g, 'i').replace(/[óò]/g, 'o')
      .replace(/[úù]/g, 'u').replace(/ç/g, 'c')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    var tmUrl = 'https://img.a.ltximg.com/image/upload/f_auto,c_limit,h_234,w_200/' + tmSlug + '.png';
    var img2 = new Image();
    img2.onload = function () { imgElement.src = tmUrl; };
    img2.onerror = function () { renderInitials(name, imgElement); };
    img2.src = tmUrl;
  };
  img.src = url;
}

function renderInitials(name, el) {
  var parts = name.trim().split(' ');
  var initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.slice(0, 2);
  el.style.display = 'none';
  var div = el.parentNode;
  div.style.background = 'linear-gradient(135deg, #004D98, #A50044)';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.innerHTML = ''
    + initials.toUpperCase() + '';
}

// exemple d'utilisation :
// getPlayerPhoto('Szczesny',    document.getElementById('photo-szczesny'));
// getPlayerPhoto('Diego Kochen', document.getElementById('photo-kochen'));


// petits drapeaux emoji par code pays
var FLAGS = { ES: '🇪🇸', FR: '🇫🇷', BR: '🇧🇷', NL: '🇳🇱', GB: 'GB', PL: '🇵🇱', SE: '🇸🇪', DK: '🇩🇰', UY: '🇺🇾', PT: '🇵🇹' };


// EFFECTIF
// Stats toutes compétitions confondues (Liga + UCL + Copa)
// Source principale : fbref.com + fotmob pour les notes

var SQUAD = [

  // milieux
  {
    n: 'Lamine Yamal', p: 'FW', gr: 'FW', num: 10, age: 18, h: '1,79m', mv: '350M€',
    mp: 44, st: 41, min: 3647, yc: 6, rc: 0,
    xg: 18.0, g: 23, a: 17, note: 8.35, nat: 'ES', col: '#A50044', ph: 'Lamine Yamal',
    tir: 164, kp: 22, drb: 98, cv: 34.8, tck: 31, int: 16,
    cl: 148, bl: 57, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 47, touchesBall: 16412,
    courPasse: 5744, longuePasse: 1313,
    rec: 4376, aerienG: 15, aerienP: 10,
    fautes: 41, centres: 148, tirs_cadres: 57,
    cadrage_pct: 34.8, ppm: 2.38, plus_minus: 50,
    b90: 0.57, pd90: 0.42, ga90_stat: 0.99,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 8.38, note_ucl: 8.3,
    info: 'Phénomène 18 ans · 23G/17A · 44 matchs · Record UCL historique.'
  },

  // gardiens
  {
    n: 'Joan García', p: 'GK', gr: 'GK', num: 13, age: 24, h: '1,88m', mv: '35M€',
    mp: 40, st: 40, min: 3591, yc: 1, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 7.12, nat: 'ES', col: '#5a6070', ph: 'Joan Garcia',
    tir: 0, kp: 0, drb: 5, cv: 0, tck: 3, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 106, ga: 40, cs: 15,
    pressing: 3, touchesBall: 16160,
    courPasse: 5656, longuePasse: 1293,
    rec: 4309, aerienG: 1, aerienP: 1,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 2.52, plus_minus: 68,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 73.6, ga90_gk: 1.0, tirs_subis: 144,
    note_liga: 7.15, note_ucl: 7.07,
    info: 'GK titulaire · 15 clean sheets · Signé d\'Espanyol (€25M).'
  },

  // défenseurs
  {
    n: 'Éric García', p: 'DF', gr: 'DF', num: 24, age: 25, h: '1,79m', mv: '20M€',
    mp: 46, st: 42, min: 3557, yc: 5, rc: 2,
    xg: 1.1, g: 1, a: 1, note: 6.95, nat: 'ES', col: '#004D98', ph: 'Eric Garcia',
    tir: 35, kp: 18, drb: 33, cv: 31.4, tck: 52, int: 56,
    cl: 15, bl: 11, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 108, touchesBall: 16006,
    courPasse: 5602, longuePasse: 1280,
    rec: 4268, aerienG: 26, aerienP: 17,
    fautes: 51, centres: 15, tirs_cadres: 11,
    cadrage_pct: 31.4, ppm: 2.39, plus_minus: 58,
    b90: 0.03, pd90: 0.03, ga90_stat: 0.05,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.98, note_ucl: 6.9,
    info: 'Polyvalent DF/MF · 46 matchs · 5 jaunes / 2 rouges.'
  },
  {
    n: 'Pau Cubarsí', p: 'DF', gr: 'DF', num: 5, age: 19, h: '1,88m', mv: '80M€',
    mp: 43, st: 40, min: 3550, yc: 4, rc: 1,
    xg: 1.0, g: 1, a: 0, note: 7.35, nat: 'ES', col: '#004D98', ph: 'Cubarski',
    tir: 13, kp: 12, drb: 11, cv: 23.1, tck: 32, int: 39,
    cl: 0, bl: 3, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 71, touchesBall: 15975,
    courPasse: 5591, longuePasse: 1278,
    rec: 4260, aerienG: 16, aerienP: 10,
    fautes: 33, centres: 0, tirs_cadres: 3,
    cadrage_pct: 23.1, ppm: 2.35, plus_minus: 63,
    b90: 0.03, pd90: 0.0, ga90_stat: 0.03,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.38, note_ucl: 7.3,
    info: 'Meilleur défenseur La Liga 2025-26 à 19 ans.'
  },
  {
    n: 'Jules Koundé', p: 'DF', gr: 'DF', num: 23, age: 27, h: '1,81m', mv: '70M€',
    mp: 43, st: 35, min: 3199, yc: 5, rc: 0,
    xg: 3.1, g: 3, a: 4, note: 7.08, nat: 'FR', col: '#004D98', ph: 'Kounde',
    tir: 17, kp: 17, drb: 33, cv: 29.4, tck: 44, int: 44,
    cl: 49, bl: 5, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 88, touchesBall: 14396,
    courPasse: 5039, longuePasse: 1152,
    rec: 3839, aerienG: 22, aerienP: 14,
    fautes: 25, centres: 49, tirs_cadres: 5,
    cadrage_pct: 29.4, ppm: 2.35, plus_minus: 50,
    b90: 0.08, pd90: 0.11, ga90_stat: 0.2,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.11, note_ucl: 7.03,
    info: 'Titulaire RB · 3 buts · 49 centres.'
  },

  // milieux
  {
    n: 'Fermin López', p: 'MF', gr: 'MF', num: 16, age: 22, h: '1,72m', mv: '80M€',
    mp: 43, st: 30, min: 2695, yc: 7, rc: 0,
    xg: 12.0, g: 12, a: 16, note: 7.48, nat: 'ES', col: '#1D9E75', ph: 'Fermin',
    tir: 100, kp: 20, drb: 25, cv: 39.0, tck: 32, int: 15,
    cl: 60, bl: 39, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 47, touchesBall: 12128,
    courPasse: 4245, longuePasse: 970,
    rec: 3234, aerienG: 16, aerienP: 10,
    fautes: 54, centres: 60, tirs_cadres: 39,
    cadrage_pct: 39.0, ppm: 2.44, plus_minus: 46,
    b90: 0.4, pd90: 0.53, ga90_stat: 0.94,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.51, note_ucl: 7.43,
    info: 'MVP de la saison · 12G/16A · Hat-trick UCL vs Olympiakos.'
  },

  // défenseurs
  {
    n: 'Gérard Martín', p: 'DF', gr: 'DF', num: 18, age: 24, h: '1,83m', mv: '12M€',
    mp: 45, st: 32, min: 2683, yc: 8, rc: 0,
    xg: 0.0, g: 0, a: 1, note: 6.72, nat: 'ES', col: '#004D98', ph: 'Gerard',
    tir: 10, kp: 12, drb: 13, cv: 30.0, tck: 31, int: 38,
    cl: 21, bl: 3, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 69, touchesBall: 12074,
    courPasse: 4226, longuePasse: 966,
    rec: 3220, aerienG: 15, aerienP: 10,
    fautes: 20, centres: 21, tirs_cadres: 3,
    cadrage_pct: 30.0, ppm: 2.33, plus_minus: 56,
    b90: 0.0, pd90: 0.03, ga90_stat: 0.03,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.75, note_ucl: 6.67,
    info: 'LB de rotation · 8 jaunes · 21 centres.'
  },

  // milieux
  {
    n: 'Pedri', p: 'MF', gr: 'MF', num: 8, age: 23, h: '1,74m', mv: '120M€',
    mp: 37, st: 30, min: 2612, yc: 3, rc: 1,
    xg: 2.0, g: 2, a: 10, note: 7.42, nat: 'ES', col: '#1D9E75', ph: 'Pedri',
    tir: 25, kp: 18, drb: 67, cv: 48.0, tck: 43, int: 28,
    cl: 11, bl: 12, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 71, touchesBall: 11754,
    courPasse: 4114, longuePasse: 940,
    rec: 3134, aerienG: 21, aerienP: 14,
    fautes: 12, centres: 11, tirs_cadres: 12,
    cadrage_pct: 48.0, ppm: 2.49, plus_minus: 55,
    b90: 0.07, pd90: 0.34, ga90_stat: 0.41,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.45, note_ucl: 7.37,
    info: 'Régulateur du jeu Flick · 10 passes déc. · 1 rouge.'
  },

  // défenseurs
  {
    n: 'Alejandro Balde', p: 'DF', gr: 'DF', num: 3, age: 22, h: '1,74m', mv: '60M€',
    mp: 36, st: 29, min: 2502, yc: 3, rc: 0,
    xg: 0.0, g: 0, a: 3, note: 7.1, nat: 'ES', col: '#004D98', ph: 'Balde',
    tir: 10, kp: 5, drb: 28, cv: 30.0, tck: 25, int: 6,
    cl: 31, bl: 3, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 31, touchesBall: 11259,
    courPasse: 3941, longuePasse: 901,
    rec: 3002, aerienG: 12, aerienP: 8,
    fautes: 20, centres: 31, tirs_cadres: 3,
    cadrage_pct: 30.0, ppm: 2.22, plus_minus: 39,
    b90: 0.0, pd90: 0.11, ga90_stat: 0.11,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.13, note_ucl: 7.05,
    info: 'LB titulaire · 3 passes déc. · 31 centres.'
  },

  // milieux
  {
    n: 'Frenkie de Jong', p: 'MF', gr: 'MF', num: 21, age: 28, h: '1,80m', mv: '50M€',
    mp: 33, st: 26, min: 2441, yc: 7, rc: 2,
    xg: 1.0, g: 1, a: 8, note: 6.82, nat: 'NL', col: '#1D9E75', ph: 'Frenkie',
    tir: 8, kp: 16, drb: 40, cv: 25.0, tck: 26, int: 26,
    cl: 11, bl: 2, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 52, touchesBall: 10984,
    courPasse: 3844, longuePasse: 879,
    rec: 2929, aerienG: 13, aerienP: 8,
    fautes: 26, centres: 11, tirs_cadres: 2,
    cadrage_pct: 25.0, ppm: 2.24, plus_minus: 31,
    b90: 0.04, pd90: 0.29, ga90_stat: 0.33,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.85, note_ucl: 6.77,
    info: '2 expulsions · 7 jaunes · 40 dribbles.'
  },
  // attaquants
  {
    n: 'Ferrán Torres', p: 'FW', gr: 'FW', num: 7, age: 26, h: '1,82m', mv: '40M€',
    mp: 44, st: 28, min: 2399, yc: 2, rc: 0,
    xg: 18.9, g: 19, a: 2, note: 7.35, nat: 'ES', col: '#A50044', ph: 'F.Torres',
    tir: 90, kp: 4, drb: 19, cv: 50.0, tck: 7, int: 5,
    cl: 5, bl: 45, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 12, touchesBall: 10796,
    courPasse: 3779, longuePasse: 864,
    rec: 2879, aerienG: 3, aerienP: 2,
    fautes: 16, centres: 5, tirs_cadres: 45,
    cadrage_pct: 50.0, ppm: 2.32, plus_minus: 31,
    b90: 0.71, pd90: 0.08, ga90_stat: 0.79,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.38, note_ucl: 7.3,
    info: 'Meilleure saison en carrière · 19 buts.'
  },
  // milieux
  {
    n: 'Dani Olmo', p: 'MF', gr: 'MF', num: 20, age: 27, h: '1,79m', mv: '70M€',
    mp: 42, st: 25, min: 2381, yc: 3, rc: 0,
    xg: 8.4, g: 8, a: 8, note: 7.28, nat: 'ES', col: '#A50044', ph: 'Dani Olmo',
    tir: 84, kp: 14, drb: 50, cv: 32.1, tck: 25, int: 21,
    cl: 42, bl: 27, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 46, touchesBall: 10714,
    courPasse: 3750, longuePasse: 857,
    rec: 2857, aerienG: 12, aerienP: 8,
    fautes: 29, centres: 42, tirs_cadres: 27,
    cadrage_pct: 32.1, ppm: 2.36, plus_minus: 38,
    b90: 0.3, pd90: 0.3, ga90_stat: 0.6,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.31, note_ucl: 7.23,
    info: '8G/8A · Très polyvalent · 84 tirs.'
  },
  {
    n: 'Marcus Rashford', p: 'FW', gr: 'FW', num: 14, age: 28, h: '1,85m', mv: '00M€',
    mp: 43, st: 23, min: 2303, yc: 2, rc: 0,
    xg: 12.1, g: 12, a: 10, note: 6.98, nat: 'GB', col: '#A50044', ph: 'Rashford',
    tir: 110, kp: 11, drb: 32, cv: 39.1, tck: 12, int: 3,
    cl: 140, bl: 43, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 15, touchesBall: 10364,
    courPasse: 3627, longuePasse: 829,
    rec: 2764, aerienG: 6, aerienP: 4,
    fautes: 13, centres: 140, tirs_cadres: 43,
    cadrage_pct: 39.1, ppm: 2.44, plus_minus: 32,
    b90: 0.47, pd90: 0.39, ga90_stat: 0.86,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.01, note_ucl: 6.93,
    info: 'Prêt Man Utd · 12G/10A · 140 centres.', loan: true, loanFrom: 'Manchester United'
  },
  {
    n: 'Raphinha', p: 'FW', gr: 'FW', num: 11, age: 29, h: '1,76m', mv: '80M€',
    mp: 31, st: 26, min: 2095, yc: 4, rc: 0,
    xg: 13.7, g: 19, a: 7, note: 7.42, nat: 'BR', col: '#A50044', ph: 'Raphinha',
    tir: 91, kp: 10, drb: 13, cv: 38.5, tck: 14, int: 9,
    cl: 114, bl: 35, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 23, touchesBall: 9428,
    courPasse: 3300, longuePasse: 754,
    rec: 2514, aerienG: 7, aerienP: 4,
    fautes: 14, centres: 114, tirs_cadres: 35,
    cadrage_pct: 38.5, ppm: 2.68, plus_minus: 53,
    b90: 0.82, pd90: 0.3, ga90_stat: 1.12,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.45, note_ucl: 7.37,
    info: '3ème capitaine · 19 buts · 114 centres.'
  },
  // attaquants
  {
    n: 'Robert Lewandowski', p: 'FW', gr: 'FW', num: 9, age: 37, h: '1,85m', mv: '00M€',
    mp: 40, st: 22, min: 2032, yc: 2, rc: 0,
    xg: 15.8, g: 17, a: 1, note: 7.08, nat: 'PL', col: '#A50044', ph: 'Lewandowski',
    tir: 88, kp: 2, drb: 34, cv: 47.7, tck: 4, int: 4,
    cl: 1, bl: 42, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 8, touchesBall: 9144,
    courPasse: 3200, longuePasse: 732,
    rec: 2438, aerienG: 2, aerienP: 1,
    fautes: 18, centres: 1, tirs_cadres: 42,
    cadrage_pct: 47.7, ppm: 2.33, plus_minus: 41,
    b90: 0.75, pd90: 0.04, ga90_stat: 0.8,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.11, note_ucl: 7.03,
    info: '17 buts à 37 ans · Fin contrat juin 2026.'
  },
  // défenseurs
  {
    n: 'Ronald Araújo', p: 'DF', gr: 'DF', num: 4, age: 27, h: '1,88m', mv: '60M€',
    mp: 34, st: 15, min: 1517, yc: 4, rc: 1,
    xg: 4.1, g: 4, a: 0, note: 7.22, nat: 'UY', col: '#004D98', ph: 'Araujo',
    tir: 17, kp: 4, drb: 3, cv: 35.3, tck: 17, int: 13,
    cl: 6, bl: 6, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 30, touchesBall: 6826,
    courPasse: 2389, longuePasse: 546,
    rec: 1820, aerienG: 8, aerienP: 5,
    fautes: 21, centres: 6, tirs_cadres: 6,
    cadrage_pct: 35.3, ppm: 2.35, plus_minus: 24,
    b90: 0.24, pd90: 0.0, ga90_stat: 0.24,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.25, note_ucl: 7.17,
    info: 'Capitaine · 4 buts · 1 rouge · Duels aériens dominants.'
  },
  // milieux
  {
    n: 'Marc Casado', p: 'MF', gr: 'MF', num: 17, age: 22, h: '1,83m', mv: '40M€',
    mp: 30, st: 14, min: 1327, yc: 4, rc: 0,
    xg: 0.0, g: 0, a: 1, note: 7.02, nat: 'ES', col: '#1D9E75', ph: 'Casado',
    tir: 9, kp: 4, drb: 28, cv: 0.0, tck: 17, int: 10,
    cl: 5, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 27, touchesBall: 5972,
    courPasse: 2090, longuePasse: 478,
    rec: 1592, aerienG: 8, aerienP: 5,
    fautes: 35, centres: 5, tirs_cadres: 0,
    cadrage_pct: 0.0, ppm: 2.57, plus_minus: 18,
    b90: 0.0, pd90: 0.07, ga90_stat: 0.07,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.05, note_ucl: 6.97,
    info: 'Pivot défensif · 35 fautes · Leader pressing.'
  },
  {
    n: 'Marc Bernal', p: 'MF', gr: 'MF', num: 22, age: 18, h: '1,79m', mv: '25M€',
    mp: 28, st: 12, min: 1058, yc: 4, rc: 0,
    xg: 5.0, g: 5, a: 1, note: 6.98, nat: 'ES', col: '#1D9E75', ph: 'Bernal',
    tir: 14, kp: 4, drb: 18, cv: 57.1, tck: 19, int: 11,
    cl: 2, bl: 8, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 30, touchesBall: 4761,
    courPasse: 1666, longuePasse: 381,
    rec: 1270, aerienG: 9, aerienP: 6,
    fautes: 21, centres: 2, tirs_cadres: 8,
    cadrage_pct: 57.1, ppm: 2.71, plus_minus: 24,
    b90: 0.43, pd90: 0.09, ga90_stat: 0.51,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.01, note_ucl: 6.93,
    info: 'Prodige 18 ans · 5 buts · Prolongé jusqu\'en 2029.', youth: true
  },
  // défenseurs
  {
    n: 'João Cancelo', p: 'DF', gr: 'DF', num: 2, age: 31, h: '1,82m', mv: '18M€',
    mp: 16, st: 12, min: 1029, yc: 4, rc: 0,
    xg: 1.1, g: 1, a: 3, note: 7.05, nat: 'PT', col: '#004D98', ph: 'Cancelo',
    tir: 15, kp: 8, drb: 11, cv: 33.3, tck: 19, int: 17,
    cl: 36, bl: 5, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 36, touchesBall: 4630,
    courPasse: 1620, longuePasse: 370,
    rec: 1235, aerienG: 9, aerienP: 6,
    fautes: 17, centres: 36, tirs_cadres: 5,
    cadrage_pct: 33.3, ppm: 2.31, plus_minus: 22,
    b90: 0.09, pd90: 0.26, ga90_stat: 0.35,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 7.08, note_ucl: 7.0,
    info: 'Prêt Al Hilal (janv. 2026) · LB/RB polyvalent.', loan: true, loanFrom: 'Al Hilal'
  },
  // gardiens
  {
    n: 'Wojciech Szczęsny', p: 'GK', gr: 'GK', num: 25, age: 36, h: '1,95m', mv: '2M€',
    mp: 10, st: 9, min: 819, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.8, nat: 'PL', col: '#5a6070', ph: 'Szczesny',
    tir: 0, kp: 0, drb: 1, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 26, ga: 17, cs: 0,
    pressing: 0, touchesBall: 3686,
    courPasse: 1290, longuePasse: 295,
    rec: 983, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 1.9, plus_minus: 6,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 62.5, ga90_gk: 1.87, tirs_subis: 40,
    note_liga: 6.83, note_ucl: 6.75,
    info: 'Doublure solide · 62.5% arrêts.'
  },
  // milieux
  {
    n: 'Roony Bardghji', p: 'FW', gr: 'FW', num: 19, age: 20, h: '1,83m', mv: '20M€',
    mp: 23, st: 7, min: 626, yc: 0, rc: 0,
    xg: 2.1, g: 2, a: 4, note: 6.82, nat: 'SE', col: '#A50044', ph: 'Bardghji',
    tir: 23, kp: 4, drb: 4, cv: 56.5, tck: 2, int: 1,
    cl: 47, bl: 13, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 3, touchesBall: 2817,
    courPasse: 986, longuePasse: 225,
    rec: 751, aerienG: 1, aerienP: 0,
    fautes: 2, centres: 47, tirs_cadres: 13,
    cadrage_pct: 56.5, ppm: 2.39, plus_minus: 16,
    b90: 0.29, pd90: 0.58, ga90_stat: 0.86,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.85, note_ucl: 6.77,
    info: 'Ailier 20 ans · Progression très remarquée.', youth: true
  },
  // défenseurs
  {
    n: 'Andreas Christensen', p: 'DF', gr: 'DF', num: 15, age: 30, h: '1,87m', mv: '00M€',
    mp: 17, st: 4, min: 522, yc: 1, rc: 0,
    xg: 1.0, g: 1, a: 0, note: 6.78, nat: 'DK', col: '#004D98', ph: 'Christensen',
    tir: 7, kp: 1, drb: 4, cv: 28.6, tck: 7, int: 4,
    cl: 0, bl: 2, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 11, touchesBall: 2349,
    courPasse: 822, longuePasse: 188,
    rec: 626, aerienG: 3, aerienP: 2,
    fautes: 5, centres: 0, tirs_cadres: 2,
    cadrage_pct: 28.6, ppm: 2.35, plus_minus: 3,
    b90: 0.17, pd90: 0.0, ga90_stat: 0.17,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.81, note_ucl: 6.73,
    info: 'Blessures récurrentes · 17 matchs seulement.'
  },
  // milieux
  {
    n: 'Gavi', p: 'MF', gr: 'MF', num: 6, age: 21, h: '1,73m', mv: '65M€',
    mp: 7, st: 2, min: 277, yc: 3, rc: 0,
    xg: 0.0, g: 0, a: 1, note: 6.62, nat: 'ES', col: '#1D9E75', ph: 'Gavi',
    tir: 1, kp: 2, drb: 9, cv: 0.0, tck: 5, int: 4,
    cl: 1, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 9, touchesBall: 1246,
    courPasse: 436, longuePasse: 100,
    rec: 332, aerienG: 2, aerienP: 1,
    fautes: 5, centres: 1, tirs_cadres: 0,
    cadrage_pct: 0.0, ppm: 2.57, plus_minus: 5,
    b90: 0.0, pd90: 0.32, ga90_stat: 0.32,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.65, note_ucl: 6.57,
    info: 'Retour progressif après longue blessure genou.'
  },
  {
    n: 'Xavi Espart', p: 'MF', gr: 'MF', num: 36, age: 18, h: '1,74m', mv: '—',
    mp: 4, st: 1, min: 119, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.5, nat: 'ES', col: '#1D9E75', ph: 'Xavi Espart',
    tir: 0, kp: 2, drb: 3, cv: 0, tck: 3, int: 5,
    cl: 1, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 8, touchesBall: 536,
    courPasse: 188, longuePasse: 43,
    rec: 143, aerienG: 1, aerienP: 1,
    fautes: 1, centres: 1, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 2.5, plus_minus: 5,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.53, note_ucl: null,
    info: 'Jeune milieu 18 ans · 4 matchs.', youth: true
  },
  // défenseurs
  {
    n: 'Jofre Torrents', p: 'DF', gr: 'DF', num: 38, age: 19, h: '1,85m', mv: '—',
    mp: 4, st: 1, min: 112, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.45, nat: 'ES', col: '#004D98', ph: 'Jofre Torrents',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 2, int: 0,
    cl: 4, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 2, touchesBall: 504,
    courPasse: 176, longuePasse: 40,
    rec: 134, aerienG: 1, aerienP: 0,
    fautes: 0, centres: 4, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 3.0, plus_minus: 1,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.48, note_ucl: null,
    info: 'Jeune défenseur 19 ans · 4 matchs.', youth: true
  },
  // gardiens
  {
    n: 'Marc-André ter Stegen', p: 'GK', gr: 'GK', num: 1, age: 33, h: '1,92m', mv: '10M€',
    mp: 1, st: 1, min: 90, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.0, nat: 'DE', col: '#5a6070', ph: 'ter Stegen',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 2, ga: 0, cs: 1,
    pressing: 0, touchesBall: 405,
    courPasse: 142, longuePasse: 32,
    rec: 108, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 3.0, plus_minus: 2,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 100.0, ga90_gk: 0.0, tirs_subis: 3,
    note_liga: 6.03, note_ucl: null,
    info: 'Suspendu puis prêté à Girona (janv. 2026). 1 seul match.', loan: true, loanFrom: '', loanTo: 'Girona'
  },
  // milieux
  {
    n: 'Toni Fernández', p: 'MF', gr: 'MF', num: 40, age: 17, h: '1,78m', mv: '—',
    mp: 1, st: 1, min: 45, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.35, nat: 'ES', col: '#1D9E75', ph: 'Toni Fernández',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 202,
    courPasse: 71, longuePasse: 16,
    rec: 54, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 3.0, plus_minus: 0,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.38, note_ucl: null,
    info: 'Jeune talent 17 ans · 1 match.', youth: true
  },
  {
    n: 'Thomas Marques', p: 'MF', gr: 'MF', num: 41, age: 19, h: '1,82m', mv: '—',
    mp: 1, st: 0, min: 7, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.5, nat: 'ES', col: '#1D9E75', ph: 'Thomas Marques',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 32,
    courPasse: 11, longuePasse: 3,
    rec: 8, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 3.0, plus_minus: 0,
    b90: 0.0, pd90: 0.0, ga90_stat: 0.0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.53, note_ucl: null,
    info: 'Milieu 19 ans · 7 minutes jouées.', youth: true
  },
  {
    n: 'Daniel Rodriguez', p: 'MF', gr: 'MF', num: 42, age: 20, h: '1,79m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.51, nat: 'ES', col: '#1D9E75', ph: 'Daniel Rodriguez',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.54, note_ucl: 6.46,
    info: 'Daniel Rodriguez · MF · 20 ans.', youth: true
  },
  // gardiens
  {
    n: 'Diego Kochen', p: 'GK', gr: 'GK', num: 43, age: 20, h: '1,85m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.53, nat: 'US', col: '#5a6070', ph: 'Diego Kochen',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.56, note_ucl: 6.48,
    info: 'Diego Kochen · GK · 20 ans.', youth: true
  },
  // attaquants
  {
    n: 'Juan Hernández', p: 'FW', gr: 'FW', num: 44, age: 18, h: '1,80m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.57, nat: 'ES', col: '#A50044', ph: 'Juan Hernández',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.6, note_ucl: 6.52,
    info: 'Juan Hernández · FW · 18 ans.', youth: true
  },
  // défenseurs
  {
    n: 'Alvaro Cortés', p: 'DF', gr: 'DF', num: 45, age: 21, h: '1,80m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.6, nat: 'ES', col: '#004D98', ph: 'Alvaro Cortés',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.63, note_ucl: 6.55,
    info: 'Alvaro Cortés · DF · 21 ans.', youth: true
  },
  // gardiens
  {
    n: 'Eder Aller', p: 'GK', gr: 'GK', num: 46, age: 19, h: '1,88m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.58, nat: 'ES', col: '#5a6070', ph: 'Eder Aller',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.61, note_ucl: 6.53,
    info: 'Eder Aller · GK · 19 ans.', youth: true
  },
  {
    n: 'Iñaki Peña', p: 'GK', gr: 'GK', num: 27, age: 27, h: '1,83m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.34, nat: 'ES', col: '#5a6070', ph: 'Iñaki Peña',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.37, note_ucl: null,
    info: 'Iñaki Peña · GK · 27 ans.', youth: true
  },
  // milieux
  {
    n: 'Guillermo Fernandez', p: 'MF', gr: 'MF', num: 48, age: 17, h: '1,75m', mv: '—',
    mp: 0, st: 0, min: 0, yc: 0, rc: 0,
    xg: 0.0, g: 0, a: 0, note: 6.48, nat: 'ES', col: '#1D9E75', ph: 'Guillermo Fernandez',
    tir: 0, kp: 0, drb: 0, cv: 0, tck: 0, int: 0,
    cl: 0, bl: 0, du: 55,
    sv: 0, ga: 0, cs: 0,
    pressing: 0, touchesBall: 0,
    courPasse: 0, longuePasse: 0,
    rec: 0, aerienG: 0, aerienP: 0,
    fautes: 0, centres: 0, tirs_cadres: 0,
    cadrage_pct: 0, ppm: 0, plus_minus: 0,
    b90: 0, pd90: 0, ga90_stat: 0,
    arrets_pct: 0, ga90_gk: 0, tirs_subis: 0,
    note_liga: 6.51, note_ucl: null,
    info: 'Guillermo Fernandez · MF · 17 ans.', youth: true
  },
];

var PRETS = [
  {
    n: 'Iñaki Peña', p: 'GK', age: 26, col: '#5a6070',
    loanTo: 'Elche (LaLiga2)', note_loan: 6.85, mp_loan: 18, g_loan: 0, a_loan: 0,
    note_barça: 'Dépend du Barça comme 3ème GK. Bonnes performances à Elche.',
    returns: 'Juin 2026', info: '26 ans · Contrat Barça prolongé (2029). Titulaire en debut de saison mais il a perdu sa place chez Elche avec ~70% saves.'
  },

  {
    n: 'Héctor Fort', p: 'DF', age: 19, col: '#004D98',
    loanTo: 'Elche (LaLiga2)', note_loan: 7.10, mp_loan: 22, g_loan: 1, a_loan: 3,
    note_barça: 'RB prometteur. Futur titulaire potentiel au Barça.',
    returns: 'Juin 2026', info: '19 ans · Formé à La Masía. Prêt pour gagner du temps de jeu. Club entraîné par Eder Sarabia (ex-staff Barça).'
  },

  {
    n: 'Ansu Fati', p: 'FW', age: 23, col: '#A50044',
    loanTo: 'AS Monaco (Ligue 1)', note_loan: 6.95, mp_loan: 28, g_loan: 8, a_loan: 4,
    note_barça: 'Contrat prolongé jusqu\'en 2028. Option d\'achat pour Monaco, probablememnt pas lévée donc retour.',
    returns: 'Juin 2026', info: '23 ans · 8 buts pour Monaco. Regain de confiance après saisons difficiles.'
  },

  {
    n: 'Ter Stegen', p: 'GK', age: 33, col: '#5a6070',
    loanTo: 'Girona (La Liga)', note_loan: 6.72, mp_loan: 12, g_loan: 0, a_loan: 0,
    note_barça: 'Conflit contractuel avec le Barça. Suspendu comme capitaine puis prêté en jan. 2026.',
    returns: 'Juin 2026', info: '33 ans · Capitaine suspendu après refus médical. Prêté à Girona en janvier 2026. Situation compliquée, dnc chercher une porte de sortie.'
  },

  {
    n: 'Ander Astralaga', p: 'GK', age: 22, col: '#5a6070',
    loanTo: 'Granada (2ème div.)', note_loan: 6.55, mp_loan: 14, g_loan: 0, a_loan: 0,
    note_barça: 'Jeune gardien formé au Barça. Développement en deuxième division.',
    returns: 'Juin 2026', info: '22 ans · Académie du Barça. Prêt à Granada pour jouer régulièrement et progresser.'
  },
];


/* FORMATIONS ET XI TYPE */

/* Configurations formations - terrain vertical 440×620
   GK en bas (ty≈545), DEF (ty≈405-420), MF (ty≈248-322), ATT (ty≈88-205) */

var FORMS = {
  '4-3-3': [
    { role: 'GK', gr: 'GK', tx: 220, ty: 545 },
    { role: 'RB', gr: 'DF', tx: 355, ty: 405 }, { role: 'CB', gr: 'DF', tx: 272, ty: 420 }, { role: 'CB', gr: 'DF', tx: 168, ty: 420 }, { role: 'LB', gr: 'DF', tx: 85, ty: 405 },
    { role: 'RCM', gr: 'MF', tx: 325, ty: 265 }, { role: 'CM', gr: 'MF', tx: 220, ty: 248 }, { role: 'LCM', gr: 'MF', tx: 115, ty: 265 },
    { role: 'RW', gr: 'FW', tx: 368, ty: 110 }, { role: 'ST', gr: 'FW', tx: 220, ty: 88 }, { role: 'LW', gr: 'FW', tx: 72, ty: 110 }
  ],
  '4-2-3-1': [
    { role: 'GK', gr: 'GK', tx: 220, ty: 545 },
    { role: 'RB', gr: 'DF', tx: 355, ty: 410 }, { role: 'CB', gr: 'DF', tx: 272, ty: 425 }, { role: 'CB', gr: 'DF', tx: 168, ty: 425 }, { role: 'LB', gr: 'DF', tx: 85, ty: 410 },
    { role: 'CDM', gr: 'MF', tx: 295, ty: 322 }, { role: 'CDM', gr: 'MF', tx: 145, ty: 322 },
    { role: 'RAM', gr: 'FW', tx: 358, ty: 205 }, { role: 'CAM', gr: 'MF', tx: 220, ty: 195 }, { role: 'LAM', gr: 'FW', tx: 82, ty: 205 },
    { role: 'ST', gr: 'FW', tx: 220, ty: 88 }
  ],
  '3-5-2': [
    { role: 'GK', gr: 'GK', tx: 220, ty: 545 },
    { role: 'RCB', gr: 'DF', tx: 328, ty: 420 }, { role: 'CB', gr: 'DF', tx: 220, ty: 435 }, { role: 'LCB', gr: 'DF', tx: 112, ty: 420 },
    { role: 'RWB', gr: 'DF', tx: 388, ty: 310 }, { role: 'RCM', gr: 'MF', tx: 308, ty: 268 }, { role: 'CM', gr: 'MF', tx: 220, ty: 252 }, { role: 'LCM', gr: 'MF', tx: 132, ty: 268 }, { role: 'LWB', gr: 'DF', tx: 52, ty: 310 },
    { role: 'RST', gr: 'FW', tx: 295, ty: 105 }, { role: 'LST', gr: 'FW', tx: 145, ty: 105 }
  ],
  '4-4-2': [
    { role: 'GK', gr: 'GK', tx: 220, ty: 545 },
    { role: 'RB', gr: 'DF', tx: 350, ty: 410 }, { role: 'RCB', gr: 'DF', tx: 272, ty: 425 }, { role: 'LCB', gr: 'DF', tx: 168, ty: 425 }, { role: 'LB', gr: 'DF', tx: 90, ty: 410 },
    { role: 'RM', gr: 'FW', tx: 365, ty: 270 }, { role: 'RCM', gr: 'MF', tx: 282, ty: 270 }, { role: 'LCM', gr: 'MF', tx: 158, ty: 270 }, { role: 'LM', gr: 'FW', tx: 75, ty: 270 },
    { role: 'RST', gr: 'FW', tx: 292, ty: 108 }, { role: 'LST', gr: 'FW', tx: 148, ty: 108 }
  ],
  '3-4-3': [
    { role: 'GK', gr: 'GK', tx: 220, ty: 545 },
    { role: 'RCB', gr: 'DF', tx: 332, ty: 420 }, { role: 'CB', gr: 'DF', tx: 220, ty: 435 }, { role: 'LCB', gr: 'DF', tx: 108, ty: 420 },
    { role: 'RCM', gr: 'MF', tx: 342, ty: 288 }, { role: 'CM', gr: 'MF', tx: 255, ty: 272 }, { role: 'CM', gr: 'MF', tx: 185, ty: 272 }, { role: 'LCM', gr: 'MF', tx: 98, ty: 288 },
    { role: 'RW', gr: 'FW', tx: 368, ty: 110 }, { role: 'ST', gr: 'FW', tx: 220, ty: 88 }, { role: 'LW', gr: 'FW', tx: 72, ty: 110 }
  ]
};

/* XI Type 2025-26 - Formation 4-2-3-1 */

var XI_2526 = [
  { n: 'Joan Garcia',  tx: 220, ty: 545, note: 7.12 },
  { n: 'Kounde',       tx: 355, ty: 410, note: 7.08 },
  { n: 'Cubarski',     tx: 272, ty: 425, note: 7.35 },
  { n: 'Gerard',       tx: 168, ty: 425, note: 7.15 },
  { n: 'Balde',        tx: 85,  ty: 410, note: 7.10 },
  { n: 'Frenkie',      tx: 295, ty: 322, note: 7.18 },
  { n: 'Pedri',        tx: 145, ty: 322, note: 7.42 },
  { n: 'Lamine Yamal', tx: 358, ty: 205, note: 8.35 },
  { n: 'Fermin',       tx: 220, ty: 195, note: 7.48 },
  { n: 'Raphinha',     tx: 82,  ty: 205, note: 7.42 },
  { n: 'F.Torres',     tx: 220, ty: 88,  note: 7.35 },
];

/* Génération données match par match */

(function generateMatches() {
  var laliga = ['Valence', 'Atlético', 'Real Madrid', 'Séville', 'Betis', 'Villarreal', 'Bilbao', 'Getafe', 'Celta', 'Osasuna', 'Girona', 'Rayo', 'Las Palmas', 'Leganés'];
  var ucl = ['Dortmund', 'Club Brugge', 'PSG', 'Chelsea', 'Brest', 'Dinamo Z.', 'Newcastle', 'Olympiakos', 'Atlético'];
  var copa = ['Barbastro', 'Osasuna', 'R.Sociedad', 'Valencia'];
  var supe = ['Real Madrid'];
  SQUAD.forEach(function (p) {
    var m = [], cG = 0, cA = 0;
    for (var i = 0; i < p.mp; i++) {
      var comp, opp;
      if (i < 2 && p.mp > 10) { comp = 'Supercopa'; opp = supe[0]; }
      else if (i >= p.mp - 12 && i < p.mp - 4 && p.mp > 20) { comp = 'UCL'; opp = ucl[i % ucl.length]; }
      else if (i >= p.mp - 4) { comp = 'Copa'; opp = copa[i % copa.length]; }
      else { comp = 'La Liga'; opp = laliga[i % laliga.length]; }
      var g = (p.g > 0 && Math.random() < (p.g / p.mp) * 1.5) ? (Math.random() < .1 ? 2 : 1) : 0;
      var a = (p.a > 0 && Math.random() < (p.a / p.mp) * 1.3) ? 1 : 0;
      var nb = (p.note_liga || p.note) + (Math.random() - 0.5) * 0.85;
      if (g >= 2) nb = Math.max(nb, 8.0);
      else if (g === 1) nb = Math.max(nb, 7.2);
      cG += g; cA += a;
      m.push({ m: i + 1, opp: opp, comp: comp, g: g, a: a, note: +Math.min(9.8, Math.max(5.2, nb)).toFixed(1), cumG: cG, cumA: cA, started: i < p.st });
    }
    p.matches = m;
  });
})();


// variables d'état global

var curIdx = 0;
var curProg = 0;
var curFormKey = '4-2-3-1';
var curCustForm = '4-3-3';
var curStat26Idx = 0;
var curStatCat = 'general';
var curStatPosFilter = 'ALL';
var cmpType = 'barca';
var custXI = [];
var pickerSlotIdx = -1;
var curRecPos = null;         /* Poste sélectionné dans renforcement postes */
var userRecrues = [];           /* Cibles ajoutées manuellement par l'utilisateur */
var curRecRadarSel = null;      /* Cible sélectionnée dans le radar renforcement postes */
var chartRadar = null;
var chartCmp = null;
var chartProg = null;
var chartProgN = null;
var chartRecRadar = null;


// --- fonctions utilitaires ---
// des petits helpers que j'utilise partout dans le code

/** Retourne les 2 initiales d'un nom */
function ini(n) { return String(n).split(' ').slice(-2).map(function (w) { return w[0] || ''; }).join('').toUpperCase(); }

/** G+A par 90 minutes */
function ga90(p) { return p.min > 0 ? ((p.g + p.a) / (p.min / 90)).toFixed(2) : '0.00'; }

/** Couleur de texte selon la note (fond) */
function nC(n) { return n >= 7.5 ? '#3e9e1f' : n >= 7.0 ? '#c88a00' : '#8b2020'; }

/** Fond coloré selon la note */
function nB(n) { return n >= 7.5 ? 'rgba(62,158,31,.22)' : n >= 7.0 ? 'rgba(200,138,0,.22)' : 'rgba(139,32,32,.22)'; }

/** Texte coloré clair selon la note */
function nT(n) { return n >= 7.5 ? '#5ec42a' : n >= 7.0 ? '#e0a920' : '#e05050'; }

/** Trouve un joueur dans SQUAD par son nom */
function getP(name) {
  for (var i = 0; i < SQUAD.length; i++) if (SQUAD[i].n === name) return SQUAD[i];
  return null;
}

/** Génère le HTML d'un avatar circulaire avec gestion d'erreur photo */

function imgEl(ph, col, sz, extra) {
  var url = ph ? PHOTOS[ph] : null;
  extra = extra || '';
  var s = 'width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:' + col + ';display:flex;align-items:center;justify-content:center;font-size:' + Math.round(sz * .3) + 'px;font-weight:800;color:#fff;overflow:hidden;flex-shrink:0;' + extra;
  if (url) {
    return '<div style="' + s + '"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover;object-position:top center;" onerror="this.parentNode.innerHTML=\'' + ini(ph) + '\';this.parentNode.style.fontSize=\'' + Math.round(sz * .3) + 'px\'"></div>';
  }
  return '<div style="' + s + '">' + ini(ph || '?') + '</div>';
}

/** Génère une sbox */

function mkSbox(l, v) {
  return '<div class="sbox"><div class="sl">' + l + '</div><div class="sv">' + v + '</div></div>';
}

/** Génère une stat-detail-box */

function mkStatBox(label, val, sub, col) {
  return '<div class="stat-detail-box">' +
    '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:' + (col || 'var(--B)') + ';border-radius:2px 2px 0 0;"></div>' +
    '<div class="stat-detail-label">' + label + '</div>' +
    '<div class="stat-detail-val" style="color:' + (col || 'var(--t1)') + ';">' + val + '</div>' +
    (sub ? '<div class="stat-detail-sub">' + sub + '</div>' : '') +
    '</div>';
}


// --- navigation ---

function goTab(id, btn) {

  // cacher toutes les vues et onglets actifs
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('on'); });
  document.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('on'); });
  document.getElementById('v-' + id).classList.add('on');
  btn.classList.add('on');

  // déclencher le rendu selon l'onglet cliqué
  if (id === 'ranking') doRanking();
  if (id === 'custom') renderCustomPitch();
  if (id === 'prog') doProg(curProg);
  if (id === 'rec') doRec();
  if (id === 'stats26') renderStats26();
  if (id === 'prets') doPrets();
  if (id === 'recrues') doRecues();
  if (id === 'mercato') doMercato();
}


// --- sidebar (liste des joueurs à gauche) ---

function buildSidebar() {
  var sb = document.getElementById('sidebar');

  // je regroupe par poste dans l'ordre GK > DF > MF > FW
  sb.innerHTML = '';
  var sections = { GK: 'Gardiens', DF: 'Défenseurs', MF: 'Milieux', FW: 'Attaquants' };
  Object.keys(sections).forEach(function (gr) {
    var players = SQUAD.filter(function (p) { return p.gr === gr; });
    var hd = document.createElement('div');
    hd.className = 'pos-section-hd';
    hd.textContent = sections[gr];
    sb.appendChild(hd);
    players.forEach(function (p) {
      var i = SQUAD.indexOf(p);
      var d = document.createElement('div');
      d.className = 'pitem' + (i === 0 ? ' on' : '');
      d.id = 'pi' + i;
      var lBadge = p.loan ? '<span class="loan-badge">Prêt</span>' : (p.youth ? '<span class="youth-badge">LM</span>' : '');
      d.innerHTML =
        imgEl(p.ph, p.col, 30) +
        '<div style="flex:1;min-width:0;">' +
        '<div class="pitem-name">' + p.n + lBadge + '</div>' +
        '<div class="pitem-sub">' + (FLAGS[p.nat] || '') + ' #' + p.num + ' · ' + p.g + 'G ' + p.a + 'A</div>' +
        '</div>' +
        '<span style="font-size:8px;font-weight:700;padding:1px 5px;border-radius:4px;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(1) + '</span>';
      d.onclick = (function (idx) { return function () { pickPlayer(idx); }; })(i);
      sb.appendChild(d);
    });
  });
}

function pickPlayer(i) {

  // console.log('joueur sélectionné:', SQUAD[i].n);
  curIdx = i;
  document.querySelectorAll('.pitem').forEach(function (t, j) { t.classList.toggle('on', j === i); });
  doHero();
  doRadar();
  doPitchH();
}


// --- fiche de chaque joueur ---
// c'est la vue principale, avec la photo, les stats clés et le terrain
function doHero() {
  var p = SQUAD[curIdx];

  // photo du joueur
  var ph = document.getElementById('hImg');
  ph.style.background = p.col;
  var url = PHOTOS[p.ph];
  ph.innerHTML = url
    ? '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;object-position:top center;" onerror="this.parentNode.innerHTML=\'' + ini(p.ph) + '\'">'
    : ini(p.ph);

  // infos de base
  document.getElementById('hNum').textContent = '#' + p.num;
  document.getElementById('hName').textContent = p.n;
  document.getElementById('hPos').textContent = p.p;
  var noteBadge = document.getElementById('hNot');
  noteBadge.textContent = p.note.toFixed(2);
  noteBadge.style.background = nB(p.note);
  noteBadge.style.color = nT(p.note);
  document.getElementById('hLoanBadge').innerHTML = p.loan
    ? '<span class="loan-badge">Prêt — ' + p.loanFrom + '</span>'
    : (p.youth ? '<span class="youth-badge">La Masía</span>' : '');
  document.getElementById('hMeta').textContent =
    (FLAGS[p.nat] || '') + ' ' + p.nat + ' · ' + p.age + ' ans · ' + p.h + ' · ' + p.mv;

  // les 4 chiffres clés en haut
  document.getElementById('hKpi').innerHTML =
    '<div class="kpi"><div class="kpi-v" style="color:#e05050;">' + p.g + '</div><div class="kpi-l">Buts</div></div>' +
    '<div class="kpi"><div class="kpi-v" style="color:#5599ee;">' + p.a + '</div><div class="kpi-l">Passes</div></div>' +
    '<div class="kpi"><div class="kpi-v">' + p.xg.toFixed(1) + '</div><div class="kpi-l">xG</div></div>' +
    '<div class="kpi"><div class="kpi-v">' + ga90(p) + '</div><div class="kpi-l">G+A/90</div></div>';
  
    /* Stats offensives / défensives */
  var isGK = p.p === 'GK'; // les gardiens ont des stats complètement différentes
  document.getElementById('sOff').innerHTML = isGK
    ? mkSbox('Arrêts', p.sv || 0) + mkSbox('Buts enc.', p.ga || 0) + mkSbox('Clean sh.', p.cs || 0) + mkSbox('Bloqués', p.bl)
    : mkSbox('Tirs tentés', p.tir) + mkSbox('Passes clés', p.kp) + mkSbox('Dribbles', p.drb) + mkSbox('Conversion', p.cv.toFixed(1) + '%');
  document.getElementById('sDef').innerHTML =
    mkSbox('Tacles', p.tck) + mkSbox('Interceptions', p.int) + mkSbox('Dégagements', p.cl) + mkSbox('Duels gagnés', p.du + '%');
}

/* RADAR - axes normalisés 0-10 */
var RLBLS = ['Buts', 'Passes', 'xG', 'Présence', 'Note', 'Défense'];

// normalise les stats du joueur sur 0-10 pour le radar
function rdData(p) {
  return [
    +((p.g / 22) * 10).toFixed(1),
    +((p.a / 15) * 10).toFixed(1),
    +((p.xg / 16) * 10).toFixed(1),
    +((p.min / 3600) * 10).toFixed(1),
    +(((p.note - 6) / 2.4) * 10).toFixed(1),
    +(((p.tck + p.int) / 100) * 10).toFixed(1)
  ];
}
function doRadar() {
  if (chartRadar) { chartRadar.destroy(); chartRadar = null; }
  var p = SQUAD[curIdx];
  chartRadar = new Chart(document.getElementById('cRadar').getContext('2d'), {
    type: 'radar',
    data: {
      labels: RLBLS, datasets: [{
        data: rdData(p), borderColor: p.col, backgroundColor: p.col + '33',
        borderWidth: 2, pointBackgroundColor: p.col, pointRadius: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 10, ticks: { display: false },
          grid: { color: 'rgba(255,255,255,0.06)' }, angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#7b8eaa', font: { size: 9 } }
        }
      }
    }
  });
}

/* Terrain - fiche joueur (700×210) */

function pitchHBase() {
  var W = 700, H = 260, lc = 'rgba(255,255,255,.45)', lw = 0.8;
  var cy = H / 2;
  return '<rect width="' + W + '" height="' + H + '" fill="#1a4f1a"/>' +
    '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" fill="#1f5c1f"/>' +
    '<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<line x1="350" y1="8" x2="350" y2="' + (H - 8) + '" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<circle cx="350" cy="' + cy + '" r="52" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<circle cx="350" cy="' + cy + '" r="2.5" fill="' + lc + '"/>' +
    '<rect x="8" y="' + (cy - 55) + '" width="90" height="110" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="8" y="' + (cy - 33) + '" width="40" height="66" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="' + (W - 98) + '" y="' + (cy - 55) + '" width="90" height="110" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="' + (W - 48) + '" y="' + (cy - 33) + '" width="40" height="66" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>';
}

function doPitchH() {
  var p = SQUAD[curIdx];
  var W = 700, H = 260;
  var isGK = p.p === 'GK', isFW = p.p === 'FW', isMF = p.p === 'MF';
  var zones = isGK
    ? [{ x: 8, y: 12, w: 135, h: H - 24, l: 'Surface', note: p.note.toFixed(2) }, { x: 148, y: 18, w: 148, h: H - 36, l: 'Zone GK', note: (p.note - .05).toFixed(2) }]
    : isFW
      ? [{ x: 462, y: 12, w: 230, h: H - 24, l: 'Zone offensive', note: p.note.toFixed(2) }, { x: 290, y: 18, w: 165, h: H - 36, l: 'Milieu offensif', note: (p.note - .1).toFixed(2) }]
      : isMF
        ? [{ x: 192, y: 12, w: 316, h: H - 24, l: 'Milieu terrain', note: p.note.toFixed(2) }, { x: 515, y: 18, w: 135, h: H - 36, l: 'Zone att.', note: (p.note - .08).toFixed(2) }, { x: 52, y: 18, w: 135, h: H - 36, l: 'Zone déf.', note: (p.note - .12).toFixed(2) }]
        : [{ x: 48, y: 12, w: 258, h: H - 24, l: 'Zone défensive', note: p.note.toFixed(2) }, { x: 314, y: 18, w: 168, h: H - 36, l: 'Milieu déf.', note: (p.note - .05).toFixed(2) }];

  var zh = zones.map(function (z) {
    var nv = parseFloat(z.note);
    var fill = nv >= 7.2 ? 'rgba(62,158,31,.55)' : nv >= 6.8 ? 'rgba(200,138,0,.5)' : 'rgba(139,32,32,.45)';
    var cx = z.x + z.w / 2;
    return '<rect x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" fill="' + fill + '" rx="6"/>' +
      '<text x="' + cx + '" y="' + (z.y + 18) + '" text-anchor="middle" fill="rgba(255,255,255,.7)" font-size="10" font-family="system-ui">' + z.l + '</text>' +
      '<text x="' + cx + '" y="' + (z.y + 52) + '" text-anchor="middle" fill="#fff" font-size="30" font-weight="700" font-family="system-ui">' + z.note + '</text>';
  }).join('');

  /* Photo du joueur positionnée en bas du terrain - sans overlap avec les notes */

  var dx = isGK ? 72 : isFW ? 570 : isMF ? 350 : 178;
  var dy = 225;
  var url = PHOTOS[p.ph];
  var iid = 'pzH_' + curIdx;
  var pEl = url
    ? '<defs><clipPath id="' + iid + '"><circle cx="' + dx + '" cy="' + dy + '" r="22"/></clipPath></defs>' +
    '<circle cx="' + dx + '" cy="' + dy + '" r="25" fill="' + p.col + '" stroke="#fff" stroke-width="2.5"/>' +
    '<image href="' + url + '" x="' + (dx - 22) + '" y="' + (dy - 22) + '" width="44" height="44" clip-path="url(#' + iid + ')" preserveAspectRatio="xMidYMin slice" onerror=""/>'
    : '<circle cx="' + dx + '" cy="' + dy + '" r="22" fill="' + p.col + '" stroke="#fff" stroke-width="2"/>' +
    '<text x="' + dx + '" y="' + (dy + 5) + '" text-anchor="middle" fill="#fff" font-size="10" font-weight="800" font-family="system-ui">' + ini(p.ph) + '</text>';

  document.getElementById('svgPitch').innerHTML = pitchHBase() + zh + pEl;
}


// --- stats détaillées par joueur ---
function buildStatsSb26() {
  var sb = document.getElementById('statsSb26');
  sb.innerHTML = '';
  var list = SQUAD.filter(function (p) { return curStatPosFilter === 'ALL' || p.gr === curStatPosFilter; });
  list.forEach(function (p) {
    var i = SQUAD.indexOf(p);
    var d = document.createElement('div');
    d.className = 'psel' + (curStat26Idx === i ? ' on' : '');
    d.innerHTML =
      imgEl(p.ph, p.col, 26) +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.n + '</div>' +
      '<div style="font-size:8px;color:var(--t2);">' + p.p + ' · ' + p.g + 'G ' + p.a + 'A</div>' +
      '</div>' +
      '<span style="font-size:9px;font-weight:700;color:' + nT(p.note) + ';">' + p.note.toFixed(1) + '</span>';
    d.onclick = (function (idx) { return function () { curStat26Idx = idx; buildStatsSb26(); renderStats26(); }; })(i);
    sb.appendChild(d);
  });
}

function filterByPos() {
  curStatPosFilter = document.getElementById('posFilter26').value;
  buildStatsSb26();
  renderStats26();
}

function setStatCat(cat, btn) {
  curStatCat = cat;
  document.querySelectorAll('.stat-tab').forEach(function (b) { b.classList.remove('on'); });
  btn.classList.add('on');
  renderStats26();
}

function renderStats26() {
  buildStatsSb26();
  var p = SQUAD[curStat26Idx];
  var el = document.getElementById('statsContent26');
  el.innerHTML = '';
  if (!p) return;

  if (curStatCat === 'general') {
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;padding:4px 0;flex-shrink:0;">' +
      imgEl(p.ph, p.col, 44) +
      '<div><div style="font-size:16px;font-weight:800;">' + p.n + '</div><div style="font-size:10px;color:var(--t2);">' + (FLAGS[p.nat] || '') + ' ' + p.p + ' · ' + p.age + ' ans · ' + p.mv + '</div></div>' +
      '<span style="margin-left:auto;font-size:26px;font-weight:800;padding:4px 14px;border-radius:12px;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(2) + '</span>' +
      (p.info ? '<div style="font-size:10px;color:var(--t2);padding:6px 12px;background:var(--bg3);border-radius:8px;border-left:3px solid ' + nT(p.note) + ';flex:1;margin-left:8px;">' + p.info + '</div>' : '') +
      '</div>' +
      '<div class="stat-detail-grid">' +
      mkStatBox('Matchs joués', p.mp, 'Toutes comp.', '#5599ee') +
      mkStatBox('Minutes totales', p.min.toLocaleString(), 'min', '#1abc9c') +
      mkStatBox('Buts', p.g, 'Toutes comp.', '#e05050') +
      mkStatBox('Passes déc.', p.a, 'Toutes comp.', '#5599ee') +
      mkStatBox('xG total', p.xg.toFixed(1), 'Expected goals', '#9b59b6') +
      mkStatBox('G+A / 90', ga90(p), '/90 min', 'var(--G)') +
      mkStatBox('Titularisations', p.st, 'départs', '#1abc9c') +
      mkStatBox('Cartons J.', p.yc, '', '#c88a00') +
      mkStatBox('Note globale', p.note.toFixed(2), '/ 10', 'var(--G)') +
      mkStatBox('Note La Liga', p.note_liga ? p.note_liga.toFixed(2) : '—', '/ 10', '#e05050') +
      (p.note_ucl ? mkStatBox('Note UCL', p.note_ucl.toFixed(2), '/ 10', '#5599ee') : '') +
      mkStatBox('Valeur', p.mv, 'Estimation', 'var(--t2)') +
      '</div>' +
      '<div class="card p"><div class="stitle">Radar global 2025-26</div>' +
      '<div style="height:240px;position:relative;"><canvas id="cStatRadar" style="position:absolute;inset:0;width:100%!important;height:100%!important;"></canvas></div></div>';
    setTimeout(function () {
      var c = document.getElementById('cStatRadar'); if (!c) return;
      new Chart(c.getContext('2d'), { type: 'radar', data: { labels: RLBLS, datasets: [{ data: rdData(p), borderColor: p.col, backgroundColor: p.col + '33', borderWidth: 2.5, pointBackgroundColor: p.col, pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 10, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.07)' }, angleLines: { color: 'rgba(255,255,255,0.07)' }, pointLabels: { color: '#7b8eaa', font: { size: 10 } } } } } });
    }, 50);
  }
  else if (curStatCat === 'offensif') {
    el.innerHTML = '<div class="stat-detail-grid">' +
      mkStatBox('Buts', p.g, 'Toutes comp.', '#e05050') +
      mkStatBox('Tirs tentés', p.tir, 'Total', '#e05050') +
      mkStatBox('Tirs / 90', p.min > 0 ? (p.tir / (p.min / 90)).toFixed(1) : '0', '/90', '#e05050') +
      mkStatBox('xG total', p.xg.toFixed(1), 'Expected', '#9b59b6') +
      mkStatBox('xG / tir', p.tir > 0 ? (p.xg / p.tir).toFixed(2) : '0', 'qualité', '#9b59b6') +
      mkStatBox('Surperf. xG', ((p.g - p.xg) > 0 ? '+' : '') + (p.g - p.xg).toFixed(1), 'vs xG', p.g >= p.xg ? '#5ec42a' : '#e05050') +
      mkStatBox('Passes clés', p.kp, '', '#5599ee') +
      mkStatBox('Dribbles réussis', p.drb, '', '#e0a920') +
      mkStatBox('Tentatives drib.', Math.round(p.drb * 1.35), '', '#e0a920') +
      mkStatBox('Duels offensifs', p.du + '%', 'gagnés', '#1abc9c') +
      mkStatBox('Touches balle', p.touchesBall || 0, 'saison', 'var(--t2)') +
      mkStatBox('Conversion', p.cv.toFixed(1) + '%', 'tirs→buts', 'var(--G)') +
      '</div>';
  }
  else if (curStatCat === 'defensif') {
    el.innerHTML = '<div class="stat-detail-grid">' +
      mkStatBox('Tacles', p.tck, 'Total', '#1abc9c') +
      mkStatBox('Tacles / 90', p.min > 0 ? (p.tck / (p.min / 90)).toFixed(1) : '0', '/90', '#1abc9c') +
      mkStatBox('Interceptions', p.int, 'Total', '#e67e22') +
      mkStatBox('Inter. / 90', p.min > 0 ? (p.int / (p.min / 90)).toFixed(1) : '0', '/90', '#e67e22') +
      mkStatBox('Dégagements', p.cl, '', '#3498db') +
      mkStatBox('Blocs', p.bl, '', '#5599ee') +
      mkStatBox('Duels aér. G.', p.aerienG || 0, '', '#9b59b6') +
      mkStatBox('Duels aér. P.', p.aerienP || 0, '', '#e05050') +
      mkStatBox('% aériens', p.aerienG && p.aerienP ? Math.round((p.aerienG / (p.aerienG + p.aerienP)) * 100) + '%' : '—', '', '#9b59b6') +
      mkStatBox('Tck+Int.', p.tck + p.int, 'total', '#1abc9c') +
      mkStatBox('Cartons J.', p.yc, '', '#c88a00') +
      mkStatBox('Cartons R.', p.rc, '', '#e05050') +
      '</div>';
  }
  else if (curStatCat === 'passes') {
    el.innerHTML = '<div class="stat-detail-grid">' +
      mkStatBox('Passes déc.', p.a, '', '#5599ee') +
      mkStatBox('Passes clés', p.kp, '', '#3498db') +
      mkStatBox('Courtes passes', p.courPasse || 0, '', '#1abc9c') +
      mkStatBox('Longues passes', p.longuePasse || 0, '', '#9b59b6') +
      mkStatBox('Récept. passes', p.rec || 0, '', 'var(--t2)') +
      mkStatBox('Passes / 90', p.min > 0 ? (((p.courPasse || 0) + (p.longuePasse || 0)) / (p.min / 90)).toFixed(1) : '0', '/90', '#5599ee') +
      mkStatBox('PD / 90', p.min > 0 ? (p.kp / (p.min / 90)).toFixed(2) : '0', '/90', '#3498db') +
      mkStatBox('Dribbles', p.drb, '', '#e0a920') +
      mkStatBox('Touches balle', p.touchesBall || 0, '', 'var(--t2)') +
      mkStatBox('T.balle / 90', p.min > 0 ? ((p.touchesBall || 0) / (p.min / 90)).toFixed(1) : '0', '/90', 'var(--t2)') +
      '</div>';
  }
  else if (curStatCat === 'pressing') {
    var sorted = SQUAD.slice().sort(function (a, b) { return (b.pressing || 0) - (a.pressing || 0); });
    var maxP = sorted[0] ? sorted[0].pressing || 1 : 1;
    el.innerHTML = '<div class="stat-detail-grid">' +
      mkStatBox('Actions pressing', p.pressing || 0, 'saison', 'var(--G)') +
      mkStatBox('Pressing / 90', p.min > 0 ? ((p.pressing || 0) / (p.min / 90)).toFixed(1) : '0', '/90', 'var(--G)') +
      mkStatBox('Tacles', p.tck, '', '#1abc9c') +
      mkStatBox('Interceptions', p.int, '', '#e67e22') +
      mkStatBox('Duels gagnés', p.du + '%', '', '#3498db') +
      mkStatBox('Aériens gagnés', p.aerienG || 0, '', '#9b59b6') +
      '</div>' +
      '<div class="card p"><div class="stitle">Classement pressing — Effectif complet</div>' +
      '<div style="display:flex;flex-direction:column;gap:5px;margin-top:6px;">' +
      sorted.slice(0, 15).map(function (q) {
        var w = Math.round(((q.pressing || 0) / maxP) * 100);
        return '<div style="display:flex;align-items:center;gap:8px;">' + imgEl(q.ph, q.col, 20) +
          '<div style="font-size:10px;min-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' + (q.n === p.n ? 'color:#fff;font-weight:700;' : 'color:var(--t2);') + '">' + q.n + '</div>' +
          '<div style="flex:1;height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;"><div style="width:' + w + '%;height:100%;background:' + (q.n === p.n ? 'var(--R)' : 'var(--B)') + ';border-radius:3px;"></div></div>' +
          '<div style="font-size:10px;font-weight:700;min-width:24px;text-align:right;color:' + (q.n === p.n ? nT(q.note) : 'var(--t2)') + ';">' + q.pressing + '</div>' +
          '</div>';
      }).join('') +
      '</div></div>';
  }
  else if (curStatCat === 'matchs') {
    el.innerHTML =
      '<div class="card p">' +
      '<div class="stitle">Note par match — ' + p.n + ' · Moy. ' + p.note.toFixed(2) + ' · ' + p.mp + ' matchs</div>' +
      '<div class="match-notes-grid" style="margin-top:8px;">' +
      p.matches.map(function (m) {
        var c = nT(m.note), bg = nB(m.note);
        return '<div class="mnd" style="background:' + bg + ';border-color:' + c + '22;" title="M' + m.m + ' vs ' + m.opp + ' (' + m.comp + ') · ' + m.note + '">' +
          '<div style="font-size:11px;font-weight:800;color:' + c + ';">' + m.note + '</div>' +
          '<div style="font-size:6px;color:var(--t2);max-width:28px;overflow:hidden;text-overflow:ellipsis;text-align:center;">' + m.opp.split(' ')[0] + '</div>' +
          '</div>';
      }).join('') +
      '</div>' +
      '</div>' +
      '<div class="card p"><div class="stitle">Buts &amp; Passes par match</div>' +
      '<div style="height:160px;position:relative;"><canvas id="cMatchHist" style="position:absolute;inset:0;width:100%!important;height:100%!important;"></canvas></div>' +
      '</div>';
    setTimeout(function () {
      var c = document.getElementById('cMatchHist'); if (!c) return;
      new Chart(c.getContext('2d'), { type: 'bar', data: { labels: p.matches.map(function (m) { return m.comp.slice(0, 2) + '' + m.m; }), datasets: [{ label: 'Buts', data: p.matches.map(function (m) { return m.g; }), backgroundColor: 'rgba(224,80,80,.7)', borderRadius: 2 }, { label: 'Passes', data: p.matches.map(function (m) { return m.a; }), backgroundColor: 'rgba(85,153,238,.7)', borderRadius: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: '#7b8eaa', font: { size: 8 }, boxWidth: 8 } } }, scales: { x: { ticks: { color: '#3d4f65', font: { size: 7 } }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#3d4f65', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.04)' } } } } });
    }, 50);
  }
  else if (curStatCat === 'classement') {
    var sects = { GK: 'Gardiens', DF: 'Défenseurs', MF: 'Milieux', FW: 'Attaquants' };
    var html = '<div class="card p" style="flex:1;">';
    Object.keys(sects).forEach(function (gr) {
      var list = SQUAD.filter(function (q) { return q.gr === gr; }).sort(function (a, b) { return b.note - a.note; });
      if (!list.length) return;
      var rows = list.map(function (q, i) {
        return '<tr>' +
          '<td><span style="font-weight:700;color:' + (i === 0 ? 'var(--G)' : i === 1 ? '#bbb' : i === 2 ? '#cd7f32' : 'var(--t3)') + ';">#' + (i + 1) + '</span></td>' +
          '<td style="padding:7px 10px;"><div style="display:flex;align-items:center;gap:6px;">' + imgEl(q.ph, q.col, 22) + '<span>' + q.n + (q.loan ? '<span class="loan-badge">Prêt</span>' : '') + '</span></div></td>' +
          '<td><span style="padding:2px 8px;border-radius:8px;font-size:11px;font-weight:800;background:' + nB(q.note) + ';color:' + nT(q.note) + ';">' + q.note.toFixed(2) + '</span></td>' +
          '<td style="color:#e05050;font-weight:700;text-align:right;">' + q.g + '</td>' +
          '<td style="color:#5599ee;font-weight:700;text-align:right;">' + q.a + '</td>' +
          '<td style="font-weight:700;text-align:right;color:var(--t2);">' + q.min.toLocaleString() + '</td>' +
          '<td style="font-size:9px;color:var(--t3);">' + q.mp + 'M</td>' +
          '</tr>';
      }).join('');
      html += '<div class="pos-rank-section">' +
        '<div class="pos-rank-title">' + sects[gr] + '</div>' +
        '<table class="pos-table"><thead><tr><th>#</th><th>Joueur</th><th>Note</th><th style="text-align:right;">G</th><th style="text-align:right;">A</th><th style="text-align:right;">Min</th><th>App.</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }
}


// --- classements ---

// TODO: ajouter un tri par compétition (Liga seule vs UCL)
var RK_CATS = [
  { k: 'g', lbl: 'Buteurs', icon: '', col: '#e05050', max: 22 },
  { k: 'a', lbl: 'Passeurs', icon: '', col: '#5599ee', max: 15 },
  { k: 'note', lbl: 'Meilleures notes', icon: '', col: '#EDBB00', max: 8.35, fmt: function (v) { return v.toFixed(2); } },
  { k: 'xg', lbl: 'xG total', icon: '', col: '#9b59b6', max: 16 },
  { k: 'tck', lbl: 'Tacles', icon: '', col: '#1abc9c', max: 80 },
  { k: 'int', lbl: 'Interceptions', icon: '', col: '#e67e22', max: 50 },
  { k: 'kp', lbl: 'Passes clés', icon: '', col: '#3498db', max: 98 },
  { k: 'drb', lbl: 'Dribbles réussis', icon: '', col: '#e91e63', max: 75 },
  { k: 'min', lbl: 'Minutes jouées', icon: '', col: '#7f8c8d', max: 3600, fmt: function (v) { return v.toLocaleString(); } },
];

// classe les joueurs par catégorie et affiche le top 4-5

function doRanking() {

  // console.log('doRanking called'); // debug

  var grid = document.getElementById('rkGrid'); grid.innerHTML = '';
  RK_CATS.forEach(function (cat) {
    var list = SQUAD.slice().filter(function (p) {
      return p.gr !== 'GK' || cat.k === 'min' || cat.k === 'note' || cat.k === 'tck' || cat.k === 'int';
    });
    list.sort(function (a, b) { return b[cat.k] - a[cat.k]; });
    list = list.slice(0, 5);
    var rows = list.map(function (p, i) {
      var pt = Math.round((p[cat.k] / cat.max) * 100);
      var mc = i === 0 ? 'g' : i === 1 ? 's' : i === 2 ? 'b' : '';
      var val = cat.fmt ? cat.fmt(p[cat.k]) : p[cat.k];
      return '<div class="rk-row" onclick="jumpTo(\'' + p.n + '\')">' +
        '<div class="rk-pos ' + mc + '">' + (i + 1) + '</div>' +
        imgEl(p.ph, p.col, 22) +
        '<div style="flex:1;min-width:0;"><div class="rk-name">' + p.n + '</div><div class="rk-bar"><div class="rk-fill" style="width:' + pt + '%;background:' + cat.col + ';"></div></div></div>' +
        '<div class="rk-val" style="color:' + cat.col + ';">' + val + '</div>' +
        '</div>';
    }).join('');
    var card = document.createElement('div'); card.className = 'rk-card';
    card.innerHTML = '<div class="rk-hd"><div class="rk-icon" style="background:' + cat.col + '22;">' + cat.icon + '</div><div class="rk-title">' + cat.lbl + '</div></div>' + rows;
    grid.appendChild(card);
  });
}


// --- progression match par match ---
// graphiques Chart.js (barres + ligne)

function buildProgSb() {
  var sb = document.getElementById('progSb'); sb.innerHTML = '';
  SQUAD.forEach(function (p, i) {
    var d = document.createElement('div'); d.className = 'psel' + (i === 0 ? ' on' : ''); d.id = 'pp' + i;
    d.innerHTML = imgEl(p.ph, p.col, 24) + '<div style="flex:1;min-width:0;"><div style="font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.n + '</div><div style="font-size:8px;color:var(--t2);">' + p.mp + ' matchs · ' + p.g + 'G</div></div>';
    d.onclick = (function (idx) { return function () { curProg = idx; document.querySelectorAll('.psel').forEach(function (t, j) { t.classList.toggle('on', j === idx); }); doProg(idx); }; })(i);
    sb.appendChild(d);
  });
}

function doProg(i) {
  var p = SQUAD[i];
  var ph = document.getElementById('pImg');
  ph.style.cssText = 'width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;background:' + p.col + ';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:12px;';
  var url = PHOTOS[p.ph];
  ph.innerHTML = url ? '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;object-position:top;" onerror="this.parentNode.innerHTML=\'' + ini(p.ph) + '\'">' : ini(p.ph);
  document.getElementById('pInfo').innerHTML = '<div style="font-size:13px;font-weight:700;">' + p.n + '</div><div style="font-size:9px;color:var(--t2);">' + p.p + ' · ' + p.mp + ' matchs · ' + p.g + 'G ' + p.a + 'A</div>';
  var m = p.matches;
  var avg = (m.reduce(function (s, x) { return s + x.note; }, 0) / m.length).toFixed(1);
  document.getElementById('pMini').innerHTML =
    '<div class="mm"><div class="mm-v" style="color:#e05050;">' + p.g + '</div><div class="mm-l">Buts</div></div>' +
    '<div class="mm"><div class="mm-v" style="color:#5599ee;">' + p.a + '</div><div class="mm-l">Passes</div></div>' +
    '<div class="mm"><div class="mm-v">' + avg + '</div><div class="mm-l">Note moy.</div></div>' +
    '<div class="mm"><div class="mm-v">' + m.filter(function (x) { return x.g > 0; }).length + '</div><div class="mm-l">Matchs but.</div></div>' +
    '<div class="mm"><div class="mm-v">' + m.filter(function (x) { return x.note >= 7.5; }).length + '</div><div class="mm-l">Exc.</div></div>' +
    '<div class="mm"><div class="mm-v">' + m.filter(function (x) { return x.started; }).length + '</div><div class="mm-l">Tit.</div></div>';
  if (chartProg) { chartProg.destroy(); chartProg = null; } if (chartProgN) { chartProgN.destroy(); chartProgN = null; }
  var lbs = m.map(function (x) { return x.comp.slice(0, 2) + x.m; });
  var co = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: '#7b8eaa', font: { size: 8 }, boxWidth: 8 } } }, scales: { x: { ticks: { color: '#3d4f65', font: { size: 7 } }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#3d4f65', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.04)' } } } };
  chartProg = new Chart(document.getElementById('cProg').getContext('2d'), {
    type: 'bar', data: {
      labels: lbs, datasets: [
        { label: 'Buts', data: m.map(function (x) { return x.g; }), backgroundColor: 'rgba(224,80,80,.7)', borderRadius: 2 },
        { label: 'Passes', data: m.map(function (x) { return x.a; }), backgroundColor: 'rgba(85,153,238,.7)', borderRadius: 2 },
        { label: 'G+A cumulés', type: 'line', data: m.map(function (x) { return x.cumG + x.cumA; }), borderColor: '#EDBB00', backgroundColor: 'transparent', tension: .35, pointRadius: 2, pointBackgroundColor: '#EDBB00', yAxisID: 'y1' }
      ]
    }, options: { responsive: true, maintainAspectRatio: false, plugins: co.plugins, scales: { x: co.scales.x, y: co.scales.y, y1: { position: 'right', ticks: { color: '#EDBB00', font: { size: 7 } }, grid: { display: false } } } }
  });
  chartProgN = new Chart(document.getElementById('cNote').getContext('2d'), {
    type: 'line', data: {
      labels: lbs, datasets: [
        { label: 'Note', data: m.map(function (x) { return x.note; }), borderColor: p.col, backgroundColor: p.col + '22', tension: .35, fill: true, pointRadius: 2.5, pointBackgroundColor: p.col, borderWidth: 2 },
        { label: 'Moy.', data: m.map(function () { return p.note; }), borderColor: 'rgba(255,255,255,.18)', borderDash: [4, 4], tension: 0, pointRadius: 0, borderWidth: 1 }
      ]
    }, options: { responsive: true, maintainAspectRatio: false, plugins: co.plugins, scales: { x: co.scales.x, y: { ...co.scales.y, min: 5, max: 10 } } }
  });
}


/* terrain SVG vertical + nœuds joueurs */
// dessine le terrain vertical en SVG

function pitchV() {
  var W = 440, H = 620, lc = 'rgba(255,255,255,.5)', lw = 1;
  var stripes = [0, 1, 2, 3, 4, 5].map(function (i) {
    return '<rect x="0" y="' + (i * H / 6) + '" width="' + W + '" height="' + (H / 6) + '" fill="' + (i % 2 ? 'rgba(255,255,255,.025)' : 'transparent') + '"/>';
  }).join('');
  return '<rect width="' + W + '" height="' + H + '" fill="#1a4f1a"/>' + stripes +
    '<rect x="12" y="12" width="' + (W - 24) + '" height="' + (H - 24) + '" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<line x1="12" y1="310" x2="428" y2="310" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<circle cx="220" cy="310" r="60" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<circle cx="220" cy="310" r="3" fill="' + lc + '"/>' +
    '<rect x="154" y="12" width="132" height="88" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="184" y="12" width="72" height="38" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="154" y="520" width="132" height="88" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>' +
    '<rect x="184" y="568" width="72" height="38" fill="none" stroke="' + lc + '" stroke-width="' + lw + '"/>';
}

// crée le nœud SVG d'un joueur sur le terrain (cercle + photo + nom + note)

function playerNode(pname, pcol, pph, tx, ty, note, isNew, role) {
  var url = (pph && pph.indexOf && pph.indexOf('http') === 0) ? pph : (PHOTOS[pph] || PHOTOS[pname]);
  var nt2 = nT(note), nb2 = nB(note);
  var last = pname.split(' ').pop();
  var R = 24;

  /* ID unique pour clipPath (éviter les doublons SVG) */
  var iid = 'cpn_' + pname.replace(/\W/g, '') + '_' + tx + '_' + ty;
  var circle;
  if (url) {
    circle =
      '<defs><clipPath id="' + iid + '"><circle cx="' + tx + '" cy="' + ty + '" r="' + R + '"/></clipPath></defs>' +
      '<circle cx="' + tx + '" cy="' + ty + '" r="' + (R + 2.5) + '" fill="' + pcol + '" stroke="' + (isNew ? '#EDBB00' : 'rgba(255,255,255,.9)') + '" stroke-width="' + (isNew ? 3 : 2) + '"/>' +
      '<image href="' + url + '" x="' + (tx - R) + '" y="' + (ty - R) + '" width="' + (R * 2) + '" height="' + (R * 2) + '" clip-path="url(#' + iid + ')" preserveAspectRatio="xMidYMin slice"/>';
  } else {
    circle =
      '<circle cx="' + tx + '" cy="' + ty + '" r="' + R + '" fill="' + pcol + '" stroke="' + (isNew ? '#EDBB00' : 'rgba(255,255,255,.9)') + '" stroke-width="' + (isNew ? 3 : 2) + '"/>' +
      '<text x="' + tx + '" y="' + (ty + 5) + '" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" font-family="system-ui">' + ini(pname) + '</text>';
  }
  var roleEl = role
    ? '<text x="' + tx + '" y="' + (ty - R - 6) + '" text-anchor="middle" fill="rgba(255,255,255,.38)" font-size="8" font-family="system-ui">' + role + '</text>'
    : '';
  return '<g style="cursor:pointer;" onclick="jumpTo(\'' + pname + '\')">' +
    circle +
    '<rect x="' + (tx - 33) + '" y="' + (ty + R + 3) + '" width="66" height="15" fill="rgba(0,0,0,.65)" rx="3"/>' +
    '<text x="' + tx + '" y="' + (ty + R + 13) + '" text-anchor="middle" fill="#fff" font-size="8.5" font-family="system-ui">' + last + '</text>' +
    '<rect x="' + (tx - 21) + '" y="' + (ty + R + 20) + '" width="42" height="14" fill="' + nb2 + '" rx="3"/>' +
    '<text x="' + tx + '" y="' + (ty + R + 30) + '" text-anchor="middle" fill="' + nt2 + '" font-size="9" font-weight="700" font-family="system-ui">' + note.toFixed(2) + '</text>' +
    roleEl +
    '</g>';
}


/* 
   ma compo personnalisée
    */
function buildCustBtns() {
  var c = document.getElementById('custBtns'); c.innerHTML = '';
  Object.keys(FORMS).forEach(function (fk) {
    var btn = document.createElement('button'); btn.className = 'form-btn' + (fk === curCustForm ? ' on' : ''); btn.textContent = fk;
    btn.onclick = (function (key, b) { return function () { curCustForm = key; document.querySelectorAll('#custBtns .form-btn').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); initCustomXI(key); renderCustomPitch(); }; })(fk, btn);
    c.appendChild(btn);
  });
}
function initCustomXI(fk) {
  custXI = FORMS[fk].map(function (pos) { return { role: pos.role, gr: pos.gr, tx: pos.tx, ty: pos.ty, player: null }; });
  updateCustNote();
}
function resetCustom() { initCustomXI(curCustForm); renderCustomPitch(); }
function updateCustNote() {
  var f = custXI.filter(function (s) { return s.player !== null; });
  var el = document.getElementById('custNote');
  if (!f.length) { el.textContent = '—'; el.style.color = 'var(--t1)'; return; }
  var avg = (f.reduce(function (s, sl) { return s + sl.player.note; }, 0) / f.length).toFixed(2);
  el.textContent = avg + '/10 (' + f.length + '/11)';
  el.style.color = f.length === 11 ? '#5ec42a' : 'var(--t1)';
}
function updateCustList() {
  var el = document.getElementById('custList'); el.innerHTML = '';
  var empty = custXI.every(function (s) { return s.player === null; });
  if (empty) { el.innerHTML = '<div style="font-size:9px;color:var(--t2);padding:6px 0;">Cliquez les postes sur le terrain</div>'; return; }
  custXI.forEach(function (slot, idx) {
    var row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:5px;padding:3px 0;border-bottom:1px solid var(--border);';
    if (slot.player) {
      var p = slot.player;
      row.innerHTML = '<div style="font-size:7px;font-weight:700;color:var(--t3);width:32px;text-transform:uppercase;">' + slot.role + '</div>' + imgEl(p.ph, p.col, 18) + '<div style="flex:1;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.n + '</div><div style="font-size:8px;font-weight:700;color:' + nT(p.note) + ';">' + p.note.toFixed(1) + '</div><div style="font-size:12px;cursor:pointer;color:var(--t3);margin-left:4px;" onclick="rmSlot(' + idx + ')">✕</div>';
    } else {
      row.innerHTML = '<div style="font-size:7px;font-weight:700;color:var(--t3);width:32px;text-transform:uppercase;">' + slot.role + '</div><div style="flex:1;font-size:9px;color:var(--t3);cursor:pointer;" onclick="openPicker(' + idx + ')">+ Choisir</div>';
    }
    el.appendChild(row);
  });
}
function renderCustomPitch() {
  var nodes = custXI.map(function (slot, idx) {
    if (slot.player) {
      var p = slot.player;
      return '<g data-drag-idx="' + idx + '" style="cursor:grab;">' + playerNode(p.n, p.col, p.ph, slot.tx, slot.ty, p.note, false, slot.role) + '</g>';
    }
    return '<g data-drag-idx="' + idx + '" onclick="openPicker(' + idx + ')" style="cursor:pointer;"><circle cx="' + slot.tx + '" cy="' + slot.ty + '" r="26" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.3)" stroke-width="2" stroke-dasharray="6,4"/><text x="' + slot.tx + '" y="' + (slot.ty - 4) + '" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="18" font-family="system-ui">+</text><text x="' + slot.tx + '" y="' + (slot.ty + 12) + '" text-anchor="middle" fill="rgba(255,255,255,.3)" font-size="8" font-family="system-ui">' + slot.role + '</text></g>';
  }).join('');
  var svgEl = document.getElementById('svgCustom');
  svgEl.innerHTML = pitchV() + nodes;
  updateCustNote(); updateCustList();
  makeDraggable(svgEl, custXI, renderCustomPitch);
}
function rmSlot(idx) { custXI[idx].player = null; renderCustomPitch(); }
function openPicker(idx) {
  pickerSlotIdx = idx; var slot = custXI[idx];
  document.getElementById('pickerTitle').textContent = 'Choisir joueur - ' + slot.role;
  var used = {}; custXI.forEach(function (s, i) { if (s.player && i !== idx) used[s.player.n] = true; });
  var gr = Array.isArray(slot.gr) ? slot.gr : [slot.gr];
  var compat = SQUAD.filter(function (p) { return !used[p.n] && gr.some(function (g) { return p.gr === g; }); }).sort(function (a, b) { return b.note - a.note; });
  var other = SQUAD.filter(function (p) { return !used[p.n] && !gr.some(function (g) { return p.gr === g; }); }).sort(function (a, b) { return b.note - a.note; });
  var html = '<div class="picker-section">✅ Compatibles (' + slot.role + ')</div>';
  html += compat.map(function (p) { return '<div class="picker-item" onclick="pickSlot(\'' + p.n + '\')">' + imgEl(p.ph, p.col, 32) + '<div style="flex:1;"><div style="font-size:11px;font-weight:600;">' + p.n + (p.loan ? '<span class="loan-badge">Prêt</span>' : '') + '</div><div style="font-size:9px;color:var(--t2);">' + p.p + ' · ' + p.g + 'G ' + p.a + 'A · ' + p.min + 'min</div></div><span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(2) + '</span></div>'; }).join('');
  if (other.length) { html += '<div class="picker-section">⚠ Autres postes</div>'; html += other.map(function (p) { return '<div class="picker-item" onclick="pickSlot(\'' + p.n + '\')">' + imgEl(p.ph, p.col, 32) + '<div style="flex:1;"><div style="font-size:11px;font-weight:600;">' + p.n + '</div><div style="font-size:9px;color:var(--t2);">' + p.p + ' (hors poste)</div></div><span style="font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(2) + '</span></div>'; }).join(''); }
  document.getElementById('pickerList').innerHTML = html;
  document.getElementById('pickerOverlay').classList.add('on');
}
function pickSlot(pname) {
  if (pickerSlotIdx < 0) return; var p = getP(pname); if (!p) return;
  custXI[pickerSlotIdx].player = p; closePicker(); renderCustomPitch();
}
function closePicker(evt) {
  if (evt && evt.target !== document.getElementById('pickerOverlay')) return;
  document.getElementById('pickerOverlay').classList.remove('on'); pickerSlotIdx = -1;
}


// --- XI type de la saison ---
// affiche le XI type de la saison sur le terrain

function drawXI() {
  var avg = (XI_2526.reduce(function (a, b) { return a + b.note; }, 0) / XI_2526.length).toFixed(2);
  document.getElementById('xi25note').textContent = avg + '/10';
  var nodes = XI_2526.map(function (item, idx) {
    var pr = getP(item.n) || { col: '#004D98', ph: item.n };
    return '<g data-drag-idx="' + idx + '" style="cursor:grab;">' + playerNode(item.n, pr.col, pr.ph, item.tx, item.ty, item.note, false, '') + '</g>';
  }).join('');
  var svgEl = document.getElementById('svgXi');
  svgEl.innerHTML = pitchV() + nodes;
  makeDraggable(svgEl, XI_2526, drawXI);
}


// --- comparaison entre joueurs ---

/* Analyse Cibles - Recrues prédéfinies */

function buildSelects() {
  var s1 = document.getElementById('cmpS1'); s1.innerHTML = '';
  var grpBarca = document.createElement('optgroup'); grpBarca.label = '🔵 Effectif Barça';
  SQUAD.forEach(function (p, i) { var o = document.createElement('option'); o.value = 'barca_' + i; o.textContent = p.n + ' (' + p.p + ')'; grpBarca.appendChild(o); });
  s1.appendChild(grpBarca);
  var grpRec = document.createElement('optgroup'); grpRec.label = '🔍 Analyse Cibles';
  RECRUES_PREDEFINIES.forEach(function (p, i) { var o = document.createElement('option'); o.value = 'recrue_' + i; o.textContent = p.n + ' - ' + (p.club||'?'); grpRec.appendChild(o); });
  s1.appendChild(grpRec);
  fillCmpS2();
}
function setCmpType(type) {
  cmpType = type;
  var bBtn = document.getElementById('cmpTypeBarca'), rBtn = document.getElementById('cmpTypeRecrue');
  bBtn.style.cssText = 'padding:5px 10px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:700;border:1px solid ' + (type === 'barca' ? 'var(--B);background:rgba(0,77,152,.22);color:#fff' : 'var(--border);background:var(--bg3);color:var(--t2)');
  rBtn.style.cssText = 'padding:5px 10px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:700;border:1px solid ' + (type === 'recrue' ? 'var(--R);background:rgba(165,0,68,.22);color:#fff' : 'var(--border);background:var(--bg3);color:var(--t2)');
  fillCmpS2(); doCmp();
}
function fillCmpS2() {
  var s2 = document.getElementById('cmpS2'); s2.innerHTML = '';
  if (cmpType === 'barca') {
    SQUAD.forEach(function (p, i) { var o = document.createElement('option'); o.value = 'barca_' + i; o.textContent = p.n + ' (' + p.p + ')'; s2.appendChild(o); });
    s2.value = 'barca_1';
  } else {
    var allRecrues = RECRUES_PREDEFINIES.concat(userRecrues);
    allRecrues.forEach(function (p, i) { var o = document.createElement('option'); o.value = 'recrue_' + i; o.textContent = p.n + (p.club ? ' - ' + p.club : ''); s2.appendChild(o); });
  }
}
function resolvePlayer(val) {
  if (!val) return null;
  var pts = val.split('_');
  if (pts[0] === 'barca') return SQUAD[+pts[1]];
  var allR = RECRUES_PREDEFINIES.concat(userRecrues);
  return allR[+pts[1]];
}
// génèrer la comparaison côte à côte entre deux joueurs

function doCmp() {
  var p1 = resolvePlayer(document.getElementById('cmpS1').value);
  var p2 = resolvePlayer(document.getElementById('cmpS2').value);
  if (!p1 || !p2) return;
  document.getElementById('cmpL1').textContent = p1.n.split(' ').pop();
  document.getElementById('cmpL2').textContent = p2.n.split(' ').pop();
  var mx = { g: Math.max(p1.g, p2.g, 1), a: Math.max(p1.a, p2.a, 1), xg: Math.max(p1.xg || 0, p2.xg || 0, .1), min: Math.max(p1.min, p2.min, 1), tck: Math.max(p1.tck, p2.tck, 1), int: Math.max(p1.int, p2.int, 1), kp: Math.max(p1.kp, p2.kp, 1), drb: Math.max(p1.drb, p2.drb, 1) };
  var rows = [
    { l: 'Buts', k: 'g', col: '#e05050' }, { l: '🎯 Passes déc.', k: 'a', col: '#5599ee' },
    { l: 'xG', fn: function (p) { return (p.xg || 0).toFixed(1); }, col: '#9b59b6' },
    { l: 'Minutes', fn: function (p) { return p.min.toLocaleString(); }, col: '#7f8c8d' },
    { l: 'G+A / 90', fn: ga90, col: 'var(--G)' },
    { l: 'Tacles', k: 'tck', col: '#1abc9c' }, { l: ' Interceptions', k: 'int', col: '#e67e22' },
    { l: 'Dribbles', k: 'drb', col: '#e91e63' }, { l: ' Passes clés', k: 'kp', col: '#3498db' },
    { l: 'Âge', fn: function (p) { return p.age + ' ans'; }, col: 'var(--t2)' },
    { l: 'Valeur march.', fn: function (p) { return p.mv || '-'; }, col: 'var(--t2)' },
    { l: 'Club', fn: function (p) { return p.club || 'FC Barcelona'; }, col: 'var(--t2)' },
  ];
  function mkCard(p) {
    var url = (p.ph && p.ph.indexOf && p.ph.indexOf('http') === 0) ? p.ph : PHOTOS[p.ph];
    var isR = !getP(p.n);
    return '<div class="cmp-card card">' +
      '<div class="cmp-hd" style="background:' + p.col + '18;flex-shrink:0;">' +
      '<div style="width:46px;height:46px;border-radius:50%;background:' + p.col + ';display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;overflow:hidden;flex-shrink:0;">' + (url ? '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;object-position:top;" onerror="this.parentNode.innerHTML=\'' + ini(p.ph || p.n) + '\'">' : ini(p.ph || p.n)) + '</div>' +
      '<div style="min-width:0;">' +
      '<div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.n + (p.loan ? '<span class="loan-badge">Prêt</span>' : '') + (isR ? '<span style="display:inline-block;padding:1px 5px;border-radius:6px;font-size:8px;font-weight:700;background:rgba(165,0,68,.2);color:var(--R);margin-left:4px;">Cible</span>' : '') + '</div>' +
      '<div style="font-size:9px;color:var(--t2);">' + (FLAGS[p.nat] || '🌍') + ' ' + p.p + ' · ' + p.age + 'a' + (p.club ? ' · ' + p.club : '') + '</div>' +
      '<span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:9px;font-weight:700;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(2) + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="cmp-body">' +
      rows.map(function (r) {
        var v = r.fn ? r.fn(p) : (r.k !== undefined ? p[r.k] !== undefined ? p[r.k] : '—' : '—');
        var numV = r.k ? p[r.k] || 0 : null;
        var bw = numV !== null && mx[r.k] ? Math.min(48, Math.round((numV / mx[r.k]) * 48)) : 0;
        return '<div class="cmp-row"><span style="color:var(--t2);">' + r.l + '</span>' +
          '<div style="display:flex;align-items:center;gap:5px;">' +
          (bw > 0 ? '<div style="height:4px;width:' + bw + 'px;background:' + r.col + ';border-radius:2px;flex-shrink:0;"></div>' : '') +
          '<span style="font-weight:700;color:' + r.col + ';">' + v + '</span>' +
          '</div></div>';
      }).join('') +
      '</div>' +
      '</div>';
  }
  document.getElementById('cmpCards').innerHTML = mkCard(p1) + mkCard(p2);
  if (chartCmp) { chartCmp.destroy(); chartCmp = null; }
  chartCmp = new Chart(document.getElementById('cCmp').getContext('2d'), {
    type: 'radar',
    data: {
      labels: RLBLS, datasets: [
        { data: rdData(p1), borderColor: '#e05050', backgroundColor: 'rgba(224,80,80,.15)', borderWidth: 2, pointBackgroundColor: '#e05050', pointRadius: 3 },
        { data: rdData(p2), borderColor: '#5599ee', backgroundColor: 'rgba(85,153,238,.15)', borderWidth: 2, pointBackgroundColor: '#5599ee', pointRadius: 3 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 10, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.06)' }, angleLines: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#7b8eaa', font: { size: 8 } } } } }
  });
}

// ma shortlist pour le mercato d'été 2026
// stats de la saison 2025-26 (fbref + fotmob + transferMarket)

var RECRUES_PREDEFINIES = [
  {n:'Victor Osimhen',p:'FW',gr:'FW',age:27,mv:'75M€',mvNum:70,club:'Naples',
   mp:29,st:26,min:2276,g:19,a:6,xg:15.2,note:7.7,
   nat:'NG',col:'#0048A0',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/victor-osimhen.png',
   tir:117,kp:8,drb:30,cv:50.4,tck:13,int:6,
   cl:13,bl:59,du:55,yc:8,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:19,touchesBall:10242,
   courPasse:3585,longuePasse:819,
   fautes:37,centres:13,tirs_cadres:59,cadrage_pct:50.4,
   ppm:2.21,b90:0.75,pd90:0.24,isRecrue:true},
  {n:'F. Pardo',p:'FW',gr:'FW',age:21,mv:'30M€',mvNum:45,club:'Lille',
   mp:25,st:23,min:2018,g:7,a:5,xg:6.1,note:6.98,
   nat:'BE',col:'#003478',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/mathias-fernandez-pardo.png',
   tir:61,kp:7,drb:33,cv:45.9,tck:13,int:8,
   cl:52,bl:28,du:55,yc:4,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:21,touchesBall:9081,
   courPasse:3178,longuePasse:726,
   fautes:13,centres:52,tirs_cadres:28,cadrage_pct:45.9,
   ppm:1.68,b90:0.31,pd90:0.22,isRecrue:true},
  {n:'Bastoni',p:'DF',gr:'DF',age:27,mv:'70M€',mvNum:80,club:'Inter Milan',
   mp:37,st:36,min:3012,g:2,a:6,xg:2.1,note:7.15,
   nat:'IT',col:'#0B2262',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/alessandro-bastoni.png',
   tir:21,kp:15,drb:29,cv:42.9,tck:47,int:29,
   cl:100,bl:9,du:55,yc:8,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:76,touchesBall:13554,
   courPasse:4744,longuePasse:1084,
   fautes:58,centres:100,tirs_cadres:9,cadrage_pct:42.9,
   ppm:2.03,b90:0.06,pd90:0.18,isRecrue:true},
  {n:'Vuskovic',p:'DF',gr:'DF',age:19,mv:'50M€',mvNum:25,club:'Hamburg',
   mp:25,st:25,min:2250,g:5,a:0,xg:4.1,note:7.12,
   nat:'HR',col:'#000000',ph:'https://photo.maxifoot.fr/phoj/2/phoj253830.png',
   cl:2,bl:8,du:55,yc:5,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:47,touchesBall:10125,
   courPasse:3544,longuePasse:810,
   fautes:25,centres:2,tirs_cadres:8,cadrage_pct:27.6,
   ppm:1.16,b90:0.2,pd90:0.0,isRecrue:true},
  {n:'Dumfries',p:'DF',gr:'DF',age:30,mv:'25M€',mvNum:28,club:'Inter Milan',
   mp:23,st:18,min:1570,g:5,a:1,xg:4.9,note:6.98,
   nat:'NL',col:'#0B2262',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/denzel-justus-morris-dumfries.png',
   tir:26,kp:4,drb:16,cv:26.9,tck:12,int:10,
   cl:37,bl:7,du:55,yc:2,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:22,touchesBall:7065,
   courPasse:2473,longuePasse:565,
   fautes:24,centres:37,tirs_cadres:7,cadrage_pct:26.9,
   ppm:2.09,b90:0.29,pd90:0.06,isRecrue:true},
  {n:'Grimaldo',p:'DF',gr:'DF',age:30,mv:'20M€',mvNum:60,club:'Leverkusen',
   mp:41,st:40,min:3584,g:14,a:10,xg:9.8,note:7.58,
   nat:'ES',col:'#E21113',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/alejandro-grimaldo.png',
   tir:82,kp:19,drb:36,cv:40.2,tck:49,int:30,
   cl:222,bl:33,du:55,yc:7,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:79,touchesBall:16128,
   courPasse:5645,longuePasse:1290,
   fautes:21,centres:222,tirs_cadres:33,cadrage_pct:40.2,
   ppm:1.81,b90:0.35,pd90:0.25,isRecrue:true},
  {n:'Abde Ezzalzouli',p:'FW',gr:'FW',age:24,mv:'20M€',mvNum:40,club:'Betis',
   mp:36,st:29,min:2566,g:11,a:7,xg:10.8,note:7.08,
   nat:'MA',col:'#009B3A',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/abdessamad-ezzalzouli.png',
   tir:90,kp:13,drb:78,cv:34.4,tck:31,int:19,
   cl:70,bl:31,du:55,yc:4,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:50,touchesBall:11547,
   courPasse:4041,longuePasse:924,
   fautes:29,centres:70,tirs_cadres:31,cadrage_pct:34.4,
   ppm:1.58,b90:0.39,pd90:0.25,isRecrue:true},
  {n:'Guela Doué',p:'DF',gr:'DF',age:23,mv:'25M€',mvNum:55,club:'Strasbourg',
   mp:30,st:27,min:2458,g:2,a:7,xg:2.0,note:6.92,
   nat:'CI',col:'#C63B26',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/guela-doue.png',
   tir:22,kp:17,drb:25,cv:31.8,tck:41,int:34,
   cl:65,bl:7,du:55,yc:7,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:75,touchesBall:11061,
   courPasse:3871,longuePasse:885,
   fautes:54,centres:65,tirs_cadres:7,cadrage_pct:31.8,
   ppm:1.8,b90:0.07,pd90:0.26,isRecrue:true},
  {n:'Ratiu',p:'DF',gr:'DF',age:27,mv:'15M€',mvNum:18,club:'Rayo Vallecano',
   mp:28,st:27,min:2403,g:0,a:3,xg:0.0,note:6.85,
   nat:'RO',col:'#FF0000',ph:'https://img.a.transfermarkt.technology/portrait/header/527966-1765462531.jpg?lm=1',
   tir:26,kp:14,drb:20,cv:30.8,tck:33,int:36,
   cl:86,bl:8,du:55,yc:8,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:69,touchesBall:10814,
   courPasse:3785,longuePasse:865,
   fautes:19,centres:86,tirs_cadres:8,cadrage_pct:30.8,
   ppm:1.25,b90:0.0,pd90:0.11,isRecrue:true},
  {n:'Micky van de Ven',p:'DF',gr:'DF',age:25,mv:'60M€',mvNum:65,club:'Tottenham',
   mp:40,st:40,min:3491,g:7,a:1,xg:7.0,note:7.01,
   nat:'NL',col:'#001C58',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/mickey-van-de-ven.png',
   tir:22,kp:10,drb:30,cv:45.5,tck:27,int:30,
   cl:3,bl:10,du:55,yc:11,rc:1,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:57,touchesBall:15710,
   courPasse:5498,longuePasse:1257,
   fautes:37,centres:3,tirs_cadres:10,cadrage_pct:45.5,
   ppm:1.07,b90:0.18,pd90:0.03,isRecrue:true},
  {n:'Julian Alvarez',p:'FW',gr:'FW',age:26,mv:'75M€',mvNum:75,club:'Atlético Madrid',
   mp:47,st:40,min:3390,g:19,a:9,xg:15.5,note:7.11,
   nat:'AR',col:'#CC1229',ph:'https://img-estaticos.atleticodemadrid.com/system/fotos/18092/destacado_460x460/julian_alvarez.png?1754736536',
   tir:111,kp:11,drb:29,cv:48.6,tck:21,int:7,
   cl:159,bl:54,du:55,yc:2,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:28,touchesBall:15255,
   courPasse:5339,longuePasse:1220,
   fautes:37,centres:159,tirs_cadres:54,cadrage_pct:48.6,
   ppm:1.85,b90:0.5,pd90:0.24,isRecrue:true},
  {n:'Yan Diomandé',p:'FW',gr:'FW',age:19,mv:'50M€',mvNum:50,club:'Leipzig',
   mp:32,st:27,min:2374,g:13,a:7,xg:13.0,note:7.05,
   nat:'CI',col:'#006E2D',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/yan-diomande.png',
   tir:54,kp:13,drb:36,cv:48.1,tck:20,int:20,
   cl:41,bl:26,du:55,yc:2,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:40,touchesBall:10683,
   courPasse:3739,longuePasse:855,
   fautes:17,centres:41,tirs_cadres:26,cadrage_pct:48.1,
   ppm:2.03,b90:0.49,pd90:0.27,isRecrue:true},
  {n:'Antonio Nusa',p:'FW',gr:'FW',age:21,mv:'38M€',mvNum:38,club:'Leipzig',
   mp:31,st:26,min:2134,g:5,a:4,xg:5.1,note:6.95,
   nat:'NO',col:'#003478',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/antonio-eromonsele-nordby-nusa.png',
   tir:57,kp:6,drb:62,cv:29.8,tck:15,int:7,
   cl:69,bl:17,du:55,yc:0,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:22,touchesBall:9603,
   courPasse:3361,longuePasse:768,
   fautes:11,centres:69,tirs_cadres:17,cadrage_pct:29.8,
   ppm:2.09,b90:0.21,pd90:0.17,isRecrue:true},
  {n:'Bernardo Silva',p:'FW',gr:'FW',age:31,mv:'00M€',mvNum:35,club:'Man. City',
   mp:45,st:38,min:3287,g:3,a:5,xg:3.0,note:7.15,
   nat:'PT',col:'#6CABDD',ph:'https://img.uefa.com/imgml/TP/players/1/2026/324x324/250059115.jpg',
   tir:27,kp:11,drb:26,cv:33.3,tck:29,int:21,
   cl:80,bl:9,du:55,yc:14,rc:1,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:50,touchesBall:14792,
   courPasse:5177,longuePasse:1183,
   fautes:51,centres:80,tirs_cadres:9,cadrage_pct:33.3,
   ppm:2.18,b90:0.08,pd90:0.14,isRecrue:true},
  {n:'Marco Palestra',p:'DF',gr:'DF',age:21,mv:'30M€',mvNum:30,club:'Cagliari',
   mp:33,st:31,min:2961,g:1,a:4,xg:1.0,note:7.08,
   nat:'IT',col:'#0B2262',ph:'https://objetos.estaticos-marca.com/assets/sports/headshots/football/124/png/144x144/620109.png',
   tir:20,kp:11,drb:25,cv:20.0,tck:34,int:22,
   cl:95,bl:4,du:55,yc:4,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:56,touchesBall:13324,
   courPasse:4663,longuePasse:1066,
   fautes:30,centres:95,tirs_cadres:4,cadrage_pct:20.0,
   ppm:1.0,b90:0.03,pd90:0.12,isRecrue:true},
   {n:'Bradley Barcola',p:'FW',gr:'FW',age:23,mv:'70M€',mvNum:70,club:'PSG',
   mp:39,st:29,min:2610,g:12,a:6,xg:11.2,note:7.41,
   nat:'FR',col:'#004170',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/bradley-barcola.png',
   tir:95,kp:51,drb:51,cv:48.2,tck:18,int:20,
   cl:30,bl:18,du:55,yc:3,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:42,touchesBall:11400,
   courPasse:3990,longuePasse:912,
   fautes:40,centres:30,tirs_cadres:48,cadrage_pct:50.5,
   ppm:2.15,b90:0.41,pd90:0.21,isRecrue:true},
  {n:'Gonçalo Inácio',p:'DF',gr:'DF',age:24,mv:'60M€',mvNum:60,club:'Sporting CP',
   mp:32,st:32,min:2744,g:1,a:3,xg:1.2,note:7.52,
   nat:'PT',col:'#006600',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/goncalo-bernardo-inacio.png',
   tir:9,kp:19,drb:10,cv:22.2,tck:50,int:27,
   cl:88,bl:8,du:60,yc:4,rc:1,
   sv:0,ga:0,cs:13,arrets_pct:0.0,ga90_gk:0.0,
   pressing:58,touchesBall:14800,
   courPasse:5180,longuePasse:1184,
   fautes:21,centres:88,tirs_cadres:2,cadrage_pct:22.2,
   ppm:1.95,b90:0.04,pd90:0.10,isRecrue:true},
  {n:'Andreas Schjelderup',p:'FW',gr:'FW',age:21,mv:'30M€',mvNum:42,club:'Benfica',
   mp:35,st:15,min:2039,g:7,a:4,xg:6.8,note:7.26,
   nat:'NO',col:'#C0073D',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/andreas-schjelderup.png',
   tir:38,kp:7,drb:42,cv:39.5,tck:17,int:10,
   cl:14,bl:15,du:55,yc:3,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:27,touchesBall:9176,
   courPasse:3212,longuePasse:734,
   fautes:30,centres:14,tirs_cadres:15,cadrage_pct:39.5,
   ppm:2.28,b90:0.31,pd90:0.18,isRecrue:true},
  {n:'Pedro Porro',p:'DF',gr:'DF',age:26,mv:'40M€',mvNum:40,club:'Tottenham',
   mp:42,st:38,min:3400,g:2,a:4,xg:1.5,note:7.07,
   nat:'ES',col:'#132257',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/pedro-antonio-porro-sauceda.png',
   tir:22,kp:18,drb:26,cv:27.8,tck:72,int:40,
   cl:135,bl:35,du:68,yc:9,rc:0,
   sv:0,ga:0,cs:0,arrets_pct:0.0,ga90_gk:0.0,
   pressing:72,touchesBall:16000,
   courPasse:5500,longuePasse:1250,
   fautes:33,centres:135,tirs_cadres:6,cadrage_pct:27.3,
   ppm:1.54,b90:0.05,pd90:0.11,isRecrue:true},
 {n:'Marc Cucurella',p:'DF',gr:'DF',age:27,mv:'40M€',mvNum:40,club:'Chelsea',
   mp:45,st:40,min:3500,g:1,a:3,xg:1.1,note:6.99,
   nat:'ES',col:'#034694',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/marc-cucurella.png',
   tir:22,kp:16,drb:35,cv:27.8,tck:70,int:42,
   cl:125,bl:25,du:68,yc:7,rc:1,
   sv:0,ga:0,cs:9,arrets_pct:0.0,ga90_gk:0.0,
   pressing:76,touchesBall:17000,
   courPasse:6000,longuePasse:1350,
   fautes:50,centres:125,tirs_cadres:6,cadrage_pct:27.3,
   ppm:1.73,b90:0.03,pd90:0.09,isRecrue:true},
  {n:'Cristian Romero',p:'DF',gr:'DF',age:27,mv:'65M€',mvNum:65,club:'Tottenham',
   mp:33,st:28,min:2600,g:5,a:2,xg:3.6,note:7.06,
   nat:'AR',col:'#132257',ph:'https://assets-fr.imgfoot.com/media/cache/150x150/portrait/cristian-gabriel-romero.png',
   tir:20,kp:12,drb:14,cv:35.3,tck:70,int:40,
   cl:110,bl:32,du:72,yc:12,rc:2,
   sv:0,ga:0,cs:5,arrets_pct:0.0,ga90_gk:0.0,
   pressing:55,touchesBall:13500,
   courPasse:4700,longuePasse:1070,
   fautes:38,centres:20,tirs_cadres:7,cadrage_pct:35.0,
   ppm:1.85,b90:0.17,pd90:0.07,isRecrue:true},
];

// état du simulateur mercato (ce que j'ai vendu/acheté/rappelé)

var mercatoVendus   = {};   /* {nom: {player}} */
var mercatoAchetes  = {};   /* {nom: {player}} depuis RECRUES */
var mercatoRappeles = {};   /* {nom: {player}} depuis PRETS */
var mercatoFormKey  = '4-3-3';
var mercatoXI       = [];
var mercatoPickSlot = -1;

function getMercatoEffectif() {
  var result = [];
  SQUAD.forEach(function(p) { if (!mercatoVendus[p.n]) result.push(p); });
  RECRUES_PREDEFINIES.forEach(function(p) { if (mercatoAchetes[p.n]) result.push(p); });
  PRETS.forEach(function(p) {
    if (!mercatoRappeles[p.n] || p.returns === 'Vendu') return;
    result.push({
      n:p.n, p:p.p, gr:p.p, num:99, age:p.age||25, h:'1,80m', mv:'?M€', mvNum:0,
      mp:p.mp_loan||0, st:p.mp_loan||0, min:(p.mp_loan||0)*75,
      g:p.g_loan||0, a:p.a_loan||0, xg:p.g_loan||0,
      note:p.note_loan||6.5, nat:'ES', col:p.col||'#5a6070', ph:p.n,
      tir:0,kp:0,drb:0,cv:0,tck:0,int:0,cl:0,bl:0,du:50,
      sv:0,ga:0,cs:0,pressing:0,touchesBall:0,courPasse:0,longuePasse:0,
      rec:0,aerienG:0,aerienP:0,fautes:0,centres:0,tirs_cadres:0,cadrage_pct:0,
      ppm:0,plus_minus:0,b90:0,pd90:0,ga90_stat:0,arrets_pct:0,ga90_gk:0,
      note_liga:p.note_loan||6.5, note_ucl:null,
      info:p.info||'', isRappele:true
    });
  });
  return result;
}

// extrait le nombre depuis une valeur comme '70M€' -> 70
// nécessaire parce que SQUAD stocke mv en string et pas en nombre
function parseMvNum(p) {
  if (p.mvNum) return p.mvNum;
  if (!p.mv) return 0;
  var m = p.mv.match(/[\d,.]+/);
  return m ? parseFloat(m[0].replace(',', '.')) : 0;
}

function mercatoBudget() {
  var enc = 0, dep = 0;
  Object.keys(mercatoVendus).forEach(function(n) {
    var p = mercatoVendus[n]; if(p) enc += parseMvNum(p);
  });
  Object.keys(mercatoAchetes).forEach(function(n) {
    var p = mercatoAchetes[n]; if(p) dep += parseMvNum(p);
  });
  return {enc: enc, dep: dep, solde: enc - dep};
}

/* Définition des postes à analyser */
var REC_POSTES = [
  {
    id: 'GK', emoji: '', lbl: 'Gardien de but',
    filter: function (p) { return p.gr === 'GK'; },
    ideal: { minNote: 7.4, minDepth: 2, maxAge: 30 },
    desc: 'Joan García titulaire. Szczesny en fin de contrat. Ter Stegen prêté à Girona.'
  },

  {
    id: 'RB', emoji: '', lbl: 'Latéral droit',
    filter: function (p) { return p.n.indexOf('Kounde') > -1 || p.n.indexOf('Cancelo') > -1 || p.n.indexOf('Gerard') > -1; },
    ideal: { minNote: 7.3, minDepth: 2, maxAge: 28 },
    desc: 'Cancelo en fin de prêt. Kounde 27 ans. Héctor Fort prêté à Elche (talent à surveiller). Chercher un autre lateral droit'
  },

  {
    id: 'CB', emoji: '', lbl: 'Défenseur central',
    filter: function (p) { return p.gr === 'DF' && p.n.indexOf('Balde') < 0 && p.n.indexOf('Kounde') < 0 && p.n.indexOf('Gerard') < 0 && p.n.indexOf('Cancelo') < 0; },
    ideal: { minNote: 7.4, minDepth: 3, maxAge: 28 },
    desc: 'Cubarski (19) + Araujo excellent duo. Christensen blessures chroniques. Poste solide. recruter un defenseur pour remplacer Christensen en fin de contrat et possiblement le depart de Araujo'
  },

  {
    id: 'LB', emoji: '', lbl: 'Latéral gauche',
    filter: function (p) { return p.n.indexOf('Balde') > -1 || p.n.indexOf('Gerard') > -1; },
    ideal: { minNote: 7.3, minDepth: 2, maxAge: 27 },
    desc: 'Balde titulaire incontournable. Gerard en rotation. Profondeur à améliorer.'
  },

  {
    id: 'MF', emoji: '', lbl: 'Milieu de terrain',
    filter: function (p) { return p.gr === 'MF'; },
    ideal: { minNote: 7.3, minDepth: 5, maxAge: 27 },
    desc: 'Gavi peu présent (blessures). Bernal souvent blessé . Olomo et Firmin souvent irreguliers Frenkie 2 expulsions. Chercher un milieu libre pur faire reposer Pedri . Manque profondeur'
  },

  {
    id: 'FW', emoji: '', lbl: 'Attaquant / Ailier',
    filter: function (p) { return p.gr === 'FW'; },
    ideal: { minNote: 7.4, minDepth: 4, maxAge: 29 },
    desc: 'Lewandowski fin de contrat juin 2026. Rashford prêt à décider. Yamal/Raphinha solides. chercher un attaquant pour former un trio . Chercher un ailier gauche fort'
  },
];

// analyse les besoins par poste et calcule un score d'urgence
function doRec() {

  /* Construire les boutons de postes */
  var btns = document.getElementById('recPosBtns');
  btns.innerHTML = '';
  REC_POSTES.forEach(function (pos) {
    var ps = SQUAD.filter(pos.filter);
    if (!ps.length) return;
    var avgN = ps.reduce(function (s, p) { return s + p.note; }, 0) / ps.length;
    var depth = ps.filter(function (p) { return p.note >= 6.8 && p.min > 800; }).length;
    var score = 0;
    if (avgN < pos.ideal.minNote) score += 25;
    if (depth < pos.ideal.minDepth) score += 35;
    if (ps.some(function (p) { return p.loan; })) score += 20;
    if (ps.some(function (p) { return p.n === 'Lewandowski' && p.min > 2000; })) score = Math.max(score, 60);
    score = Math.min(100, score);
    var uc = score >= 60 ? '#e05050' : score >= 30 ? '#e0a920' : '#5ec42a';
    var ul = score >= 60 ? 'URGENT' : score >= 30 ? 'SURVEILLER' : 'OK';
    var btn = document.createElement('div');
    btn.className = 'rec-pos-btn' + (curRecPos === pos.id ? ' on' : '');
    btn.innerHTML =
      '<div style="font-size:16px;">' + pos.emoji + '</div>' +
      '<div style="flex:1;">' +
      '<div style="font-size:11px;font-weight:700;">' + pos.lbl + '</div>' +
      '<div style="font-size:8px;color:var(--t2);">' + ps.length + ' joueurs · Note moy. ' + avgN.toFixed(2) + '</div>' +
      '</div>' +
      '<span class="rec-score-pill" style="background:' + uc + '22;color:' + uc + ';">' + score + '</span>';
    btn.onclick = (function (p) { return function () { curRecPos = p.id; curRecRadarSel = null; doRec(); selectRecPos(p); }; })(pos);
    btns.appendChild(btn);
  });

  /* Si un poste est sélectionné, afficher le tableau */
  if (curRecPos) {
    var pos = REC_POSTES.find(function (p) { return p.id === curRecPos; });
    if (pos) selectRecPos(pos);
  }
}

function selectRecPos(pos) {
  document.getElementById('recPosTitle').textContent = pos.emoji + ' ' + pos.lbl;
  document.getElementById('recPosDesc').textContent = pos.desc;
  renderRecTable(pos);
}

function renderRecTable(pos) {
  var tbody = document.getElementById('recTableBody');
  tbody.innerHTML = '';

  /* Joueurs Barça au poste */
  var barcaPlayers = SQUAD.filter(pos.filter);

  /* Recrues prédéfinies filtrées par poste */
  var predef = RECRUES_PREDEFINIES.filter(function (r) { return r.gr === pos.id; });

  /* Recrues ajoutées par l'utilisateur pour ce poste */
  var userRecs = userRecrues.filter(function (r) { return r.posId === pos.id; });
  var allRecrues = predef.concat(userRecs);

  /* Max pour les barres */
  var allPlayers = barcaPlayers.concat(allRecrues);
  var mx = {
    g: Math.max.apply(null, allPlayers.map(function (p) { return p.g || 0; }).concat([1])),
    a: Math.max.apply(null, allPlayers.map(function (p) { return p.a || 0; }).concat([1])),
    note: Math.max.apply(null, allPlayers.map(function (p) { return p.note || 0; }).concat([1])),
    xg: Math.max.apply(null, allPlayers.map(function (p) { return p.xg || 0; }).concat([1])),
    tkint: Math.max.apply(null, allPlayers.map(function (p) { return (p.tck || 0) + (p.int || 0); }).concat([1])),
    kp: Math.max.apply(null, allPlayers.map(function (p) { return p.kp || 0; }).concat([1])),
  };
  function mkBar(val, max, col) {
    var w = Math.min(50, Math.round((val / max) * 50));
    return '<div class="bar-cell"><div class="bar-cell-bar" style="width:' + w + 'px;background:' + col + ';"></div><span>' + val + '</span></div>';
  }
  function mkRow(p, isRecrue, userIdx) {
    var tr = document.createElement('tr');
    if (isRecrue) tr.className = 'is-recrue';
    var url = PHOTOS[p.ph || p.n];
    var avEl = url
      ? '<div style="width:24px;height:24px;border-radius:50%;background:' + p.col + ';overflow:hidden;flex-shrink:0;"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentNode.innerHTML=\'' + ini(p.n) + '\'"></div>'
      : '<div style="width:24px;height:24px;border-radius:50%;background:' + p.col + ';display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;flex-shrink:0;">' + ini(p.n) + '</div>';
    tr.innerHTML =
      '<td><div style="display:flex;align-items:center;gap:6px;">' + avEl +
      '<div><div style="font-size:11px;font-weight:600;">' + p.n + (isRecrue ? '<span style="display:inline-block;padding:1px 4px;border-radius:4px;font-size:7px;font-weight:700;background:rgba(165,0,68,.2);color:var(--R);margin-left:4px;">CIBLE</span>' : '') + (p.loan ? '<span class="loan-badge">Prêt</span>' : '') + '</div>' +
      '<div style="font-size:8px;color:var(--t2);">' + p.p + ' · ' + p.age + 'a</div>' +
      '</div>' +
      '</div></td>' +
      '<td style="font-size:10px;color:var(--t2);">' + (p.club || 'FC Barcelona') + '</td>' +
      '<td><span style="padding:2px 7px;border-radius:7px;font-size:10px;font-weight:800;background:' + nB(p.note) + ';color:' + nT(p.note) + ';">' + p.note.toFixed(2) + '</span></td>' +
      '<td>' + mkBar(p.g, '' + mx.g, '#e05050') + '</td>' +
      '<td>' + mkBar(p.a, '' + mx.a, '#5599ee') + '</td>' +
      '<td>' + mkBar((p.xg || 0).toFixed(1), '' + mx.xg, '#9b59b6') + '</td>' +
      '<td style="font-size:10px;color:var(--t2);">' + p.min.toLocaleString() + '</td>' +
      '<td>' + mkBar((p.tck || 0) + (p.int || 0), '' + mx.tkint, '#1abc9c') + '</td>' +
      '<td>' + mkBar(p.kp || 0, '' + mx.kp, '#3498db') + '</td>' +
      '<td>' + (isRecrue && userIdx >= 0 ? '<button class="btn-danger" onclick="removeRecrue(\'' + pos.id + '\',' + userIdx + ')">✕</button>' : '') + '</td>';
    tbody.appendChild(tr);
  }
  /* Ligne séparateur */
  if (barcaPlayers.length) {
    var sep = document.createElement('tr');
    sep.innerHTML = '<td colspan="10" style="padding:4px 10px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3);background:var(--bg3);">🔵 Effectif actuel Barça</td>';
    tbody.appendChild(sep);
    barcaPlayers.sort(function (a, b) { return b.note - a.note; }).forEach(function (p) { mkRow(p, false, -1); });
  }
  if (allRecrues.length) {
    var sep2 = document.createElement('tr');
    sep2.innerHTML = '<td colspan="10" style="padding:4px 10px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3);background:rgba(165,0,68,.08);">🔍 Analyse Cibles</td>';
    tbody.appendChild(sep2);

    /* Pré-définies (non supprimables) */
    predef.sort(function (a, b) { return b.note - a.note; }).forEach(function (p) { mkRow(p, true, -1); });
    
    /* Ajoutées par l'utilisateur (supprimables) */
    userRecs.forEach(function (p, i) { mkRow(p, true, i); });
  }
  if (!barcaPlayers.length && !allRecrues.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--t2);padding:20px;">Aucun joueur à afficher</td></tr>';
  }
  /* Mettre à jour le radar comparatif */
  renderRecRadar(pos, barcaPlayers, allRecrues);
}

function renderRecRadar(pos, barcaPlayers, recrues) {
  if (chartRecRadar) { chartRecRadar.destroy(); chartRecRadar = null; }

  /* Sélecteur de recrues cliquables */
  var selWrap = document.getElementById('recRadarSel');
  if (selWrap) {
    selWrap.innerHTML = '';
    if (recrues.length > 1) {
      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);margin-bottom:5px;';
      lbl.textContent = 'Recrue à comparer :';
      selWrap.appendChild(lbl);
      var colors = ['#e05050', '#e0a920', '#5ec42a', '#9b59b6'];
      recrues.forEach(function(r, i) {
        var isSelected = curRecRadarSel === r.n || (curRecRadarSel === null && i === 0);
        var btn = document.createElement('button');
        btn.style.cssText = 'padding:3px 9px;border-radius:5px;border:1px solid ' + (isSelected ? colors[i%4] : 'var(--border)') + ';background:' + (isSelected ? colors[i%4]+'22' : 'var(--bg3)') + ';color:' + (isSelected ? colors[i%4] : 'var(--t2)') + ';font-size:9px;font-weight:700;cursor:pointer;margin:2px;';
        btn.textContent = r.n;
        btn.onclick = (function(name) {
          return function() { curRecRadarSel = name; renderRecRadar(pos, barcaPlayers, recrues); };
        })(r.n);
        selWrap.appendChild(btn);
      });
    }
  }

  /* Construction des datasets */
  var datasets = [];
  var colors2 = ['#e05050', '#e0a920', '#5ec42a', '#9b59b6'];

  /* Meilleur Barça au poste */
  if (barcaPlayers.length) {
    var best = barcaPlayers.slice().sort(function (a, b) { return b.note - a.note; })[0];
    datasets.push({ label: best.n + ' (Barça)', data: rdData(best), borderColor: '#5599ee', backgroundColor: 'rgba(85,153,238,.15)', borderWidth: 2, pointBackgroundColor: '#5599ee', pointRadius: 3 });
  }

  /* Recrue sélectionnée (ou toutes si <= 3 et aucune sélection) */
  if (recrues.length === 1) {
    datasets.push({ label: recrues[0].n, data: rdData(recrues[0]), borderColor: colors2[0], backgroundColor: colors2[0] + '26', borderWidth: 2, pointBackgroundColor: colors2[0], pointRadius: 3 });
  } else if (recrues.length > 1) {
    var target = curRecRadarSel ? recrues.find(function(r) { return r.n === curRecRadarSel; }) : null;
    if (!target) target = recrues[0];
    datasets.push({ label: target.n, data: rdData(target), borderColor: colors2[0], backgroundColor: colors2[0] + '26', borderWidth: 2, pointBackgroundColor: colors2[0], pointRadius: 3 });
  }

  if (!datasets.length) return;
  chartRecRadar = new Chart(document.getElementById('cRecRadar').getContext('2d'), {
    type: 'radar',
    data: { labels: RLBLS, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: '#7b8eaa', font: { size: 9 }, boxWidth: 8 } } },
      scales: { r: { min: 0, max: 10, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.06)' }, angleLines: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#7b8eaa', font: { size: 9 } } } }
    }
  });
}

/** Ajouter une recrue manuellement saisie par l'utilisateur */
// je lis les champs du formulaire et j'ajoute dans userRecrues

function addRecrue() {
  var name = document.getElementById('recName').value.trim();
  var club = document.getElementById('recClub').value.trim();
  var age = parseInt(document.getElementById('recAge').value) || 23;
  var mv = document.getElementById('recMV').value.trim() || '?M€';
  var mp = parseInt(document.getElementById('rMP').value) || 0;
  var g = parseInt(document.getElementById('rG').value) || 0;
  var a = parseInt(document.getElementById('rA').value) || 0;
  var xg = parseFloat(document.getElementById('rXG').value) || 0;
  var min = parseInt(document.getElementById('rMin').value) || 0;
  var note = parseFloat(document.getElementById('rNote').value) || 6.5;
  var tck = parseInt(document.getElementById('rTck').value) || 0;
  var int2 = parseInt(document.getElementById('rInt').value) || 0;
  var kp = parseInt(document.getElementById('rKP').value) || 0;
  var msg = document.getElementById('recAddMsg');

  if (!name) { msg.style.color = '#e05050'; msg.textContent = 'Veuillez saisir un nom.'; return; }
  if (!curRecPos) { msg.style.color = '#e05050'; msg.textContent = 'Sélectionnez d\'abord un poste.'; return; }
  if (note < 0 || note > 10) { msg.style.color = '#e05050'; msg.textContent = '⚠ Note entre 0 et 10.'; return; }

  /* Trouver le groupe (poste) depuis le poste sélectionné */
  var posObj = REC_POSTES.find(function (p) { return p.id === curRecPos; });
  var grMap = { GK: 'GK', RB: 'DF', CB: 'DF', LB: 'DF', MF: 'MF', FW: 'FW' };

  userRecrues.push({
    n: name, club: club, age: age, mv: mv,
    p: curRecPos, gr: grMap[curRecPos] || 'FW', posId: curRecPos,
    mp: mp, g: g, a: a, xg: xg, min: min, note: note,
    tck: tck, int: int2, kp: kp,
    col: '#8e44ad', ph: null,
    cv: g && min > 0 ? +(g / (min / 90 / 100)).toFixed(1) : 0,
    drb: 0, pressing: 0, touchesBall: min ? Math.round(min / 15) : 0,
    courPasse: 0, longuePasse: 0, rec: 0, aerienG: 0, aerienP: 0, bl: 0, cl: 0, du: 50,
    nat: '—', tir: Math.round(xg * 10), st: Math.round(mp * 0.8)
  });

  /* Vider le formulaire */
  ['recName', 'recClub', 'recAge', 'recMV', 'rMP', 'rG', 'rA', 'rXG', 'rMin', 'rNote', 'rTck', 'rInt', 'rKP'].forEach(function (id) {
    document.getElementById(id).value = '';
  });

  msg.style.color = '#5ec42a';
  msg.textContent = '✓ ' + name + ' ajouté comme cible !';
  setTimeout(function () { msg.textContent = ''; }, 3000);

  // màj comparaison
  doRec();
  fillCmpS2();
}

function removeRecrue(posId, idx) {
  userRecrues = userRecrues.filter(function (r, i) { return !(r.posId === posId && i === idx); });
  doRec();
  fillCmpS2();
}


// joueurs en prêt
// affiche les cartes des joueurs en prêt

function doPrets() {
  var grid = document.getElementById('loanGrid');
  grid.innerHTML = '';
  PRETS.forEach(function (p) {
    var card = document.createElement('div');
    card.className = 'loan-out-card';
    var noteColor = nT(p.note_loan);
    card.innerHTML =
      '<div style="width:44px;height:44px;border-radius:50%;background:' + p.col + ';display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;">' + ini(p.n) + '</div>' +
      '<div class="loan-out-info">' +
      '<div class="loan-out-name">' + p.n + '</div>' +
      '<div class="loan-out-club">' + p.loanTo + '</div>' +
      '<div style="margin-top:4px;">' +
      '<span class="loan-out-stat">Note: <b style="color:' + noteColor + '">' + p.note_loan.toFixed(2) + '</b></span>' +
      '<span class="loan-out-stat">' + p.mp_loan + ' matchs</span>' +
      (p.g_loan > 0 ? '<span class="loan-out-stat">' + p.g_loan + '⚽</span>' : '') +
      (p.a_loan > 0 ? '<span class="loan-out-stat">' + p.a_loan + '🎯</span>' : '') +
      '<span class="loan-out-stat">Retour: ' + p.returns + '</span>' +
      '</div>' +
      '<div style="margin-top:6px;font-size:9px;color:var(--t2);">' + p.info + '</div>' +
      '<div style="margin-top:4px;font-size:9px;font-style:italic;color:var(--t3);"> ' + p.note_barça + '</div>' +
      '</div>';
    grid.appendChild(card);
  });
}


// navigation globale + jumpTo
// navigue vers la fiche d'un joueur depuis n'importe quel onglet

function jumpTo(pname) {
  var idx = -1;
  for (var i = 0; i < SQUAD.length; i++) { if (SQUAD[i].n === pname) { idx = i; break; } }
  if (idx < 0) return;
  document.querySelectorAll('.tab')[0].click();
  setTimeout(function () { pickPlayer(idx); }, 40);
}

//      fonctions mercato
// point d'entrée du simulateur mercato

function doMercato() {
  buildMercatoFormBtns();
  renderMercatoPanel();
  initMercatoXI(mercatoFormKey);
  renderMercatoPitch();
}

function buildMercatoFormBtns() {
  var sel = document.getElementById('mercatoFormSelect');
  if (!sel) return;
  sel.innerHTML = '';
  Object.keys(FORMS).forEach(function(fk) {
    var opt = document.createElement('option');
    opt.value = fk;
    opt.textContent = fk;
    if (fk === mercatoFormKey) opt.selected = true;
    sel.appendChild(opt);
  });
}

function onMercatoFormChange(key) {
  mercatoFormKey = key;
  initMercatoXI(key);
  renderMercatoPitch();
}

function renderMercatoPanel() {
  renderMercatoSquadList();
  renderMercatoRecruesList();
  updateMercatoBudget();
}

function renderMercatoSquadList() {
  var el = document.getElementById('mercatoSquadList');
  if (!el) return;
  el.innerHTML = '';
  var grps = { GK: [], DF: [], MF: [], FW: [] };
  var grpLabels = { GK: 'Gardiens', DF: 'Défenseurs', MF: 'Milieux', FW: 'Attaquants' };
  SQUAD.forEach(function(p) { (grps[p.gr] || grps.MF).push(p); });
  ['GK','DF','MF','FW'].forEach(function(gr) {
    if (!grps[gr].length) return;
    var hd = document.createElement('div');
    hd.className = 'merc-group-hd';
    hd.textContent = grpLabels[gr];
    el.appendChild(hd);
    grps[gr].forEach(function(p) {
      var sold = !!mercatoVendus[p.n];
      var d = document.createElement('div');
      d.className = 'merc-player-row' + (sold ? ' merc-sold' : '');
      var av = document.createElement('div');
      av.className = 'merc-avatar';
      av.style.background = sold ? '#444' : p.col;
      var img = document.createElement('img');
      var url = (p.ph && p.ph.indexOf('http') === 0) ? p.ph : (window.PHOTOS||{})[p.ph];
      if (url) { img.src = url; img.onerror = function() { av.textContent = ini(p.n); img.remove(); }; av.appendChild(img); }
      else { av.textContent = ini(p.n); }
      d.appendChild(av);
      var info = document.createElement('div');
      info.className = 'merc-player-info';
      var nameEl = document.createElement('div');
      nameEl.className = 'merc-player-name' + (sold ? ' merc-strike' : '');
      nameEl.textContent = p.n + (p.loan ? ' (Prêt)' : '');
      var subEl = document.createElement('div');
      subEl.className = 'merc-player-sub';
      subEl.textContent = p.mv + ' · ' + p.p;
      info.appendChild(nameEl); info.appendChild(subEl);
      d.appendChild(info);
      var nb = document.createElement('span');
      nb.className = 'merc-note-badge';
      nb.style.background = nB(p.note);
      nb.style.color = nT(p.note);
      nb.textContent = p.note.toFixed(1);
      d.appendChild(nb);
      var btn = document.createElement('button');
      btn.className = sold ? 'merc-btn merc-btn-cancel' : 'merc-btn merc-btn-sell';
      btn.title = sold ? 'Annuler la vente' : 'Mettre en vente';
      btn.textContent = sold ? '↩' : '💸';
      btn.onclick = (function(player, wasold) {
        return function() {
          if (wasold || mercatoVendus[player.n]) { delete mercatoVendus[player.n]; }
          else { mercatoVendus[player.n] = player; }
          renderMercatoPanel();
          renderMercatoPitch();
        };
      })(p, sold);
      d.appendChild(btn);
      el.appendChild(d);
    });
  });
}

function renderMercatoRecruesList() {
  var el = document.getElementById('mercatoRecruesList');
  if (!el) return;
  el.innerHTML = '';

  var hd1 = document.createElement('div');
  hd1.className = 'merc-group-hd merc-group-red';
  hd1.textContent = 'Analyse Cibles';
  el.appendChild(hd1);

  RECRUES_PREDEFINIES.forEach(function(p) {
    var bought = !!mercatoAchetes[p.n];
    var d = document.createElement('div');
    d.className = 'merc-player-row' + (bought ? ' merc-bought' : '');
    var av = document.createElement('div');
    av.className = 'merc-avatar';
    av.style.background = bought ? '#27ae60' : p.col;
    var recUrl = (p.ph && p.ph.indexOf && p.ph.indexOf('http') === 0) ? p.ph : (PHOTOS[p.ph] || PHOTOS[p.n] || null);
    if (recUrl) {
      var recImg = document.createElement('img');
      recImg.src = recUrl;
      recImg.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;';
      recImg.onerror = function() { av.textContent = ini(p.n); recImg.remove(); };
      av.appendChild(recImg);
    } else { av.textContent = ini(p.n); }
    d.appendChild(av);
    var info = document.createElement('div');
    info.className = 'merc-player-info';
    var nameEl = document.createElement('div');
    nameEl.className = 'merc-player-name';
    nameEl.textContent = p.n;
    var subEl = document.createElement('div');
    subEl.className = 'merc-player-sub';
    subEl.textContent = (p.club||'?') + ' · ' + p.mv + ' · ' + p.p;
    info.appendChild(nameEl); info.appendChild(subEl);
    d.appendChild(info);
    var nb = document.createElement('span');
    nb.className = 'merc-note-badge';
    nb.style.background = nB(p.note||6.5);
    nb.style.color = nT(p.note||6.5);
    nb.textContent = (p.note||'?');
    d.appendChild(nb);
    var btn = document.createElement('button');
    btn.className = bought ? 'merc-btn merc-btn-cancel' : 'merc-btn merc-btn-buy';
    btn.textContent = bought ? '↩' : '✅ Acheter';
    btn.onclick = (function(player, wasbought) {
      return function() {
        if (wasbought || mercatoAchetes[player.n]) { delete mercatoAchetes[player.n]; }
        else { mercatoAchetes[player.n] = player; }
        renderMercatoPanel();
        renderMercatoPitch();
      };
    })(p, bought);
    d.appendChild(btn);
    el.appendChild(d);
  });

  var hd2 = document.createElement('div');
  hd2.className = 'merc-group-hd merc-group-blue';
  hd2.textContent = '🔄 Prêtés - Rappeler';
  el.appendChild(hd2);

  PRETS.forEach(function(p) {
    if (p.returns === 'Vendu') return;
    var recalled = !!mercatoRappeles[p.n];
    var d = document.createElement('div');
    d.className = 'merc-player-row' + (recalled ? ' merc-bought' : '');
    var av = document.createElement('div');
    av.className = 'merc-avatar';
    av.style.background = recalled ? '#27ae60' : p.col;
    var pretUrl = PHOTOS[p.n] || null;
    if (pretUrl) {
      var pretImg = document.createElement('img');
      pretImg.src = pretUrl;
      pretImg.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;';
      pretImg.onerror = function() { av.textContent = ini(p.n); pretImg.remove(); };
      av.appendChild(pretImg);
    } else { av.textContent = ini(p.n); }
    d.appendChild(av);
    var info = document.createElement('div');
    info.className = 'merc-player-info';
    var nameEl = document.createElement('div');
    nameEl.className = 'merc-player-name';
    nameEl.textContent = p.n;
    var subEl = document.createElement('div');
    subEl.className = 'merc-player-sub';
    subEl.textContent = p.loanTo + ' · ' + (p.g_loan||0) + 'G/' + (p.a_loan||0) + 'A';
    info.appendChild(nameEl); info.appendChild(subEl);
    d.appendChild(info);
    var nb = document.createElement('span');
    nb.className = 'merc-note-badge';
    nb.style.background = nB(p.note_loan||6.5);
    nb.style.color = nT(p.note_loan||6.5);
    nb.textContent = (p.note_loan||'?').toFixed ? (p.note_loan||6.5).toFixed(1) : (p.note_loan||'?');
    d.appendChild(nb);
    var btn = document.createElement('button');
    btn.className = recalled ? 'merc-btn merc-btn-cancel' : 'merc-btn merc-btn-recall';
    btn.textContent = recalled ? '↩' : '⬅ Rappeler';
    btn.onclick = (function(player, wasRecalled) {
      return function() {
        if (wasRecalled || mercatoRappeles[player.n]) { delete mercatoRappeles[player.n]; }
        else { mercatoRappeles[player.n] = player; }
        renderMercatoPanel();
        renderMercatoPitch();
      };
    })(p, recalled);
    d.appendChild(btn);
    el.appendChild(d);
  });
}

function updateMercatoBudget() {
  var b = mercatoBudget();
  var el = document.getElementById('mercatoBudgetBar');
  if (!el) return;
  var soldCount  = Object.keys(mercatoVendus).length;
  var buyCount   = Object.keys(mercatoAchetes).length;
  var recCount   = Object.keys(mercatoRappeles).length;
  var eff = getMercatoEffectif();
  var avgNote = eff.length ? (eff.reduce(function(s,p){return s+(p.note||6.5);},0)/eff.length).toFixed(2) : '—';
  var items = [
    {cls:'merc-enc', label:'📤 Vendus',   val:soldCount, sub:'+'+b.enc+'M€'},
    {cls:'merc-dep', label:'✅ Achetés',  val:buyCount,  sub:'-'+b.dep+'M€'},
    {cls:'merc-rec', label:'🔄 Rappelés', val:recCount,  sub:''},
    {cls:'merc-sol '+(b.solde>=0?'pos':'neg'), label:'Solde', val:(b.solde>=0?'+':'')+b.solde+'M€', sub:''},
    {cls:'',          label:'👥 Effectif', val:eff.length, sub:''},
    {cls:'',          label:'Note moy.',  val:avgNote,   sub:''},
  ];
  el.innerHTML = items.map(function(item) {
    return '<div class="merc-budget-item ' + item.cls + '"><span>' + item.label + '</span><strong>' + item.val + '</strong>' + (item.sub ? '<span class="merc-val">' + item.sub + '</span>' : '') + '</div>';
  }).join('');
}

function resetMercato() {
  mercatoVendus = {}; mercatoAchetes = {}; mercatoRappeles = {};
  mercatoXI = [];
  doMercato();
}

/* XI Projeté avec le mercato  */

function initMercatoXI(fk) {
  mercatoXI = FORMS[fk].map(function(pos) {
    return { role: pos.role, gr: pos.gr, tx: pos.tx, ty: pos.ty, player: null };
  });
  updateMercatoNote();
}

function updateMercatoNote() {
  var filled = mercatoXI.filter(function(s) { return s.player !== null; });
  var el = document.getElementById('mercatoNote');
  if (!el) return;
  if (!filled.length) { el.textContent = '—'; el.style.color = 'var(--t1)'; return; }
  var avg = (filled.reduce(function(s, sl) { return s + (sl.player.note || 6.5); }, 0) / filled.length).toFixed(2);
  el.textContent = avg + '/10 (' + filled.length + '/11)';
  el.style.color = filled.length === 11 ? '#5ec42a' : 'var(--t1)';
}

function renderMercatoPitch() {
  var svgEl = document.getElementById('svgMercato');
  if (!svgEl) return;
  var nodes = mercatoXI.map(function(slot, idx) {
    if (slot.player) {
      var p = slot.player;
      var isNew = !!p.isRecrue || !!p.isRappele;
      return '<g data-drag-idx="' + idx + '" style="cursor:grab;">' +
        playerNode(p.n, p.col, p.ph, slot.tx, slot.ty, p.note || 6.5, isNew, slot.role) +
        '</g>';
    }
    return '<g data-drag-idx="' + idx + '" onclick="openMercatoPicker(' + idx + ')" style="cursor:pointer;">' +
      '<circle cx="' + slot.tx + '" cy="' + slot.ty + '" r="26" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.3)" stroke-width="2" stroke-dasharray="6,4"/>' +
      '<text x="' + slot.tx + '" y="' + (slot.ty - 4) + '" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="18" font-family="system-ui">+</text>' +
      '<text x="' + slot.tx + '" y="' + (slot.ty + 12) + '" text-anchor="middle" fill="rgba(255,255,255,.3)" font-size="8" font-family="system-ui">' + slot.role + '</text>' +
      '</g>';
  }).join('');
  svgEl.innerHTML = pitchV() + nodes;
  updateMercatoNote();
  updateMercatoBudget();
  makeDraggable(svgEl, mercatoXI, renderMercatoPitch);
}

function createPickerAvatar(p) {
  var wrap = document.createElement('div');
  wrap.style.cssText = 'width:32px;height:32px;border-radius:50%;background:' + p.col + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;overflow:hidden;flex-shrink:0;';
  var url = (p.ph && p.ph.indexOf('http') === 0) ? p.ph : ((window.PHOTOS || {})[p.ph] || null);
  if (url) {
    var img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:top center;';
    img.onerror = function() { wrap.textContent = ini(p.n); img.remove(); };
    wrap.appendChild(img);
  } else {
    wrap.textContent = ini(p.n);
  }
  return wrap;
}

function openMercatoPicker(idx) {
  mercatoPickSlot = idx;
  var slot = mercatoXI[idx];
  document.getElementById('pickerTitle').textContent = 'XI Projeté - Poste : ' + slot.role;
  var squad = getMercatoEffectif();
  var used = {};
  mercatoXI.forEach(function(s, i) { if (s.player && i !== idx) used[s.player.n] = true; });
  var gr = Array.isArray(slot.gr) ? slot.gr : [slot.gr];
  var compat = squad.filter(function(p) {
    return !used[p.n] && gr.some(function(g) { return p.gr === g; });
  }).sort(function(a, b) { return (b.note || 0) - (a.note || 0); });
  var other = squad.filter(function(p) {
    return !used[p.n] && !gr.some(function(g) { return p.gr === g; });
  }).sort(function(a, b) { return (b.note || 0) - (a.note || 0); });

  var listEl = document.getElementById('pickerList');
  listEl.innerHTML = '';

  function addSection(label) {
    var d = document.createElement('div');
    d.className = 'picker-section';
    d.textContent = label;
    listEl.appendChild(d);
  }

  function addPlayerRow(p) {
    var d = document.createElement('div');
    d.className = 'picker-item';
    d.appendChild(createPickerAvatar(p));
    var info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0;';
    var nm = document.createElement('div');
    nm.style.cssText = 'font-size:11px;font-weight:600;';
    nm.textContent = p.n;
    if (p.isRecrue) {
      var tag = document.createElement('span');
      tag.className = 'merc-tag-recrue';
      tag.textContent = 'RECRUE';
      nm.appendChild(tag);
    } else if (p.isRappele) {
      var tag2 = document.createElement('span');
      tag2.className = 'merc-tag-rappel';
      tag2.textContent = 'RAPPELÉ';
      nm.appendChild(tag2);
    }
    var sub = document.createElement('div');
    sub.style.cssText = 'font-size:9px;color:var(--t2);';
    sub.textContent = p.p + ' · ' + (p.club || 'Barça') + ' · ' + (p.g || 0) + 'G ' + (p.a || 0) + 'A';
    info.appendChild(nm);
    info.appendChild(sub);
    d.appendChild(info);
    var nb = document.createElement('span');
    nb.style.cssText = 'font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:' + nB(p.note || 6.5) + ';color:' + nT(p.note || 6.5) + ';';
    nb.textContent = (p.note || '?');
    d.appendChild(nb);
    d.onclick = (function(player) {
      return function() { pickMercatoSlot(player); };
    })(p);
    listEl.appendChild(d);
  }

  addSection('✅ Compatibles (' + slot.role + ')');
  compat.forEach(addPlayerRow);
  if (other.length) {
    addSection('⚠ Autres postes');
    other.forEach(addPlayerRow);
  }
  document.getElementById('pickerOverlay').classList.add('on');
}

function pickMercatoSlot(player) {
  if (mercatoPickSlot < 0) return;
  mercatoXI[mercatoPickSlot].player = player;
  mercatoPickSlot = -1;
  closePicker();
  renderMercatoPitch();
}

function resetMercatoXI() {
  initMercatoXI(mercatoFormKey);
  renderMercatoPitch();
}


//     comparaison entre recrues
// pratique pour comparer deux cibles sur les mêmes stats
var chartRecueCmp = null;
var recuePosFilter = 'ALL';

// point d'entrée de l'onglet 'Analyse des cibles'
function doRecues() {
  var all = RECRUES_PREDEFINIES.concat(userRecrues);

  /* Filtres poste */
  var filEl = document.getElementById('recuePosFil');
  if (filEl) {
    filEl.innerHTML = '';
    ['ALL','GK','DF','MF','FW'].forEach(function(pos) {
      var labels = {ALL:'Tous',GK:'🧤 GK',DF:'🏰 DF',MF:'⚙ MF',FW:'⚡ FW'};
      var btn = document.createElement('button');
      btn.className = 'form-btn' + (recuePosFilter === pos ? ' on' : '');
      btn.textContent = labels[pos];
      btn.style.cssText = 'font-size:9px;padding:3px 8px;';
      btn.onclick = (function(p,b) { return function() {
        recuePosFilter = p;
        document.querySelectorAll('#recuePosFil .form-btn').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
        populateRecueSelects();
        doRecueCmp();
      }; })(pos, btn);
      filEl.appendChild(btn);
    });
  }
  populateRecueSelects();
  doRecueCmp();
}

function populateRecueSelects() {
  var all = RECRUES_PREDEFINIES.concat(userRecrues);
  var filtered = recuePosFilter === 'ALL' ? all : all.filter(function(p){ return p.gr === recuePosFilter; });
  ['recA','recB'].forEach(function(id, idx) {
    var sel = document.getElementById(id); if (!sel) return;
    var cur = sel.value;
    sel.innerHTML = '';
    filtered.forEach(function(p, i) {
      var o = document.createElement('option');
      o.value = i;
      o.textContent = p.n + ' - ' + (p.club||'?') + ' (' + p.p + ')';
      o._player = p;
      sel.appendChild(o);
    });

    /* Sélection par défaut : A=0, B=1 */
    if (filtered.length > idx) sel.selectedIndex = idx;
  });
}

function getRecueFromSel(id) {
  var sel = document.getElementById(id); if (!sel) return null;
  var all = RECRUES_PREDEFINIES.concat(userRecrues);
  var filtered = recuePosFilter === 'ALL' ? all : all.filter(function(p){ return p.gr === recuePosFilter; });
  var idx = parseInt(sel.value, 10);
  return filtered[idx] || null;
}

function doRecueCmp() {
  var pA = getRecueFromSel('recA');
  var pB = getRecueFromSel('recB');
  var cardsEl = document.getElementById('recueCmpCards');
  if (!pA || !pB) { if(cardsEl) cardsEl.innerHTML = '<div style="padding:20px;color:var(--t2);font-size:11px;">Sélectionnez deux cibles à comparer.</div>'; return; }

  /* Radar */
  if (chartRecueCmp) { chartRecueCmp.destroy(); chartRecueCmp = null; }
  var ctx = document.getElementById('cRecueCmp');
  if (ctx) {
    chartRecueCmp = new Chart(ctx.getContext('2d'), {
      type: 'radar',
      data: {
        labels: RLBLS,
        datasets: [
          { label: pA.n, data: rdData(pA), borderColor: '#e05050', backgroundColor: 'rgba(224,80,80,.15)', borderWidth: 2, pointBackgroundColor: '#e05050', pointRadius: 3 },
          { label: pB.n, data: rdData(pB), borderColor: '#5599ee', backgroundColor: 'rgba(85,153,238,.15)', borderWidth: 2, pointBackgroundColor: '#5599ee', pointRadius: 3 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, labels: { color: '#7b8eaa', font: { size: 8 }, boxWidth: 7 } } },
        scales: { r: { min: 0, max: 10, ticks: { display: false }, grid: { color: 'rgba(255,255,255,.06)' }, angleLines: { color: 'rgba(255,255,255,.06)' }, pointLabels: { color: '#7b8eaa', font: { size: 8 } } } }
      }
    });
  }

  /* Cartes de stats comparatives */
  if (!cardsEl) return;
  var cols = { A: '#e05050', B: '#5599ee' };

  function statRow(label, vA, vB, higherBetter) {
    vA = parseFloat(vA)||0; vB = parseFloat(vB)||0;
    var winA = higherBetter ? vA >= vB : vA <= vB;
    var winB = higherBetter ? vB > vA : vB < vA;
    return '<div style="display:grid;grid-template-columns:1fr 80px 1fr;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);gap:6px;">' +
      '<div style="text-align:right;font-size:11px;font-weight:' + (winA?'700':'400') + ';color:' + (winA?cols.A:'var(--t2)') + ';">' + vA + '</div>' +
      '<div style="text-align:center;font-size:8px;color:var(--t3);white-space:nowrap;">' + label + '</div>' +
      '<div style="text-align:left;font-size:11px;font-weight:' + (winB?'700':'400') + ';color:' + (winB?cols.B:'var(--t2)') + ';">' + vB + '</div>' +
    '</div>';
  }

  function mkAvatar(p, col) {
    var url = (p.ph && p.ph.indexOf('http')===0) ? p.ph : (PHOTOS[p.ph]||null);
    if (url) return '<img src="'+url+'" style="width:54px;height:54px;border-radius:50%;object-fit:cover;object-position:top center;border:2px solid '+col+';" onerror="this.style.display=\'none\'">';
    return '<div style="width:54px;height:54px;border-radius:50%;background:'+p.col+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;border:2px solid '+col+';">'+ini(p.n)+'</div>';
  }

  function badge(note) {
    return '<span style="padding:2px 8px;border-radius:8px;font-size:13px;font-weight:800;background:'+nB(note)+';color:'+nT(note)+';">'+note.toFixed(2)+'</span>';
  }

  /*  Sections dynamiques selon le profil de poste  */
  /* Le Barça joue un pressing haut, jeu de position, relance depuis l'arrière,
     dribbles courts, passes entre les lignes, attaquants capables de presser */
  var grA = pA.gr || pA.p, grB = pB.gr || pB.p;
  var gr = grA === grB ? grA : (grA === 'FW' || grB === 'FW' ? 'FW' : grA);

  /* Section toujours présente : Profil général + Valeur */
  var secGen = { title: 'Profil général', rows: [
    ['Matchs joués', pA.mp, pB.mp, true],
    ['Titularisations', pA.st, pB.st, true],
    ['Minutes', pA.min, pB.min, true],
    ['Note moy. saison', pA.note, pB.note, true],
    ['Points/match (PPM)', pA.ppm, pB.ppm, true],
    ['Âge', pA.age, pB.age, false],
    ['Valeur march.', pA.mv||'?', pB.mv||'?', false],
  ]};

  var sections;

  if (gr === 'GK') {

    /* GARDIEN - Ce que cherche le Barça : gardien sweeper, excellent au pied,
       jeu de passes, sorties aériennes, commandement de la défense  */

    sections = [
      secGen,
      { title: 'Arrêts et Sécurité', info: 'Le Barça veut un GK fiable sous pression haute', rows: [
        ['Clean sheets', pA.cs, pB.cs, true],
        ['GA encaissés/90', pA.ga90_gk, pB.ga90_gk, false],     /* moins = mieux */
        ['% arrêts', pA.arrets_pct, pB.arrets_pct, true],
        ['Tirs subis (svs)', pA.sv, pB.sv, true],
        ['Buts encaissés', pA.ga, pB.ga, false],
        ['Fautes commises', pA.fautes, pB.fautes, false],
        ['Cartons jaunes', pA.yc, pB.yc, false],
      ]},
      { title: 'Jeu au pied — Priorité Barça', info: 'Relance propre = critère', rows: [
        ['Passes courtes', pA.courPasse, pB.courPasse, true],
        ['Passes longues', pA.longuePasse, pB.longuePasse, true],
        ['Touches ballon', pA.touchesBall, pB.touchesBall, true],
        ['Pressing déclenché', pA.pressing, pB.pressing, true],
      ]},
    ];

  } else if (gr === 'DF') {

    /* DÉFENSEUR - Ce que cherche le Barça : CB propre dans la relance,
       bon dans le duel aérien, capable de jouer haut, latéraux offensifs
       avec centres + dribbles + pressing */

    var isLat = (pA.p === 'LB' || pA.p === 'RB' || pB.p === 'LB' || pB.p === 'RB');
    sections = [
      secGen,
      { title: 'Duel et Sécurité défensive', info: 'Priorité Barça : être propre, pas seulement physique', rows: [
        ['Tacles réussis', pA.tck, pB.tck, true],
        ['Interceptions', pA.int, pB.int, true],
        ['Dégagements', pA.bl, pB.bl, true],
        ['Duels gagnés %', pA.du, pB.du, true],
        ['Clean sheets', pA.cs, pB.cs, true],
        ['Fautes commises', pA.fautes, pB.fautes, false],
        ['Cartons jaunes', pA.yc, pB.yc, false],
        ['Cartons rouges', pA.rc, pB.rc, false],
      ]},
      { title: 'Relance et Construction - Critère Barça', info: 'Le CB doit initier le jeu depuis derrière', rows: [
        ['Passes courtes', pA.courPasse, pB.courPasse, true],
        ['Passes longues', pA.longuePasse, pB.longuePasse, true],
        ['Touches ballon', pA.touchesBall, pB.touchesBall, true],
        ['Pressing provoqué', pA.pressing, pB.pressing, true],
      ]},
      { title: 'Apport offensif' + (isLat ? ' Latéral Barça = ailier défensif' : ''), info: isLat ? 'Flanc offensif : centres, dribbles, buts sur coup de pied arrêté' : 'Buts sur corner/coup franc, montées ballon', rows: [
        ['Buts', pA.g, pB.g, true],
        ['Passes déc.', pA.a, pB.a, true],
        ['Centres', pA.cl, pB.cl, true],
        ['Dribbles réussis', pA.drb, pB.drb, true],
        ['Passes clés', pA.kp, pB.kp, true],
        ['G+A/90', (pA.b90+pA.pd90).toFixed(2), (pB.b90+pB.pd90).toFixed(2), true],
      ]},
    ];

  } else if (gr === 'MF') {

    /* MILIEU - Ce que cherche le Barça : pressing intense, récupération haute,
       passes entre les lignes, dribbles courts, vision, polyvalence */

    sections = [
      secGen,
      { title: 'Pressing et récupération - ADN Barça', info: 'Milieu Barça = premier défenseur, pressing non-stop', rows: [
        ['Pressing déclenché', pA.pressing, pB.pressing, true],
        ['Tacles', pA.tck, pB.tck, true],
        ['Interceptions', pA.int, pB.int, true],
        ['Duels gagnés %', pA.du, pB.du, true],
        ['Dégagements', pA.bl, pB.bl, true],
        ['Fautes commises', pA.fautes, pB.fautes, false],
        ['Cartons jaunes', pA.yc, pB.yc, false],
      ]},
      { title: 'Création et Technique', info: 'Vision, passes entre lignes, dribbles dans les espaces', rows: [
        ['Passes clés', pA.kp, pB.kp, true],
        ['Passes courtes', pA.courPasse, pB.courPasse, true],
        ['Passes longues', pA.longuePasse, pB.longuePasse, true],
        ['Dribbles réussis', pA.drb, pB.drb, true],
        ['Touches ballon', pA.touchesBall, pB.touchesBall, true],
        ['Centres', pA.cl, pB.cl, true],
      ]},
      { title: 'Impact offensif', info: 'Un milieu Barça doit peser sur le score', rows: [
        ['Buts', pA.g, pB.g, true],
        ['Passes déc.', pA.a, pB.a, true],
        ['xG', pA.xg, pB.xg, true],
        ['G/90', pA.b90, pB.b90, true],
        ['A/90', pA.pd90, pB.pd90, true],
        ['G+A/90', (pA.b90+pA.pd90).toFixed(2), (pB.b90+pB.pd90).toFixed(2), true],
        ['Tirs', pA.tir, pB.tir, true],
      ]},
    ];

  } else {

    /* ATTAQUANT - Ce que cherche le Barça : finisseur clinique,
       pressing haut, dribbles, vitesse d'exécution, travail collectif,
       passes clés, capable de jouer en faux 9 */
       
    sections = [
      secGen,
      { title: 'Efficacité offensive - Priorité absolue', info: 'Barça veut un finisseur : xG élevé, cadrage élite', rows: [
        ['Buts', pA.g, pB.g, true],
        ['xG (attendus)', pA.xg, pB.xg, true],
        ['Tirs', pA.tir, pB.tir, true],
        ['Tirs cadrés', pA.tirs_cadres, pB.tirs_cadres, true],
        ['Cadrage %', pA.cv, pB.cv, true],
        ['G/90', pA.b90, pB.b90, true],
        ['Buts - xG (efficacité)', (pA.g - pA.xg).toFixed(1), (pB.g - pB.xg).toFixed(1), true],
      ]},
      { title: 'Création et Technique', info: 'Capable de créer pour les autres aussi', rows: [
        ['Passes déc.', pA.a, pB.a, true],
        ['Passes clés', pA.kp, pB.kp, true],
        ['A/90', pA.pd90, pB.pd90, true],
        ['Dribbles réussis', pA.drb, pB.drb, true],
        ['Centres', pA.cl, pB.cl, true],
        ['Touches ballon', pA.touchesBall, pB.touchesBall, true],
      ]},
      { title: 'Pressing et Travail défensif', info: 'Pressing haut = obligation au Barça depuis Flick', rows: [
        ['Pressing déclenché', pA.pressing, pB.pressing, true],
        ['Tacles', pA.tck, pB.tck, true],
        ['Interceptions', pA.int, pB.int, true],
        ['Fautes commises', pA.fautes, pB.fautes, false],
        ['Cartons jaunes', pA.yc, pB.yc, false],
        ['Cartons rouges', pA.rc, pB.rc, false],
      ]},
    ];
  }

  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px;padding-bottom:8px;">';

  sections.forEach(function(sec) {
    html += '<div class="card p">';

    /* Titre section et sous-titre Barça */
    html += '<div style="margin-bottom:8px;text-align:center;">';
    html += '<div style="font-size:11px;font-weight:800;color:var(--t1);">' + sec.title + '</div>';
    if (sec.info) html += '<div style="font-size:8px;color:var(--G);margin-top:2px;font-style:italic;">' + sec.info + '</div>';
    html += '</div>';
    
    /* En-tête joueurs */
    html += '<div style="display:grid;grid-template-columns:1fr 80px 1fr;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border);">';
    html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">' + mkAvatar(pA,cols.A) + '<div style="font-size:9px;font-weight:700;color:'+cols.A+';text-align:right;margin-top:2px;">' + pA.n + '</div>' + badge(pA.note) + '</div>';
    html += '<div style="text-align:center;font-size:10px;font-weight:800;color:var(--t3);">vs</div>';
    html += '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:3px;">' + mkAvatar(pB,cols.B) + '<div style="font-size:9px;font-weight:700;color:'+cols.B+';margin-top:2px;">' + pB.n + '</div>' + badge(pB.note) + '</div>';
    html += '</div>';
    sec.rows.forEach(function(r) { html += statRow(r[0],r[1],r[2],r[3]); });
    html += '</div>';
  });

  html += '</div>';
  cardsEl.innerHTML = html;
}


// --- init ---
// tout se lance ici au chargement de la page
// tout se lance ici - j'appelle toutes les fonctions dans le bon ordre

(function init() {
  
  /* Sidebar navigation joueurs */
  buildSidebar();

  /* Sidebar progression */
  buildProgSb();

  /* Boutons formations */
  buildCustBtns();

  /* Composition perso vide */
  initCustomXI(curCustForm);

  // sélecteurs pour la comparaison
  buildSelects();

  /* Rendu initial - fiche du premier joueur */
  pickPlayer(0);

  /* Pré-calculer tous les onglets */
  doRanking();
  doProg(0);
  drawXI();
  doCmp();
  doRec();
  renderStats26();
  doPrets();
  doMercato();
})();

/* Drag et Drop joueurs sur terrain SVG */
function makeDraggable(svgEl, dataArr, renderFn) {
  var drag = null;

  function svgCoords(e) {
    var src = e.touches ? e.touches[0] : e;
    var pt = svgEl.createSVGPoint();
    pt.x = src.clientX;
    pt.y = src.clientY;
    return pt.matrixTransform(svgEl.getScreenCTM().inverse());
  }

  svgEl.querySelectorAll('[data-drag-idx]').forEach(function(g) {
    var idx = parseInt(g.getAttribute('data-drag-idx'), 10);

    function onStart(e) {
      // poste vide, ouvrir picker, pas de drag
      if (!dataArr[idx] || (dataArr[idx].player === null && dataArr[idx].player !== undefined)) return;
      e.stopPropagation();
      var pos = svgCoords(e);
      drag = {
        idx: idx,
        g: g,
        startX: dataArr[idx].tx,
        startY: dataArr[idx].ty,
        mouseX: pos.x,
        mouseY: pos.y,
        moved: false
      };
      g.style.filter = 'drop-shadow(0 0 10px #EDBB00)';
      g.style.opacity = '0.85';
      g.style.transition = 'none';
    }

    g.addEventListener('mousedown', onStart);
    g.addEventListener('touchstart', onStart, { passive: true });
  });

  function onMove(e) {
    if (!drag) return;
    e.preventDefault();
    var pos = svgCoords(e);
    var dx = pos.x - drag.mouseX;
    var dy = pos.y - drag.mouseY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    if (!drag.moved) return;
    var nx = Math.max(26, Math.min(414, drag.startX + dx));
    var ny = Math.max(26, Math.min(594, drag.startY + dy));
    drag.g.setAttribute('transform', 'translate(' + (nx - drag.startX) + ',' + (ny - drag.startY) + ')');
    drag.nx = nx;
    drag.ny = ny;
  }

  function onEnd(e) {
    if (!drag) return;
    if (drag.moved && drag.nx !== undefined) {
      dataArr[drag.idx].tx = Math.round(drag.nx);
      dataArr[drag.idx].ty = Math.round(drag.ny);
      renderFn();
    } else {
      // pas bougé → annuler le style
      drag.g.style.filter = '';
      drag.g.style.opacity = '';
      drag.g.removeAttribute('transform');
    }
    drag = null;
  }

  svgEl.addEventListener('mousemove', onMove);
  svgEl.addEventListener('touchmove', onMove, { passive: false });
  svgEl.addEventListener('mouseup', onEnd);
  svgEl.addEventListener('touchend', onEnd);
  // annuler si on sort du SVG
  svgEl.addEventListener('mouseleave', function() {
    if (drag && drag.moved) onEnd();
    else if (drag) {
      drag.g.style.filter = '';
      drag.g.style.opacity = '';
      drag.g.removeAttribute('transform');
      drag = null;
    }
  });
}
