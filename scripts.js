const nombreImages = new Array();

var jsonContenuARemplir;
var jsonContenuAVider;
var arraytofill;
var nbit = 1;
// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));
var idGlobal = 0;
var nomsTableau = ['chien','chat','ours','tigre','toro','falcon','lion'];
var liensTableau = ['adkjfb','chasadt','asd','asd','adf','asd','asfdsf'];
// var CSVToJSON = csv => {
//     const lines = csv.split('\n');
//     const keys = lines[0].split(',');
//     return lines.slice(1).map(line => {
//         return line.split(',').reduce((acc, cur, i) => {
//             const toAdd = {};
//             toAdd[keys[i]] = cur;
//             return { ...acc, ...toAdd };
//         }, {});
//     });
// };

//Prendre de csv

// const input = document.querySelector('input');
// const fileReader = new FileReader();
// fileReader.onload = (e) => {

//     console.log("CSVToJSON(e.target.result)");

    
// }



$.ajax({
    url: "4h.json",
    data: "data",
    dataType: "json",
    success: function (response) {
        jsonContenuARemplir = response;

        // console.log(jsonContenu);
    }
});


$.ajax({
    url: "4h_contenu.json",
    data: "data",
    dataType: "json",
    success: function (response) {
        jsonContenuAVider = response;

        console.log(jsonContenuAVider);
    }
});

// const csv = 'id,name\n1,Alice\n2,Bob\n3,Charlie';
// const json = Papa.parse(csv, { header: true }).data;
// console.log(json);




// input.onchange = (e) => {
//   const [file] = e.target.files
//   fileReader.readAsBinaryString(file)
//   console.log(e.target.result)
// }

// function fill4h(){

//     console.log(arraytofill);
// }

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

// function get(index){
//     console.log(jsonContenu[index]);
// }
//addEl("bird", "sbnfdia3024975wbesrgv");

// function makearray() {
//     fill4h();
// }

function ajouteImages() {
    
    //let idIteration = 1;
    // let nbit++

    // jsonContenu += idIteration;
    const image = document.createElement("div");
    if ((jsonContenuAVider.length >= 0) && (jsonContenuAVider.length != 0)){
        nbRandomizer(Math.floor(Math.random() * jsonContenuAVider.length));
        addEl(jsonContenuAVider[nbAleatoire]['nom'], jsonContenuAVider[nbAleatoire]['lien']);
        image.classList.add("div_images");
        document.querySelector('.div_contenu').appendChild(image);
        image.innerHTML = jsonContenuAVider[nbAleatoire]['nom'];
        retireInfoArray();
        // console.log(jsonContenu);
    }
    else{
        console.log('DONE');
    }

    
    // console.log(nombreImages.length);

}

function retireInfoArray() {  
    jsonContenuAVider.splice(nbAleatoire, 1);
}

function nbRandomizer(RandomInt) { 
    nbAleatoire = RandomInt;
 }




window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (Math.ceil(scrolled) >= (scrollMax - 5)){
        ajouteImages();
    }

})
