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

            const regex = /\r*\n/gi; // splitter 
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
                console.log("i " + i);
                // ajouteGrilleDiv(i);
            }
            //custom
            brasseListe(json);
            
        });
});

// window.onload = function (param) { 
//     for (let index = 0; index < json.length; index++) {
//         ajouteGrilleDiv(index);
//     }
// }


/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
async function ajouteGrilleDiv(id) {

    let wrapper = document.createElement("div");
    let video = document.createElement("video-js");
    let source = document.createElement('source');
    const VIDEO_ID = json[id]['link'];

    source.src = "https://"
        +CLIENT_ID+".cloudflarestream.com/"+VIDEO_ID+"/manifest/video.m3u8"
        /**
         * @todo
         * 
         */
        +"?clientBandwidthHint='10.0'";
    source.type = "application/x-mpegURL"
    video.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
    video.id = "vid-"+(json[id]['id']);
    console.log("id " + json[id]['id']);

    wrapper.name = json[id]['name'];
    wrapper.id = "wrap-" + (id + 1);
    wrapper.classList.add("div_video");

    contenu.appendChild(wrapper);
    wrapper.appendChild(video);
    video.appendChild(source);

    let player = videojs(document.getElementById(video.id));
    
    
    // player.play();
    wrapper.addEventListener('mouseenter', function () {
        player.play()
    });
    wrapper.addEventListener('mouseleave', function () {
        player.pause()
    });

    
    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
    wrapper.addEventListener("click", function() {
        let fs_contenu = document.querySelector('.div_contenu');
        fs_contenu.style.zIndex = 3;

        let fullScreenDiv = document.createElement("div");
        let fsvideo = document.createElement("video-js");
        let btnExit = document.createElement("button");
        let btnNext = document.createElement("button");
        
        
        
        
    
        console.log(fullScreenDiv);
    
        fsvideo.id = "vid-"+(json[id]['id']);
        fsvideo.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
        // fsvideo.controls = true;
        console.log("id " + json[id]['id']);
        
        

        fullScreenDiv.name = json[id]['name'];
        fullScreenDiv.id = "wrap-" + (id + 1);
        fullScreenDiv.classList.add("div_fsvideo");
    
        
    
        fullScreenDiv.appendChild(fsvideo);
        fullScreenDiv.appendChild(btnExit);
        fullScreenDiv.appendChild(btnVideo);
        fs_contenu.appendChild(fullScreenDiv);
        fsvideo.appendChild(source);

        let fs_player = videojs(document.getElementById(fsvideo.id));
        fs_player.play();
    
        // btnVideo.innerHTML = "play";
        // btnVideo.style.zIndex = 4;
        // btnVideo.style.position = 'relative';
        // btnVideo.addEventListener("click", function() {
        //     fs_player.play()       
        // });
    
        btnExit.innerHTML = "exit";
        btnExit.style.zIndex = 4;
        btnExit.style.position = 'relative';
        btnExit.addEventListener("click", function() {
            fs_contenu.removeChild(fullScreenDiv);
            fs_contenu.style.zIndex = 0;
        });

        btnNext.innerHTML = "exit";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.addEventListener("click", function() {
            fs_contenu.removeChild(fullScreenDiv);
            fs_contenu.style.zIndex = 0;
        });

    });


}

function fullscreen(param) { 
    
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