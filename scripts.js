var videos = [];

// CONSTANTS
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
            iterateurGrille(24);
        })
        .catch(err => console.error(err));
    
        
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
        btnExit.style.position = 'absolute';
        btnExit.addEventListener("click", function() {
            $(fs_contenu).empty();
            fs_contenu.style.zIndex = 0;
            counter = 0; 
        });

        

        btnNext.innerHTML = "next";
        btnNext.style.zIndex = 4;
        btnNext.style.position = 'relative';
        btnNext.classList.add('next')
        btnNext.addEventListener("click", function() {
            nextVideo();
        });

        fs_player.on('ended', function() { 
            nextVideo();
        });
        
        // fs_contenu.addEventListener("transitionend", removePreviousVideo);
        async function nextVideo() {
            fsvideo.id = "vid-"+(id + 1);
            counter = id;
            counter++;
            id = counter;

            addFs();
            fs_player.pause();
            fs_contenu.style.transition = '1s';
            fs_contenu.style.translate = '-50%';
            await sleep(1000);
            removePreviousVideo();

            
        }
        let counter2 = 0;
        function removePreviousVideo(){
            counter2++;
            console.log(counter2);
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
    list_langues.style.top = '-246px';

})

btn_langues.addEventListener('mouseleave', function () { 
    list_langues.style.top = '-246px';
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
        counter = 0; 
    });
})

// let y = n
// ==> n=1 -> [0,23]
// ==> n=2 -> [24,47]
// ==> ... -> [24(n-1),24(n)-1]
// let x=k -> [k(n-1),k(n)-1]
// Donc -> [k(n-1),k(n)[ -> for(i=x*(y-1);i<x*y;i++)

var x = 24; // iterateur
var y = 1; // multiplicateur

function iterateurGrille(num) { 
    for (let index = 0; index < num; index++) {
        ajouteGrilleDiv(index);
    }
}


// ajoute des cases vidéos lorsque le bas - 10 pixels est atteint
window.addEventListener('scroll', () => {
    
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if ((Math.ceil(scrolled) >= (scrollMax - 10))) {
        console.log("scroll");
        for (let i = x * (y - 1); i < x * y; i++) {
            ajouteGrilleDiv(i)
        }
        //uncomment to progress beyond x
        //y++;
    }
});

// àa modifier pour jquery

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}