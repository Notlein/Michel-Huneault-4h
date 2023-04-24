const nombreImages = new Array();

var jsonContenuAViderTest;
var jsonContenuARemplir;
var jsonContenuAVider;
var arraytofill;
var nbit = 1;
var bool;
var nbVariable;

// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));
var idGlobal = 0;
var nomsTableau = ['chien','chat','ours','tigre','toro','falcon','lion'];
var liensTableau = ['adkjfb','chasadt','asd','asd','adf','asd','asfdsf'];

const csvUrl = '/csv/listenoms.csv';
const result = [];

const contenu = document.querySelector('.div_contenu');
contenu.style.zindex = 0;

document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        url: "test_csv_Json.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            jsonContenuAViderTest = response;
            console.log(jsonContenuAViderTest);
        }
    });
    
    
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const csvData = data;
            const lines = csvData.split('\r');
            const headers = lines[0].split(',');
            console.log(csvData);
            for (let i = 1; i < lines.length - 1; i++) {
                const obj = {};
                const currentLine = lines[i].split(',');
                for (let j = 0; j < headers.length; j++) {
                  obj[headers[j]] = currentLine[j];
                }
                jsonContenuAViderTest.push(obj);
            }
            console.log(JSON.stringify(jsonContenuAViderTest, null, 2));
        });
    
    
    
    $.ajax({
        url: "4h.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            jsonContenuARemplir = response;
            console.log(jsonContenuARemplir);
        }
    });
    
    
    $.ajax({
        url: "4h_contenu.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            jsonContenuAVider = response;
            jsonContenuAVider = jsonContenuAViderTest;
            console.log(jsonContenuAVider);
        }
    });
    
})

window.onload = function () { 
    getNbAleatoire();
    
}






function addEl(el, link){
    var obj = {
        "id": idGlobal,
        "nom": el+"",
        "lien": link+""
    }
    
    var x = jsonContenuARemplir['data'];
    x.push(obj);
    idGlobal++;
    console.log(jsonContenuARemplir);
}




var temp = new Array();
var tempSplice;

for (index = 0; index < 6; index++) {
    temp.push(index);
    
}

var nameBool = true;
var compteur = 0;


function getNbAleatoire(){
    console.log("bool " + nameBool);
    if(temp.length == 0){
        console.log('fini');
        nameBool = false;
        return;
    }

    nbVariable = Math.floor(Math.random() * temp.length);
    tempSplice = temp.splice(nbVariable,1);
    
    ajouteGrilleDiv(tempSplice);
    
    
    if (nameBool){
        
    }
}




function joueVid(v){
    v.play();
    v.loop = true;
}

function arretVid(v){
    v.pause()
}

var compteur2 = 1;

function ajouteGrilleDiv(value) {
    console.log(value);
    var image = document.createElement("div");
    let contenu = document.querySelector('.grille_video');
    
    let video = document.createElement("video");
    
    let contenuGrille = document.querySelectorAll('.div_video'); 
    console.log(contenuGrille);
    let videoSelectionne;
    video.src = jsonContenuAVider[value]['thumb'];
    
    image.classList.add("div_video"); 
    contenu.appendChild(image);
    if (nameBool) {
        getNbAleatoire();
    }
    image.setAttribute("src",jsonContenuAVider[value]['thumb']);

    image.appendChild(video);
    

    /**
     * function: Joue un petit video quand la souri survol le thumbnail
     * input: 
     * output:
     * 
     */
    
    contenuGrille.forEach(e => {
        e.addEventListener('mouseenter', function (event) { 
            videoSelectionne = event.target.querySelector('video');
            console.log(contenuGrille.length);
            joueVid(videoSelectionne);
        });
        e.addEventListener('mouseleave', function (event) { 
            videoSelectionne = event.target.querySelector('video');
            arretVid(videoSelectionne);
        });
    })  

    getName(contenuGrille);
}





function getName(name) {
    name.forEach(e => {
        e.addEventListener('click', function () { 
            compteur++
            console.log("compteur " + compteur);
            if (compteur == 1) {
                console.log(e.getAttribute("src").replace("/thumvideos", ""));
                ajouteVideoSelectionne(e.getAttribute("src").replace("/thumvideos", ""));
            }
            else if(compteur == 6) {
                compteur = 0;
            }

        });
    })
}

function ajouteVideoSelectionne(lien) {
    
    bool = true;
    contenu.style.zIndex = 1;

    let intDiv = document.querySelectorAll('.div_images').length;
    let div_video = document.createElement("div");
    let video = document.createElement("video");
    video.controls = true;
    console.log('PING');
    
    
    if ((jsonContenuAVider.length >= 0) && (jsonContenuAVider.length != 0)){


        

        div_video.classList.add("div_images"); 

        document.querySelector('.div_contenu').appendChild(div_video);
        
        //Ajoute video
        
        video.src = lien;

        div_video.appendChild(video);

        video.play();

        if(intDiv > 1){
            console.log("Div " + document.querySelectorAll('.div_images')[0]);
            document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]);
        }


        retireInfoArray(nbaleatoire);
    }
    else{

        
        if(intDiv > 1){
            console.log("Div " + document.querySelectorAll('.div_images')[0]);
            document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]);
        }

        for (let index = 0; index < 6; index++) {

           
            if (jsonContenuARemplir['data'].length <= index){
                console.log("index " + index);
                retourneEl(jsonContenuARemplir['data'][index]['nom'], jsonContenuARemplir['data'][index]['lien']);

            }
            else{
                console.log('DONE');
                retireInfoArraytofill(0);
            }
            
            
        }

    }



}

function ajouteImages() {
    

    bool = true;
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

        if(intDiv > 1){ 
            console.log("Div " + document.querySelectorAll('.div_images')[0]);
            // document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]);
        }


        retireInfoArray(nbaleatoire);
        console.log("rng " + nbaleatoire);
        console.log("rng " + nbaleatoire);
    }
    else{

        
        if(intDiv > 1){
            console.log("Div " + document.querySelectorAll('.div_images')[0]);
            //document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]);
        }

        for (let index = 0; index < 6; index++) {

           
            if (jsonContenuARemplir['data'].length <= index){
                console.log("index " + index);
                retourneEl(jsonContenuARemplir['data'][index]['nom'], jsonContenuARemplir['data'][index]['lien']);

            }
            else{
                console.log('DONE');
                retireInfoArraytofill(0);
            }
            
            
        }
        

    }

    


}


function retireInfoArray(NbEnvlever) {  
    console.log("removed");
    jsonContenuAViderTest.splice(NbEnvlever, 1);    
}

function retireInfoArraytofill(NbEnvlever) {  
    console.log("removed");
    jsonContenuARemplir.splice(NbEnvlever, 6);
}

function retireInfoNbArray(NbEnvlever) {  
    console.log("removed");
    jsonContenuARemplir.splice(NbEnvlever, 6);
}

function nbRandomizer(RandomInt) { 
    var nbaleatoire = Math.floor(Math.random() * RandomInt);
    return nbaleatoire;
}






window.addEventListener('scroll', () => {
    
    
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if ((bool == true) && (Math.ceil(scrolled) >= (scrollMax - 10))){
        ajouteImages();
    }

});
