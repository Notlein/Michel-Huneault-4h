const nombreImages = new Array();


var jsonContenuARemplir;
var jsonContenuAVider;
var arraytofill;


//var nbVariable;
var idGlobal = 0;


const result = [];
const contenu = document.querySelector('.div_contenu');

contenu.style.zIndex = 1;




/**
 * @todo
 * - finish clearing code
 * - update for fixes
 * - Add backend requests for videos (CDN)
 * - clear JSONs so that there is only one
 * - Backend-Frontend diagram (Figma ?)
 */



// AJAX call on content load -> JSON Contenu à vider - initialisation (vide)
document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        url: "test_csv_Json.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            jsonContenuAVider = response;
        }
    });
    

const csvUrl = '/csv/listenoms.csv';

// AJAX call (fetch) -> csv(id,nom,lien,meta\r) to 
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {

            const csvData = data;
            const lines = csvData.split('\r');
            const headers = lines[0].split(',');

            for (let i = 1; i < lines.length; i++) {

                const obj = {};
                const currentLine = lines[i].split(',');

                for (let j = 0; j < headers.length; j++) {
                  obj[headers[j]] = currentLine[j];
                }

                jsonContenuAVider.push(obj);
            }
        });
    
    
    
    $.ajax({
        url: "4h.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            jsonContenuARemplir = response;
        }
    });
      
    

});





function addEl(el, link){
    var x = jsonContenuARemplir['data'];
    var obj = {
        "id": idGlobal,
        "nom": el+"",
        "lien": link+""
    }
    x.push(obj);
    idGlobal++;
}





/**
 * 
 * 
 * 
 */


// var temp = new Array();
// var tempSplice;

// for (index = 0; index < 6; index++) {
//     temp.push(index);
// }

// var nameBool = true;



// // fonction pour obtenir un nombre aleatoire
// function getNbAleatoire(){

//     if(temp.length == 0){
//         nameBool = false;
//         return;
//     }

//     nbVariable = Math.floor(Math.random() * temp.length);
//     tempSplice = temp.splice(nbVariable,1);

//     if (nameBool){
//         ajouteGrilleDiv(tempSplice);
//     }
// }








// video play
function joueVid(v){
    v.play();
    v.loop = true;
}

//video pause
function arretVid(v){
    v.pause()
}


function ajouteGrilleDiv(value) {

    let image = document.createElement("div");
    let contenu = document.querySelector('.grille_video');
    let video = document.createElement("video");
    const contenuGrille = document.querySelectorAll('.div_video'); 
    let videoSelectionne;
    video.src = jsonContenuAVider[value]['thumb'];
    
    image.classList.add("div_video"); 
    contenu.appendChild(image);

    // Le probleme est ici ! voir la fonction plus haut avec if(temp.length == 0){nameBool = false;return;}

    // if (nameBool) { 
    //     getNbAleatoire();
    // }
    // la partie du code suivante n'executait pas puisqu'il y avait un ''return 
    image.setAttribute("src",jsonContenuAVider[value]['thumb']);
    image.appendChild(video);

    // pour chaque classe div_video
    contenuGrille.forEach(e => {
        // ajoute listener mouse enter -> joue video
        e.addEventListener('mouseenter', function (event) { 
            videoSelectionne = event.target.querySelector('video');
            joueVid(videoSelectionne);
        });
        // ajoute listener mouse leave -> pause video
        e.addEventListener('mouseleave', function (event) { 
            videoSelectionne = event.target.querySelector('video');
            arretVid(videoSelectionne);
        });
    })  


    // ajout des event listener
    getName(contenuGrille);
}









/**
 * pour chaque classe div_video, ajoute un event listener click 
 * 
 */

function getName(name) {

    //let compteur = 0;


    name.forEach(e => {
        e.addEventListener('click', function () { 

            //iterateur compteur dans iterateur foreach -> mauvaise pratique
            // compteur++
            // if (compteur == 1) {



                // retire prefix
                ajouteVideoSelectionne(e.getAttribute("src").replace("/thumvideos", ""));
            
            
            
                // } else if (compteur == 6) {
            //     compteur = 0;
            // }
        });
    })
}



// TO DO Clean here


function ajouteVideoSelectionne(lien) {

    let intDiv = document.querySelectorAll('.div_images').length;
    let div_video = document.createElement("div");
    let video = document.createElement("video");
    video.controls = true;

    if ((jsonContenuAVider.length >= 0) && (jsonContenuAVider.length != 0)){
        div_video.classList.add("div_images"); 
        document.querySelector('.div_contenu').appendChild(div_video);

        //Ajoute video
        video.src = lien;
        div_video.appendChild(video);
        video.play();

        if(intDiv > 1){ document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]) }

    } else{

        if(intDiv > 1){ document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]) }

        for (let index = 0; index < 6; index++) {
            if (jsonContenuARemplir['data'].length <= index){
                retourneEl(jsonContenuARemplir['data'][index]['nom'], jsonContenuARemplir['data'][index]['lien']);
            }else{
                retireInfoArraytofill(0);
            }
        }
    }
}


// TO DO Clean here

function ajouteImages() {
    
    contenu.style.zIndex = 1;

    let intDiv = document.querySelectorAll('.div_images').length;
    let div_video = document.createElement("div");
    let video = document.createElement("video");
    
    video.controls = true;

    if ((jsonContenuAVider.length >= 0) && (jsonContenuAVider.length != 0)){
        
        nbaleatoire = Math.floor(Math.random() * jsonContenuAVider.length);
        addEl(jsonContenuAVider[nbaleatoire]['nom'], jsonContenuAVider[nbaleatoire]['lien']);
        div_video.classList.add("div_images"); 
        document.querySelector('.div_contenu').appendChild(div_video);
        div_video.innerHTML = jsonContenuAVider[nbaleatoire]['nom'];
        
        //Ajoute video
        
        video.src = jsonContenuAVider[nbaleatoire]['lien'];
        div_video.appendChild(video);
        video.play();

    } else {

        for (let index = 0; index < 6; index++) {
            if (jsonContenuARemplir['data'].length <= index){
                retourneEl(jsonContenuARemplir['data'][index]['nom'], jsonContenuARemplir['data'][index]['lien']);
            } else {
                retireInfoArraytofill(0);
            }
        }
    }
}

function retireInfoArraytofill(NbEnvlever) {  
    jsonContenuARemplir.splice(NbEnvlever, 6);
}







// intialisation du nombre aleatoire
window.onload = function () { 
    getNbAleatoire();
}

// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {

    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if ((Math.ceil(scrolled) >= (scrollMax - 10))){
        ajouteImages();
    }

});
