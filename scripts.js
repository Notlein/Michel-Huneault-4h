const nombreImages = new Array();

var jsonContenu;
// fetch('4h.json').then(response => response.json()).then(data => console.log(JSON.parse(data['squadName'])));
var idGlobal = 0;


$.ajax({
    url: "4h.json",
    data: "data",
    dataType: "json",
    success: function (response) {
        jsonContenu = response;

        console.log(jsonContenu);
    }
});



function addEl(el, link){
    var obj = {
        "id": idGlobal,
        "nom": el+"",
        "lien": link+""
    }
    
    var x = jsonContenu["data"];
    x.push(obj);
    idGlobal++;
    console.log(jsonContenu);
}

function get(index){
    console.log(jsonContenu[index]);
}
//addEl("bird", "sbnfdia3024975wbesrgv");

function ajouteImages() {
    
    let nbAleatoire = Math.floor(Math.random() * jsonContenu.length);
    const image = document.createElement("div");
    if ((nombreImages.length <= 0) && (jsonContenu[nbAleatoire]['nom'] != NaN)){
        image.classList.add("div_images");
        
        document.querySelector('.div_contenu').appendChild(image);
        image.innerHTML = jsonContenu[nbAleatoire]['nom'];
        
        console.log(jsonContenu);
        

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
