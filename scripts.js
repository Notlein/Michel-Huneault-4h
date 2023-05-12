var videos = [];

// CONSTANTS
const contenu = document.querySelector('.grille_video');
const CLIENT_ID = "customer-k63l0cdanueosauc";


/**
 * Brasse la liste
 * 
 * @param {Array} vids - La liste à brasser
 * @returns - La liste brassée
 */
function brasseListe(vids) {
    newVids=vids;
    let x = newVids.length;
    for (i = x - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i);
        k = newVids[i];
        newVids[i] = newVids[j];
        newVids[j] = k;
    }
    return newVids;
}

// AJAX call on content load
document.addEventListener("DOMContentLoaded", async function () {
    let _token;
    let _email;
    let _accountID;
    //fetch infos
    await $.ajax({
        url: "_/cf.txt",
        data: "data",
        dataType:"json",
        success: function (response) {
            _email = response["email"];
            _token = response["token"];
            _accountID = response["account"];
        }
    });


    // APPEL API Cloudflare
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': _email,
            'Authorization': "Bearer " + _token
        }
    };
    await fetch('https://api.cloudflare.com/client/v4/accounts/' + _accountID + '/stream', options)
        .then(response => response.json())
        .then(response => {
            const res = response['result'];
            console.log(response);
            for (let i = 0; i < res.length; i++) {
                if(res[i]['readyToStream'])
                    videos.push(res[i]['uid'])
            }
            videos = brasseListe(videos);
            _token = "";
            _email = "";
            _accountID = "";
        })
        .catch(err => console.error(err));

        const NB_VIDEOS_LOADED = 24;
        //initialisation des 24 premieres videos
        for (let index = 0; index < NB_VIDEOS_LOADED; index++) {
            ajouteGrilleDiv(index);
    }
});


/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
async function ajouteGrilleDiv(id) {

    let wrapper = document.createElement("div");
    let video = document.createElement("video-js");
    let source = document.createElement('source');

    source.src = "https://" +
        CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8"
        /**
         * @todo
         * Ideally remove for variable bandwidth
         */
        +
        "?clientBandwidthHint='10.0'";
    source.type = "application/x-mpegURL"
    video.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
    video.id = "vid-"+(id+1);
    wrapper.name = "name-"+(id+1);
    wrapper.id = "wrap-"+(id+1);
    wrapper.classList.add("div_video");

    contenu.appendChild(wrapper);
    wrapper.appendChild(video);
    video.appendChild(source);

    let player = videojs(document.getElementById(video.id));

    wrapper.addEventListener('mouseenter', function () {
        player.play()
    });
    wrapper.addEventListener('mouseleave', function () {
        player.pause()
    });

    wrapper.addEventListener("click", function () {
        let fs_contenu = document.querySelector('.div_contenu');
        fs_contenu.style.zIndex = 3;
        let fullScreenDiv = document.createElement("div");
        let fsvideo = document.createElement("video-js");
        let btnExit = document.createElement("button");
        let btnNext = document.createElement("button");
        let icon = document.createElement('i');

   
        let VIDEO_ID = videos[id];

        source.src = "https://"
            +CLIENT_ID+".cloudflarestream.com/"+VIDEO_ID+"/manifest/video.m3u8"
            +"?clientBandwidthHint='10.0'";
        source.type = "application/x-mpegURL"
        
        

        
        fsvideo.id = "vid-"+(id+1);
        fsvideo.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
        // fsvideo.controls = true;

        fullScreenDiv.name = (id+1);
        fullScreenDiv.id = "fsdiv-"+(id+1);
        fullScreenDiv.classList.add("div_fsvideo");

        fullScreenDiv.appendChild(fsvideo);
        fullScreenDiv.appendChild(btnExit);
        fullScreenDiv.appendChild(btnNext);
        fs_contenu.appendChild(fullScreenDiv);
        fsvideo.appendChild(source);

        let fs_player = videojs(document.getElementById(fsvideo.id));
        fs_player.play();

        btnExit.innerHTML = "exit";
        btnExit.style.zIndex = 4;
        btnExit.style.position = 'relative';
        btnExit.addEventListener("click", function () {
            fs_contenu.removeChild(fullScreenDiv);
            fs_contenu.style.zIndex = 0;
        });

        btnNext.innerHTML = "next";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.addEventListener("click", function () {
            fs_contenu.removeChild(fullScreenDiv);
            fs_contenu.style.zIndex = 0;
        });
    });
}

var x = 24; // iterateur - nombre de cases à afficher
var y = 1; // multiplicateur pour section de l'array
// let y = n
// ==> n=1 -> [0,23]
// ==> n=2 -> [24,47]
// ==> ... -> [24(n-1),24(n)-1]
// let x=k -> [k(n-1),k(n)-1]
// Donc -> [k(n-1),k(n)[ -> for(i=x*(y-1);i<x*y;i++)

var x = 24; // iterateur
var y = 2; // multiplicateur

/*window.onload = function () { 
    for (let index = 0; index < json.length; index++) {
        ajouteGrilleDiv(index);
    }
}*/


// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    


    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if ((Math.ceil(scrolled) >= (scrollMax - 10))) {
        let z = videos.length;
        for (let i = x * (y - 1); i < x * y; i++) {
            if(i < z){
                ajouteGrilleDiv(i)
            } else {
                break;
            }
               
        }
        //uncomment to progress beyond x
        if(i < z){y++}
        
    }
});