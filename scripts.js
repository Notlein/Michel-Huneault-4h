var videos = [];
var loaded = false;
var fullScr = false;
var is_iOS;
var menuOpen = false;
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
var btnLangues = document.querySelector('.btn_langues div');
var btnApropos = document.querySelector('.apropos p');
var titre4h = document.querySelector('.titre_4h');
var titre4hHEAD = document.querySelector('title');
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

var isIOS = (function () {
    var iosQuirkPresent = function () {
        var audio = new Audio();

        audio.volume = 0.5;
        return audio.volume === 1;   // volume cannot be changed from "1" on iOS 12 and below
    };

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1;   // true for iOS 13 (and hopefully beyond)

    return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
})();

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;
/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}


function changeLanguage(lg){
    titre4h.innerHTML = languages[lg]['titre'];
    btnFr.innerHTML = languages[lg]['btn_fr'];
    btnEn.innerHTML = languages[lg]['btn_en'];
    btnEu.innerHTML = languages[lg]['btn_eu'];
    btnEs.innerHTML = languages[lg]['btn_es'];
    btnApropos.innerHTML = languages[lg]['apropos'];
    document.querySelectorAll('.contenu_ap p').innerHTML = languages[lg]['p'];
    document.querySelectorAll('.contenu_ap h1').innerHTML = languages[lg]['titre'];
}


function iterateurGrille() { 
    for (let index = 0; index < LIMITE; index++) {
        ajouteGrilleDiv(index);
    }

}

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
        
        await $.ajax({
            url: "ecrit_apropos/languages.json",
            data: "data",
            dataType: "json",
            success: function (response) {
                languages = response;
                console.log(languages);
                changeLanguage('fr');
            }
        });

        loaded = true;
        
        
        
            iterateurGrille();
        
        //probleme on call here

    }
    onload = (event) => {
        btnFr.innerHTML = languages[lg]['btn_fr'];
        btnEn.innerHTML = languages[lg]['btn_en'];
        btnEu.innerHTML = languages[lg]['btn_eu'];
        btnEs.innerHTML = languages[lg]['btn_es'];
        btnLangues.innerHTML = "<svg class='lg_logo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z'/></svg>";
        btnApropos.innerHTML = languages[lg]['apropos'];
        titre4h.innerHTML = languages[lg]['titre'];
        titre4hHEAD.innerHTML = languages[lg]['titre_head'];
    
    };

 

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
    if(isIOS){
        player.play();
        
    }
    
    wrapper.addEventListener('mouseenter', function () {
        player.play()
    });
    wrapper.addEventListener('mouseleave', function () {
        player.pause()
    });
   
    document.body.addEventListener('touchstart', function () { console.log("touch"); });
    
    
    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
    wrapper.addEventListener("click", function addFs() {
        document.querySelector(".grille_video").style.display = "none";
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
        source.type = "application/x-mpegURL";
        


     

        
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
        

        fs_player.on('loadeddata', () => {
            console.log('Video has finished loading');
            fs_player.play();
            // Code to run when video has finished loading
        });

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

        // document.addEventListener("keydown", function (event) { 
        //     if(event.key === 'Escape'){
        //         location.reload();
        //     }
        // })

        // document.addEventListener("keydown", function (event) { 
        //     if(event.key === 'ArrowRight'){
        //         console.log('next');
        //         nextVideo();
        //     }
        //     document.removeEventListener("keyup", nextVideo);
        // })

        btnNext.innerHTML = "next";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.classList.add('next')
        btnNext.style.opacity = 0;
        btnNext.addEventListener("click", nextVideo);


        // CANNOT ADD A LISTENER HERE BECAUSE IT WILL BE MULTIPLIED EACH TIME - TO CHANGE


        // document.addEventListener("keydown", function (event) { 
        //     if(event.key === 'ArrowRight'){
        //         console.log('next');
        //         nextVideo();
        //     }
        // })


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


        function nextVideo() {
            fsvideo.id = "vid-"+(id + 1);
            id++;
            addFs();
            fs_player.muted(true);
            fs_contenu.style.transition = '1s';
            fs_contenu.style.translate = '-50%';
            fs_contenu.addEventListener('transitionend', removePreviousVideo);
            
        }


    
        function removePreviousVideo(){
            fs_contenu.removeEventListener('transitionend', removePreviousVideo);
            fs_contenu.removeChild(fs_contenu.children[0]);
            fs_contenu.style.transition = '0s';
            fs_contenu.style.translate = '0%';
            fsvideo.id = "vid-"+(id+1);
            console.log(fsvideo.id);

        }




    });
}

btn_langues.addEventListener('click', function () { 
    if(!menuOpen){
        list_langues.style.top = '100%';
        menuOpen = true;
    } else {
        list_langues.style.top = '-400%';
        menuOpen = false;
    }
})

// list_langues.addEventListener('mouseover', function () { 
//     list_langues.style.top = '100%';
// })

//list_langues.addEventListener('click', function () { 
//    list_langues.style.top = '-400%';
//    menuOpen = false;
//})

// btn_langues.addEventListener('mouseleave', function () { 
//     list_langues.style.top = '-400%';
    
// })


btn_Apropos.addEventListener('click', function () {
    let btnExit = document.createElement("button");
    let fs_contenu = document.querySelector('.div_contenu');
    document.querySelector('section').style.overflow = "hidden";

    let contenu_ap = document.createElement('div');
    let contenu_ap_wrapper = document.createElement('div');

    let titre = document.createElement('h2')
    /**
     * Pour crée les quatre paragraphe
     */
    for (let index = 0; index < 4; index++) {
        let div_detail = document.createElement('div');
        let paragrahe = document.createElement('p');
        let sous_titre = document.createElement('h3');
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
    list_langues.style.top = '-400%';
    lg = 'fr';
    changeLanguage(lg);
})

document.querySelector('.en').addEventListener('click', function () { 
    list_langues.style.top = '-400%';
    lg = 'en';
    changeLanguage(lg);
})

document.querySelector('.eu').addEventListener('click', function () { 
    list_langues.style.top = '-400%';
    lg = 'eu';
    
    changeLanguage(lg);
})

document.querySelector('.es').addEventListener('click', function () { 
    list_langues.style.top = '-400%';
    lg = 'es';
    changeLanguage(lg);
})





/**
 * Change la langue du site
 */ 

// let y = n
// ==> n=1 -> [0,23]
// ==> n=2 -> [LIMITE,47]
// ==> ... -> [LIMITE(n-1),LIMITE(n)-1]
// let x=k -> [k(n-1),k(n)-1]
// Donc -> [k(n-1),k(n)[ -> for(i=x*(y-1);i<x*y;i++)




var x = LIMITE; // iterateur
var y =1; // multiplicateur


$("#fs-btn").attr("src", "./fullscreen.png");
$("#fs-btn").addClass("fs");
$("#fs-btn").bind("click", function(){
    if(fullScr){
        $("#fs-btn").attr("src", "./fullscreen.png");
        closeFullscreen();
    }else{
        $("#fs-btn").attr("src", "./fullscreen-exit.png");
        openFullscreen();
    }
    fullScr = !fullScr;
      
})
loadInit();



// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if(!isIOS){
        if (loaded && (Math.ceil(scrolled) >= (scrollMax - 10))) {
            y++;
            for (let i = x * (y - 1); i < x * y; i++) {
                if(i < videos.length)
                    ajouteGrilleDiv(i);
            }
             
        }
    }
    

});
    
// àa modifier pour jquery

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}