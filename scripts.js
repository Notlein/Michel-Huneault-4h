const nombreImages = new Array();

var jsonContenu;
var nbit = 1;
// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));
var nomsTableau = ['chien','chat','ours','tigre','toro','falcon','lion'];
var liensTableau = ['adkjfb','chat','ours','tigre','toro','falcon','lion'];

$.ajax({
    url: "4h.json",
    data: "data",
    dataType: "json",
    success: function (response) {
        jsonContenu = response;

        console.log(jsonContenu);
    }
});



// for (index = 0; index < 35; index++) {
//     nombreImages.push(index);
//     console.log(index);

// }
function pushObject(el, link) {
    let c = 1;
    let obj = {
        "id": c++,
        "nom": el,
        "lien": link
    } 
    jsonContenu.push(obj);
    
}




function ajouteImages() {
    let idIteration = 1;
    
    // let nbit++
    // let nbAleatoire = Math.floor(Math.random() * jsonContenu.length);
    // jsonContenu[1]['id'] += idIteration;
    const image = document.createElement("div");
    if ((nombreImages.length <= 0)){
        image.classList.add("div_images");
        // document.querySelector('div').a;
        idIteration = jsonContenu.length;
        document.querySelector('.div_contenu').appendChild(image);
        pushObject('bird','ldsaffdsf');
        image.innerHTML = jsonContenu[0]['nom'];
        console.log(jsonContenu);
        //jsonContenu.splice(nbAleatoire, 1);

    }
    else{
        console.log('DONE');
    }

    
    console.log(nombreImages.length);

}

window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (Math.ceil(scrolled) >= (scrollMax - 2)){
        ajouteImages();
    }

})

// function getRandom() {
//     return Math.floor(Math.random() * nombreImages.length);
// }


// for (index = 0; index < 35; index++) {
//     nombreImages.push(index);
//     console.log(index);

// }


// function ajouteImages() {
//     let nbAleatoire = Math.floor(Math.random() * nombreImages.length);
//     if (nombreImages.length > 0){
//         const image = document.createElement("div");
//         image.classList.add("div_images");
//         // document.querySelector('div').a;
//         document.querySelector('.div_contenu').appendChild(image);
//         document.querySelector('.div_contenu')
//         console.log(nombreImages[nbAleatoire]);
//         image.innerHTML = nombreImages[nbAleatoire].toString();
//         nombreImages.splice(nbAleatoire, 1);
//     }
//     else{
//         image.innerHTML = "getRandom().toString()";
//     }

// }