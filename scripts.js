var videos = [];
var loaded = false;
// CONSTANTS
const LIMITE = 30;
const contenu = document.querySelector('.grille_video');
const CLIENT_ID = "customer-k63l0cdanueosauc";
const CFdata = null;
const btn_langues = document.querySelector('.btn_langues');
const list_langues = document.querySelector('.list_langues');
const btn_Apropos = document.querySelector('.apropos');

//Langues
var btnFr = document.querySelector('.fr p');
var btnEn = document.querySelector('.en p');
var btnEu = document.querySelector('.eu p');
var btnEs = document.querySelector('.es p');
var btnLangues = document.querySelector('.btn_langues p');
var btnApropos = document.querySelector('.apropos p');
var titre4h = document.querySelector('.titre_4h');
var lg = 'fr';
var languages;

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



function iterateurGrille() { 
    for (let index = 0; index < LIMITE; index++) {
        ajouteGrilleDiv(index);
    }

}

document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        url: "ecrit_apropos/languages.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            languages = response;
            console.log(languages);
        }
    });
});

onload = (event) => {
    btnFr.innerHTML = languages[lg]['btn_fr'];
    btnEn.innerHTML = languages[lg]['btn_en'];
    btnEu.innerHTML = languages[lg]['btn_eu'];
    btnEs.innerHTML = languages[lg]['btn_es'];
    btnLangues.innerHTML = languages[lg]['btn_langues'];
    btnApropos.innerHTML = languages[lg]['apropos'];
    titre4h.innerHTML = languages[lg]['titre'];

};
// AJAX call on content load
async function loadInit () {
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
        loaded = true;
        iterateurGrille();

        
    }


 

/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
function ajouteGrilleDiv(id) {

    let wrapper = document.createElement("div");
    let video = document.createElement("video-js");
    let source = document.createElement('source');

    source.src = "https://" +
        CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8";
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
    player.muted(true);
    wrapper.addEventListener('mouseenter', function () {
        player.play()
    });
    wrapper.addEventListener('mouseleave', function () {
        player.pause()
    });
   
    
    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
    wrapper.addEventListener("click", function addFs() {
        let fs_contenu = document.querySelector('.div_contenu');
        fs_contenu.style.zIndex = 10;
        document.querySelector('section').style.overflow = "hidden";
        let fullScreenDiv = document.createElement("div");
        let fsvideo = document.createElement("video-js");
        let btnExit = document.createElement("button");
        let btnNext = document.createElement("button");
   
        let VIDEO_ID = videos[id];

        source.src = "https://"
            +CLIENT_ID+".cloudflarestream.com/"+VIDEO_ID+"/manifest/video.m3u8";
        source.type = "application/x-mpegURL"
        
        

        
        fsvideo.id = "vid-"+(id+1);
        fsvideo.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";

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

        btnExit.innerHTML = "<svg class='xlogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg>";
        btnExit.style.zIndex = 6;
        btnExit.style.opacity = 0;
        btnExit.style.position = 'absolute';
        btnExit.classList.add('exitfs');
        btnExit.addEventListener("click", function() {
            location.reload();
        });

        btnExit.addEventListener('mouseenter', function () {
            btnExit.style.opacity = 1;
            btnNext.style.opacity = 1;
        })

        btnExit.addEventListener('mouseleave', function () {
            btnExit.style.opacity = 0;
        })

        

        btnNext.innerHTML = "next";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.classList.add('next')
        btnNext.style.opacity = 0;
        btnNext.addEventListener("click", function() {
            nextVideo();
        });

        btnNext.addEventListener("mouseenter", function() {
            btnExit.style.opacity = 1;
            btnNext.style.opacity = 1;
        });

        btnNext.addEventListener('mouseleave', function () {
            btnExit.style.opacity = 0;
            btnNext.style.opacity = 0;
        })

        fs_player.on('ended', function() { 
            nextVideo();
        });
        

        async function nextVideo() {
            fsvideo.id = "vid-"+(id + 1);
            id++;
            addFs();
            fs_player.pause();
            fs_contenu.style.transition = '1s';
            fs_contenu.style.translate = '-50%';
            await sleep(1000);
            removePreviousVideo();

            
        }
    
        function removePreviousVideo(){
            fs_contenu.removeChild(fs_contenu.children[0]);
            fs_contenu.style.transition = '0s';
            fs_contenu.style.translate = '0%';
        }




    });
}

btn_langues.addEventListener('mouseover', function () { 
    list_langues.style.top = '100%';

})

list_langues.addEventListener('mouseover', function () { 
    list_langues.style.top = '100%';

})

list_langues.addEventListener('mouseleave', function () { 
    list_langues.style.top = '-400%';

})

btn_langues.addEventListener('mouseleave', function () { 
    list_langues.style.top = '-400%';
})




btn_Apropos.addEventListener('click', function () {
    let btnExit = document.createElement("button");
    let fs_contenu = document.querySelector('.div_contenu');
    document.querySelector('section').style.overflow = "hidden";

    let contenu_ap = document.createElement('div');
    let contenu_ap_wrapper = document.createElement('div');

    let titre = document.createElement('h1')
    /**
     * Pour crée les quatre paragraphe
     */
    for (let index = 0; index < 4; index++) {
        let div_detail = document.createElement('div');
        let paragrahe = document.createElement('p');
        let sous_titre = document.createElement('h4');
        sous_titre.style.margin = 0;
        div_detail.appendChild(sous_titre);
        div_detail.appendChild(paragrahe);
        sous_titre.innerHTML = languages[lg]['st'+(index + 1)];
        paragrahe.innerHTML = languages[lg]['p'+(index + 1)];
        contenu_ap_wrapper.appendChild(div_detail);
        
    }

    contenu_ap.classList.add('contenu_ap');
    fs_contenu.appendChild(contenu_ap);
    contenu_ap_wrapper.classList.add('contenu_ap_wrapper');
    titre.innerHTML = languages[lg]['apropos'];
    contenu_ap.appendChild(titre);
    contenu_ap.appendChild(contenu_ap_wrapper);
    fs_contenu.appendChild(btnExit);    
    fs_contenu.style.animation = 'anim_ap 1s';
    fs_contenu.style.zIndex = 10;

    btnExit.innerHTML = "<svg class='xlogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg>";
    btnExit.style.zIndex = 4;
    btnExit.style.position = 'absolute';
    btnExit.classList.add('exit');
    btnExit.addEventListener("click", function() {
        fs_contenu.style.animation = 'anim_ap_reverse 1s';
        fs_contenu.addEventListener("animationend", function () { 
            if (event.animationName === 'anim_ap_reverse'){
                console.log("safe");
                $(fs_contenu).empty();
                fs_contenu.style.zIndex = 0;
                document.querySelector('section').style.overflow = "";
            }

        });

    });
})

/**
 * Ajoute un listener au bouton de langues
 */

document.querySelector('.fr').addEventListener('click', function () { 
    console.log('fr');
    lg = 'fr';
    changeLanguage(lg);
})

document.querySelector('.en').addEventListener('click', function () { 
    console.log('en');
    lg = 'en';
    changeLanguage(lg);
})

document.querySelector('.eu').addEventListener('click', function () { 
    console.log('eu');
    lg = 'eu';
    changeLanguage(lg);
})

document.querySelector('.es').addEventListener('click', function () { 
    console.log('es');
    lg = 'es';
    changeLanguage(lg);
})

/**
 * Change la langue du site
 */ 
function changeLanguage(lg){
    titre4h.innerHTML = languages[lg]['titre'];
    btnFr.innerHTML = languages[lg]['btn_fr'];
    btnEn.innerHTML = languages[lg]['btn_en'];
    btnEu.innerHTML = languages[lg]['btn_eu'];
    btnEs.innerHTML = languages[lg]['btn_es'];
    btnLangues.innerHTML = languages[lg]['btn_langues'];
    btnApropos.innerHTML = languages[lg]['apropos'];
    document.querySelectorAll('.contenu_ap p').innerHTML = languages[lg]['p'];
    document.querySelectorAll('.contenu_ap h1').innerHTML = languages[lg]['titre'];
}
// let y = n
// ==> n=1 -> [0,23]
// ==> n=2 -> [LIMITE,47]
// ==> ... -> [LIMITE(n-1),LIMITE(n)-1]
// let x=k -> [k(n-1),k(n)-1]
// Donc -> [k(n-1),k(n)[ -> for(i=x*(y-1);i<x*y;i++)




var x = LIMITE; // iterateur
var y =1; // multiplicateur

loadInit();



// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (loaded && (Math.ceil(scrolled) >= (scrollMax - 10))) {
        y++;
        for (let i = x * (y - 1); i < x * y; i++) {
            
            if(i < videos.length)
                ajouteGrilleDiv(i);
        }
        //uncomment to progress beyond x
         
    }
});

// àa modifier pour jquery

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}