const nombreImages = new Array();

var jsonContenuAViderTest;
var jsonContenuARemplir;
var jsonContenuAVider;
var arraytofill;
var nbit = 1;
var bool;

// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));
var idGlobal = 0;
var nomsTableau = ['chien','chat','ours','tigre','toro','falcon','lion'];
var liensTableau = ['adkjfb','chasadt','asd','asd','adf','asd','asfdsf'];

const csvUrl = 'csv/listenoms.csv';
const result = [];




const contenu = document.querySelector('.div_contenu');
contenu.style.display = "none";

ajouteGrille();


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
        jsonContenuAVider.push(jsonContenuAViderTest);
        console.log(jsonContenuAVider);
    }
});







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

function retourneEl(el, link){
    var obj = {
        "id": idGlobal,
        "nom": el+"",
        "lien": link+""
    }
    
    var x = jsonContenuAViderTest;
    x.push(obj);
    idGlobal++;
    console.log(jsonContenuAViderTest);
}

// function get(index){
//     console.log(jsonContenu[index]);
// }
//addEl("bird", "sbnfdia3024975wbesrgv");
 
// function makearray() {
//     fill4h();
// }
function ajouteGrille() {
    
    for (let index = 1; index < 6 + 1; index++) {
        console.log("sdaaf");
        // addEl(jsonContenuAVider[index]['nom'], jsonContenuAVider[index]['lien'])
        ajouteGrilleDiv();
    }
    
}
function ajouteGrilleDiv() {
    var image = document.createElement("div");
    let contenu = document.querySelector('.grille_video');
    image.classList.add("div_video"); 
    contenu.appendChild(image);
    image.innerHTML = jsonContenuAViderTest[0]['nom'];

}




function ajouteImages() {
    
    //let idIteration = 1;
    // let nbit++
    // ajouteGrille(); 
    bool = true;
    contenu.style.display = "block";
    //let nbaleatoire;
    // jsonContenu += idIteration;
    let intDiv = document.querySelectorAll('.div_images').length;
    let image = document.createElement("div");
    let video = document.createElement("video");
    
    video.controls = true;
    // video.width = 320;
    // video.height = 240;
    
    if ((jsonContenuAViderTest.length >= 0) && (jsonContenuAViderTest.length != 0)){
        
        nbaleatoire = Math.floor(Math.random() * jsonContenuAViderTest.length);

        addEl(jsonContenuAViderTest[nbaleatoire]['nom'], jsonContenuAViderTest[nbaleatoire]['lien']);

        image.classList.add("div_images"); 

        console.log("tav " + intDiv);

        document.querySelector('.div_contenu').appendChild(image);

        image.innerHTML = jsonContenuAViderTest[nbaleatoire]['nom'];
        
        //Ajoute video
        
        video.src = jsonContenuAViderTest[nbaleatoire]['lien'];

        image.appendChild(video);

        video.play();

        if(intDiv > 1){
            console.log("Div " + document.querySelectorAll('.div_images')[0]);
            document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[0]);
        }


        retireInfoArray(nbaleatoire);
        console.log("rng " + nbaleatoire);
        console.log("rng " + nbaleatoire);
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
        
        // document.querySelector('.div_contenu').removeChild(document.querySelectorAll('.div_images')[1]);
    }

    
    // console.log(nombreImages.length);

}


function retireInfoArray(NbEnvlever) {  
    console.log("removed");
    jsonContenuAViderTest.splice(NbEnvlever, 1);    
}

function retireInfoArraytofill(NbEnvlever) {  
    console.log("removed");
    jsonContenuARemplir.splice(NbEnvlever, 6);
}

function nbRandomizer(RandomInt) { 
    var nbaleatoire = Math.floor(Math.random() * RandomInt);
    return nbaleatoire;
}


//  function autoplay(){
//     let playVid = document.querySelectorAll("myvid"); 
//     playVid.play();     
//     console.log('sadfdggggrw');                                                                        
//  }




window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if ((bool == true) && (Math.ceil(scrolled) >= (scrollMax - 5))){
        ajouteImages();
    }

})
