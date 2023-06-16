// CONSTANTS
const LIMITE = 30;
const LANG_DEFAULT = "fr";
// SELECTORS
const contenu = document.querySelector('.grille_video');
const CLIENT_ID = "customer-k63l0cdanueosauc";
const btn_langues = document.querySelector('.btn_langues');
const list_langues = document.querySelector('.list_langues');
const btn_Apropos = document.querySelector('.apropos');
const btn_Apropos_p = document.querySelector('.apropos p');
const btnFr = document.querySelector('.fr p');
const btnEn = document.querySelector('.en p');
const btnEu = document.querySelector('.eu p');
const btnEs = document.querySelector('.es p');

const titre4h = document.querySelector('.titre_4h');
const titre4hHEAD = document.querySelector('title');
const document_element = document.documentElement;

// Variables globales
var videos = [];
var textes = {};
var loaded = false;
var fullScr = false;
var playingFullScreen = false;
var globalID = 0;
var menuOpen = false;
var timer;
var player;
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

// Check if the browser is Chrome on iOS
function isIOSChrome() {
    var userAgent = navigator.userAgent;
    return userAgent.includes('CriOS');
}

// FONCTIONS
function detectTouch() {
    if (is_touch) {
        $(document).ready(function () {
            var startY, startX;
            $(document).on('touchstart', function (e) {
                var touch = e.originalEvent.touches[0];
                startY = touch.pageY;
                startX = touch.pageX;
            });
            $(document).on('touchend', function (e) {
                var touch = e.originalEvent.changedTouches[0];
                var endY = touch.pageY;
                var endX = touch.pageX;

                var deltaY = startY - endY;
                var deltaX = startX - endX;

                var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

                if (distance > 15) {
                    if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX)) {
                        console.log('Bottom to Top touch');
                        nextVideoCustom("y");
                    }

                    if (deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
                        console.log('Right to Left touch');
                        nextVideoCustom("x");
                    }
                } else {
                    triggerControls(document.getElementsByClassName("next")[0]);
                    triggerControls(document.getElementsByClassName("exitfs")[0]);
                }
            });
        });
    }
}

function triggerControls(el) {
    if (el.style.opacity > 0)
        el.style.opacity = 0;
    else
        el.style.opacity = 1;
}

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

function changeLanguage(lg) {
    titre4h.innerHTML = textes[lg]['titre'];
    titre4hHEAD.innerHTML = textes[lg]['titre'];
    btnFr.innerHTML = textes[lg]['btn_fr'];
    btnEn.innerHTML = textes[lg]['btn_en'];
    btnEu.innerHTML = textes[lg]['btn_eu'];
    btnEs.innerHTML = textes[lg]['btn_es'];
    btn_Apropos_p.innerHTML = textes[lg]['apropos'];
    document.querySelectorAll('.contenu_ap p').innerHTML = textes[lg]['p'];
    document.querySelectorAll('.contenu_ap h1').innerHTML = textes[lg]['titre'];
}

function iterateurGrille() {
    for (let index = 0; index < LIMITE; index++) {
        ajouteGrilleDiv(index)
    }
}

async function loadInit() {
    let _token;
    let _email;
    let _accountID;
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
    changeLanguage(localStorage.getItem("lang"));
    loaded = true;
    iterateurGrille();
}

function nextVideoCustom(mode) {



    switch (mode) {
        case ("x"):
            nextVideo();
            break;
        case ("y"):
            globalID++;
            //loop backk to 0 if last video
            if (globalID > videos.length - 1) {
                globalID = 0;
            }
            player.pause()
            $(".exitfs, .next").css("opacity", 0);
            $(".div_contenu").animate({
                "opacity": 1,
                "top": "-100%",
            }, 500, function () {
                player.src("https://" +
                    CLIENT_ID + ".cloudflarestream.com/" + videos[globalID] + "/manifest/video.m3u8");
                player.load()
                player.play();
                $(".div_contenu").css({
                    "top": "0%"
                });

            });
            break;
    }
}

function autohide(btnExit, btnNext) {
    btnExit.style.opacity = 1;
    btnNext.style.opacity = 1;
    $('body').css("cursor", "auto")
    clearTimeout(timer);
    timer = setTimeout(function () {
        btnExit.style.opacity = 0;
        btnNext.style.opacity = 0;
        $('body').css("cursor", "none")
    }, 1500);
}

function nextVideo() {
    globalID++;
    //loop backk to 0 if last video
    if (globalID > videos.length - 1) {
        globalID = 0;
    }
    player.pause()
    $(".exitfs, .next").css("opacity", 0);
    $(".div_contenu").animate({
        "opacity": 1,
        "left": "-100%",
    }, 500, function () {
        player.src("https://" +
            CLIENT_ID + ".cloudflarestream.com/" + videos[globalID] + "/manifest/video.m3u8");
        player.load()
        player.play();
        $(".div_contenu").css({
            "left": "0%"
        });

    });
}

function firstVid() {
    if (!playingFullScreen) {
        detectTouch();
        //$(".exitfs, .next").css("opacity", 1);
        history.pushState(1, "");
        document.addEventListener("keydown", (e) => {
            e = e || window.event;
            if (e.key === "ArrowRight") {
                nextVideo();
            }
        })
    }
}

function animateFS() {
    $("header").fadeOut(1000);
    $(".grille_video").fadeOut(1000, function () {
        $(".grille_video").remove();
    });
    $(".div_contenu").css("z-index", 1);
    $(".div_contenu").animate({
        "opacity": 1
    });
}

function setPlayer() {
    const fs_contenu = document.querySelector('.div_contenu');
    let fullScreenDiv = document.createElement("div");
    let fsvideo = document.createElement("video");
    fsvideo.disablePictureInPicture = false;
    let btnExit = document.createElement("div");
    let btnNext = document.createElement("div");
    let source = document.createElement('source');
    fullScreenDiv.classList.add("div_fsvideo");
    fullScreenDiv.appendChild(fsvideo);
    fullScreenDiv.appendChild(btnExit);
    fullScreenDiv.appendChild(btnNext);
    fs_contenu.appendChild(fullScreenDiv);
    fsvideo.appendChild(source);
    fsvideo.disablePictureInPicture = true;
    fsvideo.style = "border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;";
    btnExit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/></svg>';
    btnExit.classList.add('exitfs');
    btnNext.classList.add('next');
    btnNext.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>';

    return {
        source,
        fsvideo,
        btnExit,
        btnNext
    };
}

function addFs() {

    firstVid();
    animateFS();
    let {
        source,
        fsvideo,
        btnExit,
        btnNext
    } = setPlayer();
    fsvideo.id = "fsvid";
    source.src = "https://" +
        CLIENT_ID + ".cloudflarestream.com/" + videos[globalID] + "/manifest/video.m3u8";
    source.type = "application/x-mpegURL";
    playerStarts(fsvideo, btnExit, btnNext);
    playingFullScreen = true;
    autohide(btnExit, btnNext);
}

function playerStarts(fsvideo, btnExit, btnNext) {
    let fs_player = videojs(document.getElementById(fsvideo.id), {
        muted: false,
        autoplay: true,
        html5: {
            playsinline: true
        },
        controlBar: {
            pictureInPictureToggle: true,
        },
        disablePictureInPicture: true,
        enableDocumentPictureInPicture: false
    });

    fs_player.on('loadeddata', () => {
        fs_player.play();
    });
    fs_player.on('ended', function () {
        nextVideo();
    });
    fs_player.on('canplay', function () {
        fs_player.play();
    });

    
    btnExit.addEventListener("click", function () {
        history.go();
    });
    
    if (is_touch) {
        btnNext.addEventListener("click", nextVideo);
    } else {
        btnNext.addEventListener("click", nextVideo);
        //auto hide
        $(document).mousemove(function () {
            autohide(btnExit, btnNext);
        });
    }
    player = fs_player;
}


function ajouteGrilleDiv(id) {
    let wrapper = document.createElement("div");
    let video = document.createElement("video");
    let source = document.createElement('source');
    source.src = "https://" + CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8";
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
    let player_thumb = videojs(document.getElementById(video.id), {
        controls: false,
        poster: 'https://' + CLIENT_ID + '.cloudflarestream.com/' + videos[id] + '/thumbnails/thumbnail.jpg'
    });
    player_thumb.muted(true);
    // temporary variable for the wrapper selector
    let temp = "#w" + (id + 1);
    //non-touch devices
    if (!is_touch) {
        $(temp).on("click", function () {
            globalID = id;
            addFs()
        });
        wrapper.addEventListener('mouseenter', function () {
            player_thumb.play()
        });
        wrapper.addEventListener('mouseleave', function () {
            player_thumb.pause()
        });
        player_thumb.on('loadeddata', () => {
            player_thumb.play();
            player_thumb.pause();
        });
        // touch devices
    } else {
        let touchStartTime, touchStartX, touchStartY;
        const dragThreshold = 20; // Minimum drag distance in pixels
        const touchDurationThreshold = 100; // Minimum touch duration in milliseconds
        $(temp).on("touchstart", function (event) {
            touchStartTime = Date.now();
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        $(temp).on("touchmove", function (event) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            const deltaX = Math.abs(touchX - touchStartX);
            const deltaY = Math.abs(touchY - touchStartY);
            if (deltaX > dragThreshold || deltaY > dragThreshold) {
                // Drag distance exceeds the threshold, do not trigger the action
                removeTouchListeners();
            }
        });

        $(temp).on("touchend", function () {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            if (touchDuration > touchDurationThreshold) {
                removeTouchListeners();
            } else {
                //openFullscreen()
                $(temp).animate({
                    "scale": 2
                }, 300)
                globalID = id;
                addFs();
            }
        });

        function removeTouchListeners() {
            $(temp).off("touchstart touchmove touchend");
        }

    }

}

//a propos
function a_propos() {
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
    btnExit.innerHTML = "<svg class='xlogo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'/></svg>";
    btnExit.style.zIndex = 4;
    btnExit.style.position = 'absolute';
    btnExit.classList.add('exit');
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
btn_Apropos.addEventListener('click', function () {
    $("header").fadeOut(1000);
    $(".div_contenu").css("z-index", 1);
    $(".div_contenu").stop();
    $(".div_contenu").animate({
        "opacity": 1
    }, 500);
    a_propos();
});



//boutons langues
btn_langues.addEventListener('click', function () {
    if (!menuOpen) {

        list_langues.style.top = '100%';
        list_langues.style.opacity = 1;
    } else {
        list_langues.style.opacity = 0;
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
$("#fs-btn").on("click", function () {
    if (fullScr) {
        $("#fs-btn").attr("src", "./fullscreen.png");
        closeFullscreen();
    } else {
        $("#fs-btn").attr("src", "./fullscreen-exit.png");
        openFullscreen();
    }
    fullScr = !fullScr;
})

window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (!is_touch) {
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

// manipulation d'historique single page pour rafraichir la page sur back et desactiver le forward
var currentStateIndex = history.state ? history.state.index : 0;
window.addEventListener('popstate', function (event) {
    var previousStateIndex = currentStateIndex;
    currentStateIndex = history.state ? history.state.index : 0;
    if (currentStateIndex < previousStateIndex) {
        history.go(0);
    } else {
        history.go(-1);
    }
});

// document.addEventListener('touchmove', function (event) {
//     if (event.scale !== 1) { event.preventDefault(); }
//   }, { passive: false });


//INIT
loadInit();