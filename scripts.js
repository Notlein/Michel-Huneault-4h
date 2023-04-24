// Variables
var json; 
var arraytofill;

// CONSTANTS
const nombreImages = new Array();
const result = [];
const contenu = document.querySelector('.div_contenu');
const contenuGrille = document.querySelectorAll('.div_video'); 

const prefix_thumb = "thumbnail/"; // prefixe pour la video thumb -> std
const vids = "/videos/"
const csvUrl = './csv/listenoms.csv';
const prefix = vids + prefix_thumb;

/**
 * @todo
 * - Add backend requests for videos (CDN)
 * - Backend-Frontend diagram (Figma ?)
 */

// AJAX call on content load -> JSON Contenu à vider - initialisation (vide)
// AJAX call on content load -> JSON Contenu à vider - initialisation (vide)
document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        url: "4h.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            json = response;
            
        }
    });
    
// AJAX call (fetch) -> csv(id,name,link,thumb)
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            var csvData = data;
            var lines = csvData.split('\n');
            
            const headers = lines[0].split(',');
            
            for (let i = 1; i < lines.length; i++) {
                
                const obj = {};
                const currentLine = lines[i].split(',');


                for (let j = 0; j < headers.length; j++) {
                  obj[headers[j]] = currentLine[j];
                }
                json.push(obj);
            }
        });
});

function ajouteGrilleDiv(id) {
    const contenu = document.querySelector('.grille_video');
    let wrapper = document.createElement("div");
    contenu.appendChild(wrapper);

    wrapper.name = json[id]['name'];
    wrapper.id = "vid-" +(id + 1);
    wrapper.classList.add("div_video");

    let video = document.createElement("video");
    let link = json[id]['link'];
    let id_vid = json[id]['id'];

    video.src = prefix + json[id]['thumb'];
    video.id = "thumb_v" + id_vid;
    video.loop = true;
    video.muted = true;
    //video.src = link;
    
    wrapper.appendChild(video);
    wrapper.addEventListener('mouseenter', function () {
                video.play();
    });

    // ajoute listener mouse leave -> pause video
    wrapper.addEventListener('mouseleave', function () { 
        video.pause();
    });
}



// TO DO Clean here


// Dette technique - > nouveau system de player prev play next


// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {

    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if ((Math.ceil(scrolled) >= (scrollMax - 10))){
        
            // ajouteGrilleDiv(i);
            // pour ajouter les cases individuellement
    }
});
