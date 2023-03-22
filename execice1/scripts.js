const nombre = new Array();
var nbcontenu;

// const compteurs = document.querySelector(".section_compteurs");
//     const compteur = compteurs.querySelectorAll(".div_compteur")
//     const compteur_chiffres = compteurs.querySelectorAll(".div_compteur p");
//     const messagefini = document.querySelector(".fini p");

for (index = 0; index < 36; index++) {
    nombre.push(index);
}

function ajouteNombre() {

    if (nombre.length > 0) {
        iterateNb(nombre, 6);
    } else {
        //messagefini.innerHTML = "C'est fini";
        //compteur.forEach((item)=> item.classList.add("compteur__animation"));
        //$(".div_compteur").addClass("compteur__animation");
        console.log("j'ai détruit ton code");
    }
}

function iterateNb(nombre, valeur) {
    for (let index = 0; index < valeur; index++) {
        // ligne dessous èa déplacer
        // compteur_chiffres[index].innerHTML = nombre[getRandom()];
        nombre.splice(getRandom(), 1);
    }
    return nombre;
}

function getRandom() {
    return Math.floor(Math.random() * nombre.length);
}