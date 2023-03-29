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


// const nombre = [];
// var nbcompter1;
// var nbcompter2;
// var nbcompter3;
// var nbcompter4;
// var nbcompter5;
// var nbcompter6;
// var index_global = 0;

// for (index = 0; index < 36; index++) {
//     const nbcontenu = nombre.push(index);
// };



// function ajouteNombre(){
//     let compteurs = document.querySelector(".section_compteurs");
//     let compteur = compteurs.querySelectorAll(".div_compteur")
//     let compteur_chiffres = compteurs.querySelectorAll(".div_compteur p");
//     // let compteur1 = document.querySelector(".div_compteur1 p");
//     // let compteur2 = document.querySelector(".div_compteur2 p");
//     // let compteur3 = document.querySelector(".div_compteur3 p");
//     // let compteur4 = document.querySelector(".div_compteur4 p");
//     // let compteur5 = document.querySelector(".div_compteur5 p");
//     // let compteur6 = document.querySelector(".div_compteur6 p");
//     // let compteur = [compteur1, compteur2, compteur3,
//     //     compteur4, compteur5, compteur6];
//     let nbcompter = [nbcompter1, nbcompter2, nbcompter3,
//         nbcompter4, nbcompter5, nbcompter6];
//     let messagefini = document.querySelector(".fini p");
//     let nbaleatoire;
    
//     if(nombre.length > 0){

//         for (let index = 0; index < 6; index++) {
//             nbaleatoire = Math.floor(Math.random() * nombre.length);
//             compteur_chiffres[index].innerHTML = nombre[nbaleatoire];
//             // console.log(nbaleatoire);
//             nbcompter[index] = nombre.splice(nbaleatoire, 1)[0];
//             console.log(nbcompter[index]);
//         }

//         // let nbaleatoire1 = Math.floor(Math.random() * nombre.length);
//         // let nbaleatoire2 = Math.floor(Math.random() * nombre.length);
//         // let nbaleatoire3 = Math.floor(Math.random() * nombre.length);
//         // let nbaleatoire4 = Math.floor(Math.random() * nombre.length);
//         // let nbaleatoire5 = Math.floor(Math.random() * nombre.length);
//         // let nbaleatoire6 = Math.floor(Math.random() * nombre.length);
//         // compteur1.innerHTML = nombre[nbaleatoire];
//         // compteur2.innerHTML = nombre[nbaleatoire];
//         // compteur3.innerHTML = nombre[nbaleatoire];
//         // compteur4.innerHTML = nombre[nbaleatoire];
//         // compteur5.innerHTML = nombre[nbaleatoire];
//         // compteur6.innerHTML = nombre[nbaleatoire];
//         // nbcompter1 = nombre.splice(nbaleatoire, 1);
//         // nbcompter2 = nombre.splice(nbaleatoire, 2);
//         // nbcompter3 = nombre.splice(nbaleatoire, 3);
//         // nbcompter4 = nombre.splice(nbaleatoire, 4);
//         // nbcompter5 = nombre.splice(nbaleatoire, 5);
//         // nbcompter6 = nombre.splice(nbaleatoire, 6);
//     }
//     else{
//         messagefini.innerHTML = "C'est fini";
//         compteur.forEach((item)=> item.classList.add("compteur__animation"));
//         //$(".div_compteur").addClass("compteur__animation");
//     }

// };