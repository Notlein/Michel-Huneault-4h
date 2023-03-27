const nombreImages = new Array();

var jsonContenu;
// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));



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


function ajouteImages() {
    
    let nbAleatoire = Math.floor(Math.random() * jsonContenu.length);
    const image = document.createElement("div");
    if ((nombreImages.length <= 0) && (jsonContenu[nbAleatoire]['nom'] != NaN)){
        image.classList.add("div_images");
        // document.querySelector('div').a;
        document.querySelector('.div_contenu').appendChild(image);
        image.innerHTML = jsonContenu[nbAleatoire]['nom'];
        let obj = {
            "id": 4,
            "nom": "bird",
            "lien": "asdasdasd"
        } 
        jsonContenu.push(obj);
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