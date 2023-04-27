// Variables
var json = [];

// CONSTANTS
const csvUrl = './csv/listenoms.csv';
const CLIENT_ID = "customer-k63l0cdanueosauc";
const contenu = document.querySelector('.grille_video');

/**
 * Brasse la liste
 * 
 * @param {JSON} json - La liste à brasser
 * @returns - La liste brassée
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
document.addEventListener("DOMContentLoaded", async function () {

    $.ajax({
        url: "4h.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            json = response;
        }
    });

    // AJAX call (fetch) -> csv(id,name,link)
    await fetch(csvUrl)
        .then(response => response.text())
        .then(data => {

            const regex = /\r\n/g; // splitter 
            var csvData = data;
            var lines = csvData.split(regex);
            const headers = lines[0].split(',');
            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const currentLine = lines[i].split(',');
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
                json.push(obj);
            }
            //custom
            brasseListe(json);
            
        });
});


/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
async function ajouteGrilleDiv(id) {

    

    
    let wrapper = document.createElement("div");
    let video = document.createElement("iframe");
    const VIDEO_ID = json[id]['link'];

    video.src = "https://"
        +CLIENT_ID+".cloudflarestream.com/"+VIDEO_ID+"/iframe?"
        +"muted=true"
        +"&preload=true"
        +"&loop=true"
        //+"&autoplay=false"
        +"&controls=false"
        +"&poster=https%3A%2F%2F"+CLIENT_ID+".cloudflarestream.com%2F"+VIDEO_ID+"%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"; // preview
    video.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
    video.allow = "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;";
    video.allowFullscreen = "true";
    video.id = "vid-"+(json[id]['id']);

    wrapper.name = json[id]['name'];
    wrapper.id = "wrap-" + (id + 1);
    wrapper.classList.add("div_video");

    contenu.appendChild(wrapper);
    wrapper.appendChild(video);


    
    // wrapper.addEventListener('mouseenter', function () {
    //     video.play()
    // });
    // wrapper.addEventListener('mouseleave', function () {
    //     video.pause()
    // });

    
    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
}


var x = 24; // iterateur
var y = 1; // multiplicateur


// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    
    if ((Math.ceil(scrolled) >= (scrollMax - 10))) {
        
        for(let i = x * (y-1); i < x * y; i++){
            ajouteGrilleDiv(i)
        }

        
    }
});