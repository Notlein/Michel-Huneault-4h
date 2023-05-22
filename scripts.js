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
        CLIENT_ID + ".cloudflarestream.com/" + videos[id] + "/manifest/video.m3u8"
        +"?clientBandwidthHint='10.0'";
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
    let counter = 1;
    
    // Dette technique - > nouveau system de player full screen prev play next + link a ajouter
    wrapper.addEventListener("click", function addFs() {
        let fs_contenu = document.querySelector('.div_contenu');
        fs_contenu.style.zIndex = 10;

        let fullScreenDiv = document.createElement("div");
        let fullScreenDiv2 = document.createElement("div");
        let fsvideo = document.createElement("video-js");
        let btnExit = document.createElement("button");
        let btnNext = document.createElement("button");
        let icon = document.createElement('i');

   
        let VIDEO_ID = videos[id];

        source.src = "https://"
            +CLIENT_ID+".cloudflarestream.com/"+VIDEO_ID+"/manifest/video.m3u8"
            //+"?clientBandwidthHint='10.0'";
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
        btnExit.style.position = 'absolute';
        btnExit.addEventListener("click", function() {
            $(fs_contenu).empty();
            fs_contenu.style.zIndex = 0;
            //counter = 0; 
        });

        btnExit.addEventListener('mouseenter', function () {
            btnExit.style.opacity = 1;
            btnNext.style.opacity = 1;
        })

        btnExit.addEventListener('mouseleave', function () {
            btnExit.style.opacity = 0;
        })

        document.addEventListener("keydown", function (event) { 
            if(event.key === 'Escape'){
                location.reload();
            }
        })

        
// verifier le bouton ici
        btnNext.innerHTML = "next";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.classList.add('next')
        btnNext.style.opacity = 0;
        btnNext.addEventListener("click", nextVideo);
        document.addEventListener("keydown", function (event) { 
            if(event.key === 'ArrowRight'){
                console.log('next');
                nextVideo();
            }
        })


        btnNext.addEventListener("mouseenter", function() {
            btnExit.style.opacity = 1;
            btnNext.style.opacity = 1;
        });

        fs_player.on('ended', function() { 
            nextVideo();
        });
        
        // fs_contenu.addEventListener("transitionend", removePreviousVideo);
        async function nextVideo() {
            fsvideo.id = "vid-"+(id + 1);
            //counter = id;
            //counter++;
            //id = counter;

            addFs();
            fs_player.pause();
            fs_contenu.style.transition = '1s';
            fs_contenu.style.translate = '-50%';
            await sleep(1000);
            removePreviousVideo();

            
        }
    
        function removePreviousVideo(){
            
            fs_contenu.removeChild(fs_contenu.children[0]);
            // fs_contenu.children.splice(0, 1);
            fs_contenu.style.transition = '0s';
            fs_contenu.style.translate = '0%';
        }




    });
}

btn_langues.addEventListener('mouseover', function () { 
    list_langues.style.top = '48px';

})

list_langues.addEventListener('mouseover', function () { 
    list_langues.style.top = '48px';

})

list_langues.addEventListener('mouseleave', function () { 
    list_langues.style.top = '-LIMITE6px';

})

btn_langues.addEventListener('mouseleave', function () { 
    list_langues.style.top = '-LIMITE6px';
})

btn_Apropos.addEventListener('click', function () {
    let btnExit = document.createElement("button");
    let fs_contenu = document.querySelector('.div_contenu');
    let contenu_ap = document.createElement('div');
    let contenu_ap_wrapper = document.createElement('div');
    let titre = document.createElement('h1')
    for (let index = 0; index < 4; index++) {
        let div_detail = document.createElement('div');
        let paragrahe = document.createElement('p');
        let sous_titre = document.createElement('h4');
        sous_titre.style.margin = 0;
        div_detail.appendChild(sous_titre);
        div_detail.appendChild(paragrahe);
        
        sous_titre.innerHTML = "Lorem ipsum";
        paragrahe.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "+
        "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, "+
        "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "+
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "+
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        contenu_ap_wrapper.appendChild(div_detail);
        
    }
    contenu_ap.classList.add('contenu_ap')
    fs_contenu.appendChild(contenu_ap);
    contenu_ap_wrapper.classList.add('contenu_ap_wrapper');
    titre.innerHTML = "À propos";
    contenu_ap.appendChild(titre);
    contenu_ap.appendChild(contenu_ap_wrapper);
    fs_contenu.appendChild(btnExit);
    fs_contenu.style.zIndex = 10;

    btnExit.innerHTML = "exit";
    btnExit.style.zIndex = 4;
    btnExit.style.position = 'absolute';
    btnExit.addEventListener("click", function() {
        $(fs_contenu).empty();
        fs_contenu.style.zIndex = 0;
        //counter = 0; 
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