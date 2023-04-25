// Variables
var json;
var arraytofill;

// CONSTANTS
const prefix_thumb = "thumbnail/"; // prefixe pour la video thumb -> std
const vids = "/videos/" //
const csvUrl = './csv/listenoms.csv';
const prefix = vids + prefix_thumb;

/**
 * @todo
 * - Add backend requests for videos (CDN)
 * - Backend-Frontend diagram (Figma ?)
 */

function brasseListe(json){
    for (i = json.length - 2; i > 0; i--) {
        j = Math.floor(Math.random() * i);
        k = json[i]
        json[i] = json[j]
        json[j] = k
    }
    return json;
}

// AJAX call on content load -> JSON - initialisation (vide)
document.addEventListener("DOMContentLoaded", function () {
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

            brasseListe(json);
            // i>1 puisque la ligne 0 ne doit pas être prise en compte
            

        });
});


/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
function ajouteGrilleDiv(id) {

    

    const contenu = document.querySelector('.grille_video');
    let wrapper = document.createElement("div");
    let video = document.createElement("video");
    let link = json[id]['link'];
    let id_vid = json[id]['id'];

    contenu.appendChild(wrapper);
    wrapper.appendChild(video);

    wrapper.name = json[id]['name'];
    wrapper.id = "vid-" + (id + 1);
    wrapper.classList.add("div_video");

    video.src = prefix + json[id]['thumb'];
    video.id = "thumb_v" + id_vid;
    video.loop = true;
    video.muted = true;
    //video.src = link;

    wrapper.addEventListener('mouseenter', function () {
        video.play()
    });
    wrapper.addEventListener('mouseleave', function () {
        video.pause()
    });


    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
}




// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    

    if ((Math.ceil(scrolled) >= (scrollMax - 10))) {
        let x = json.length -1;
        for(let i = 0; i < x; i++)
            ajouteGrilleDiv(i);

        
        // pour ajouter les cases individuellement
    }
});