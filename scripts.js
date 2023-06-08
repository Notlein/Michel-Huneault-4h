// CONSTANTS
const LIMITE = 30;
const LANG_DEFAULT = "fr";
// SELECTORS
const contenu = document.querySelector('.grille_video');
const CLIENT_ID = "customer-k63l0cdanueosauc";
const btn_langues = document.querySelector('.btn_langues');
const list_langues = document.querySelector('.list_langues');
const btn_Apropos = document.querySelector('.apropos');
const btnFr = document.querySelector('.fr p');
const btnEn = document.querySelector('.en p');
const btnEu = document.querySelector('.eu p');
const btnEs = document.querySelector('.es p');
const btnLangues = document.querySelector('.btn_langues div');
const btnApropos = document.querySelector('.apropos p');
const titre4h = document.querySelector('.titre_4h');
const titre4hHEAD = document.querySelector('title');
const document_element = document.documentElement;

// Variables globales
var videos = [];
var textes = {};
var loaded = false;
var fullScr = false;
var playingFullScreen = false;
var is_iOS = false;
var menuOpen = false;

var it = LIMITE; // iterateur initialisé avec LIMITE
var mu = 1; // multiplicateur (default : 1)

// Détection iOS et iPad
var isIPAD = false;
var isIOS = (function () {
    var iosQuirkPresent = function () {
        var audio = new Audio();
        audio.volume = 0.5;
        return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
    };
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    isIPAD = /iPad/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)
    return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
})();

var is_touch = (function is_touch_enabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
})();

// FONCTIONS

/**
 * Brasse la liste
 * @param {Array} vids - La liste à brasser
 * @returns - La liste brassée
 */
function brasseListe(vids) {
    newVids = vids;
    let x = newVids.length;
    for (i = x - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i);
        k = newVids[i];
        newVids[i] = newVids[j];
        newVids[j] = k;
    }
    return newVids;
}

/* View in fullscreen */
function openFullscreen() {
    if (document_element.requestFullscreen) {
        document_element.requestFullscreen();
    } else if (document_element.webkitRequestFullscreen) {
        /* Safari */
        document_element.webkitRequestFullscreen();
    } else if (document_element.msRequestFullscreen) {
        /* IE11 */
        document_element.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
}

//Change language francais-english-euskara-espanol
function changeLanguage(lg) {
    titre4h.innerHTML = textes[lg]['titre'];
    titre4hHEAD.innerHTML = textes[lg]['titre'];
    btnFr.innerHTML = textes[lg]['btn_fr'];
    btnEn.innerHTML = textes[lg]['btn_en'];
    btnEu.innerHTML = textes[lg]['btn_eu'];
    btnEs.innerHTML = textes[lg]['btn_es'];
    btnApropos.innerHTML = textes[lg]['apropos'];
    document.querySelectorAll('.contenu_ap p').innerHTML = textes[lg]['p'];
    document.querySelectorAll('.contenu_ap h1').innerHTML = textes[lg]['titre'];
}

// ajout d'une grille selon la limite
function iterateurGrille() {
    for (let index = 0; index < LIMITE; index++) {
        ajouteGrilleDiv(index)
    }
}

// AJAX call on content load
async function loadInit() {
    let _token;
    let _email;
    let _accountID;
    //fetch infos
    await $.ajax({
        url: "_/cf.txt",
        data: "data",
        dataType: "json",
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
                if (res[i]['readyToStream'])
                    videos.push(res[i]['uid'])
            }
            videos = brasseListe(videos);
            _token = "";
            _email = "";
            _accountID = "";
        })
        .catch(err => console.error(err));
    await $.ajax({
        url: "ecrit_apropos/languages.json",
        data: "data",
        dataType: "json",
        success: function (response) {
            textes = response;

        }
    });
    //sequence de loading
    changeLanguage(localStorage.getItem("lang"));
    loaded = true;
    //ajout de la grille initiale
    iterateurGrille();
}











function addFs(idx) {
    let id = idx;
    //animation okay
    $("header").fadeOut(1000);
    $(".grille_video").fadeOut(1000, function(){$(".grille_video").remove()});
    $(".div_contenu").css("z-index", 1);
    $(".div_contenu").animate({
        "opacity": 1
    });


    // rendre ce contenu dynamique et const
    const fs_contenu = document.querySelector('.div_contenu');
    let fullScreenDiv = document.createElement("div");
    let fsvideo = document.createElement("video");
    let btnExit = document.createElement("button");
    let btnNext = document.createElement("button");
    let source = document.createElement('source');

    // changement de source ici
    source.src = "https://" +
        CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8";
    source.type = "application/x-mpegURL";

    fsvideo.id = "fsvid-" + (id + 1);
    fsvideo.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";

    fullScreenDiv.classList.add("div_fsvideo");

    fullScreenDiv.appendChild(fsvideo);
    fullScreenDiv.appendChild(btnExit);
    fullScreenDiv.appendChild(btnNext);

    fs_contenu.appendChild(fullScreenDiv);

    //parametre ici (source)
    fsvideo.appendChild(source);

    // player ici
    let fs_player = videojs(document.getElementById(fsvideo.id));

    
    
    


    fs_player.on('loadeddata', () => {
        console.log('Video has finished loading');
        fs_player.play();
    });
    fs_player.on('ended', function () {
        nextVideo();
    });

    // sortir cette fonction
    function nextVideo() {
        id++;
        if(id > videos.length -1){
            id = 0;
        }
        fs_player.muted(true);
        $(".exitfs").css("opacity", 0);
        $(".div_contenu").animate({
            "translate": "-100%",
            "opacity": 0
        }, 500, function () {
            addFs(id);
            $(".exitfs").css("opacity", 1);
            $(".div_contenu").css({
                "translate": "0%"
            });
            $(".div_fsvideo:first-child").remove();
        });


    }

    btnExit.innerHTML = "<svg class='xlogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg>";
    btnExit.classList.add('exitfs');
    btnNext.classList.add('next')

    btnExit.addEventListener("click", function () {
        location.reload();
    });

    $(".next,.exitfs").bind("mouseenter", function () {
        btnExit.style.opacity = 1;
        btnNext.style.opacity = 1;
    })
    $(".next,.exitfs").bind("mouseleave", function () {
        btnExit.style.opacity = 0;
        btnNext.style.opacity = 0;
    })

    btnNext.addEventListener("click", nextVideo);
    if (!playingFullScreen) {
        playingFullScreen = true;
        document.addEventListener("keydown", (e) => {
            e = e || window.event;
            if (e.key === "ArrowRight") {
                nextVideo();
            }
        });
    }


    btnNext.addEventListener("mouseenter", function () {
        btnExit.style.opacity = 1;
        btnNext.style.opacity = 1;
    });
    btnNext.addEventListener('mouseleave', function () {
        btnExit.style.opacity = 0;
        btnNext.style.opacity = 0;
    })

    fs_player.autoplay('any');


}





/**
 * Ajoute un élément div>video au contenu ".grille-video"
 * @param {int} id - L'index à ajouter
 */
function ajouteGrilleDiv(id) {

    let wrapper = document.createElement("div");
    let video = document.createElement("video");
    let source = document.createElement('source');

    source.src = "https://" +
        CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8";
    source.type = "application/x-mpegURL"
    video.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
    video.playsinline = true;
    video.id = "vid-" + (id + 1);
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.setAttribute('playsinline', 'playsinline');
    wrapper.classList.add("div_video");
    wrapper.id = "w" + (id + 1);
    contenu.appendChild(wrapper);
    wrapper.appendChild(video);
    video.appendChild(source);

    let player = videojs(document.getElementById(video.id), {
        autoplay: 'muted',
        controls: false
    });
    let temp = "#w" + (id + 1);

    if (!is_touch) {
        $(temp).bind("click", function () {
            addFs(id)
        });
    } else {
        $(temp).bind("mouseenter", function () {
            addFs(id)
        });
        // init for mobiles
        player.play();
        player.pause();
    }

    if (!isIOS) {
        // mouse enter / leave
        wrapper.addEventListener('mouseenter', function () {
            player.play()
        });
        wrapper.addEventListener('mouseleave', function () {
            player.pause()
        });
    }

    player.on('loadeddata', () => {
        player.play();
        player.pause();
    });

    player.muted(true);

    
}


function a_propos() {
    //construction
    let btnExit = document.createElement("button");
    let fs_contenu = document.querySelector('.div_contenu');
    let contenu_ap = document.createElement('div');
    let contenu_ap_wrapper = document.createElement('div');
    let titre = document.createElement('h2')
    for (let index = 1; index < 5; index++) {
        let div_detail = document.createElement('div');
        let paragrahe = document.createElement('p');
        let sous_titre = document.createElement('h3');
        sous_titre.style.margin = 0;
        div_detail.appendChild(sous_titre);
        div_detail.appendChild(paragrahe);
        sous_titre.innerHTML = textes[localStorage.getItem("lang")]['st' + index];
        paragrahe.innerHTML = textes[localStorage.getItem("lang")]['p' + index];
        contenu_ap_wrapper.appendChild(div_detail);
    }
    contenu_ap_wrapper.classList.add('contenu_ap_wrapper');

    titre.innerHTML = textes[localStorage.getItem("lang")]['apropos'];

    fs_contenu.appendChild(contenu_ap);
    fs_contenu.appendChild(btnExit);

    contenu_ap.classList.add('contenu_ap');
    contenu_ap.appendChild(titre);
    contenu_ap.appendChild(contenu_ap_wrapper);

    //bouton exit nested dans a propos
    btnExit.innerHTML = "<svg class='xlogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg>";
    btnExit.style.zIndex = 4;
    btnExit.style.position = 'absolute';
    btnExit.classList.add('exit');
    // bouton 'X' -> animation + fonction empty()
    btnExit.addEventListener("click", function () {
        $("header").fadeIn(1000);
        $(".div_contenu").stop();
        $(".div_contenu").animate({
            "z-index": 0,
            "opacity": 0
        }, {
            easing: 'swing',
            duration: 1000,
            complete: function () {
                $(".div_contenu").empty();
            }
        });
    });
}

// bouton a propos -> animation + fonction
btn_Apropos.addEventListener('click', function () {
    $("header").fadeOut(1000);
    $(".div_contenu").css("z-index", 1);
    $(".div_contenu").stop();
    $(".div_contenu").animate({
        "opacity": 1
    }, 500);
    a_propos();
});

/**
 * Listeners pour les langues
 */
btn_langues.addEventListener('click', function () {
    if (!menuOpen) {
        list_langues.style.top = '100%';
    } else {
        list_langues.style.top = '-400%';
    }
    menuOpen = !menuOpen;
})

document.querySelector('.fr').addEventListener('click', function () {
    list_langues.style.top = '-400%';
    localStorage.setItem("lang", "fr");
    changeLanguage(localStorage.getItem("lang"));
})

document.querySelector('.en').addEventListener('click', function () {
    list_langues.style.top = '-400%';
    localStorage.setItem("lang", "en");
    changeLanguage(localStorage.getItem("lang"));
})

document.querySelector('.eu').addEventListener('click', function () {
    list_langues.style.top = '-400%';
    localStorage.setItem("lang", "eu");
    changeLanguage(localStorage.getItem("lang"));
})

document.querySelector('.es').addEventListener('click', function () {
    list_langues.style.top = '-400%';
    localStorage.setItem("lang", "es");
    changeLanguage(localStorage.getItem("lang"));
})

// Bouton fullscreen
$("#fs-btn").attr("src", "./fullscreen.png");
$("#fs-btn").addClass("fs");
$("#fs-btn").bind("click", function () {
    if (fullScr) {
        $("#fs-btn").attr("src", "./fullscreen.png");
        closeFullscreen();
    } else {
        $("#fs-btn").attr("src", "./fullscreen-exit.png");
        openFullscreen();
    }
    fullScr = !fullScr;
})

// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (!isIOS) {
        if (loaded && (Math.ceil(scrolled) >= (scrollMax - 10))) {
            mu++;
            for (let i = it * (mu - 1); i < it * mu; i++) {
                if (i < videos.length)
                    ajouteGrilleDiv(i);
            }
        }
    }
});

// détection : si aucune langue par defaut (premiere visite), choisir 'fr'
if (localStorage.getItem("lang") === null) {
    localStorage.setItem("lang", LANG_DEFAULT)
}

//INIT
loadInit();