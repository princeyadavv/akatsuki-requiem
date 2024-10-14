let url = "/songs";
const albumList = document.querySelector(".albumList");
let songs;
let music = new Audio();
pause = true;
volumebar.value = 50;
music.volume = volumebar.value/100
let albumNames;
let lis;
const ul = document.querySelector(".songlist ul")
const h2 = document.querySelector("h2")
let playbarname = document.getElementById("songname")
playbarname.innerHTML = ''
let songList=[]
let Allsongs=[];
let songscopy;


function filterSubFolderUrls(urls) {
    return urls.filter(url => {
        // Normalize by ensuring a trailing slash at the end of each URL
        let normalizedUrl = url.endsWith('/') ? url : url + '/';
        
        // Split the normalized URL by "/"
        let parts = normalizedUrl.split('/');
        let songsIndex = parts.indexOf('songs');

        // Check if there's a sub-folder after "songs"
        return songsIndex !== -1 && songsIndex < parts.length - 2;
    });
}

function normalizeUrls(urls) {
    return urls.map(url => url.replace(/\/$/, ''));
}


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function fetchSongs(currentAlbum) {
    let request = await fetch(currentAlbum, { mode: 'no-cors'});
    let response = await request.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 1; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href)
        }
    }
    ul.innerHTML = ""
    songs.forEach(song => {
        let part = song.split('/').pop()
        let name = decodeURI(part.split('.')[0])
        ul.innerHTML += ` <li>
                    <img src="img/music.svg" alt="">
                    <h3>${name}</h3>  
                    <svg class="hover" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="red"></circle>
                        <polygon points="40,35 70,50 40,65" fill="#000000"></polygon>
                    </svg>
                    
                </li>`
    })
    return songs


}
async function fetchSongscopy(currentAlbum) {
    let request = await fetch(currentAlbum, { mode: 'no-cors'});
    let response = await request.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songscopy = []
    for (let i = 1; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith("mp3")) {
            songscopy.push(element.href)
        }
    }
   
    return songscopy


}


async function displayAlbums() {
    let albumreq = await fetch(url, { mode: 'no-cors'})
    let albumres = await albumreq.text();
    let albumdiv = document.createElement("div")
    albumdiv.innerHTML = albumres
    let albumas = albumdiv.getElementsByTagName("a")
    let songUrls  = [] 
    for (let i = 1; i < albumas.length; i++) {
        const element = albumas[i];
if(!element.href.endsWith(".htaccess")){

    songUrls.push(element.href)
}
let filteredUrls = filterSubFolderUrls(songUrls);
 albumNames = normalizeUrls(filteredUrls);

        
    }
    albumNames.forEach((albumName) => {
        let part = albumName.split('/songs/').pop().split('/')[0];
        albumList.innerHTML += `<div class="album">
                    <img src="songs/${part}/cover.jpeg" alt="" class="cover">
                    <h3>${part}</h3>
                    <svg class="hover1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="red"></circle>
                        <polygon points="40,35 70,50 40,65" fill="#000000"></polygon>
                    </svg>
                </div>`

    })

    return albumNames;
}

async function Playsong(album) {
    let x = await fetchSongs(album);
     lis = ul.getElementsByTagName('li');
    const songName = ul.getElementsByTagName('h3');

    function playSong(index) {
        music.src = x[index];
        music.addEventListener('canplay', function () {
            music.play();
        }, { once: true });
    }
    music.src=x[0]
    music.play()
    Array.from(lis).forEach((li, index) => {
        li.addEventListener("click", function () {
            playSong(index);
        });
    });
    music.addEventListener('ended', function () {
        const currentIndex = x.indexOf(music.src);
        if (currentIndex !== -1 && currentIndex + 1 < x.length) {
            playSong(currentIndex + 1);
        }
        else {
            play.src = "img/play.svg"
        }
        if(music.src){
            playbar.style.display = "block"
        }
    });
    music.addEventListener("playing", function () {
        playbarname.innerHTML = `${decodeURI(music.src.split(`/songs/`).pop().split('.')[0]).split('/').pop()}`
        play.src = "img/pause.svg"
       
        
    })

    music.addEventListener("play", function () {
        let b = decodeURI(music.src.split('/').pop()).split('.')[0].trim();
        Array.from(lis).forEach((li, index) => {
            let a = songName[index].innerText.trim();
            if (a == b) {
                li.classList.add("selected");
            } else {
                li.classList.remove("selected");
            }
        });
        
    });
    return x
}
async function Playsong1(album) {
    let x = await fetchSongs(album);
     lis = ul.getElementsByTagName('li');
    const songName = ul.getElementsByTagName('h3');

    function playSong(index) {
        music.src = x[index];
        music.addEventListener('canplay', function () {
            music.play();
        }, { once: true });
    }
    Array.from(lis).forEach((li, index) => {
        li.addEventListener("click", function () {
            playSong(index);
        });
    });
    music.addEventListener('ended', function () {
        const currentIndex = x.indexOf(music.src);
        if (currentIndex !== -1 && currentIndex + 1 < x.length) {
            playSong(currentIndex + 1);
        }
        else {
            play.src = "img/play.svg"
        }
    });
    music.addEventListener("playing", function () {
        playbarname.innerHTML = `${decodeURI(music.src.split(`/songs/`).pop().split('.')[0]).split('/').pop()}`
        play.src = "img/pause.svg"
    })

    music.addEventListener("play", function () {
        let b = decodeURI(music.src.split('/').pop()).split('.')[0].trim();
        Array.from(lis).forEach((li, index) => {
            let a = songName[index].innerText.trim();
            if (a == b) {
                li.classList.add("selected");
            } else {
                li.classList.remove("selected");
            }
            if(music.src){
                playbar.style.display = "block"
            }
        });
    });
    return x
}


async function displaySongs() {
    let xyz = await displayAlbums();
    let newurl = xyz[0]
   await fetchSongs(newurl)
    const albums = albumList.querySelectorAll(".album")
    albums[0].classList.add("selected")
    h2.innerHTML = `${newurl.split('/songs/').pop().split('/')[0]}`
    Playsong1(newurl)
    albumList.addEventListener("click", async function (e) {
        let selectedAlbum = e.target.src.split('/songs/').pop().split('/')[0]
        newurl = url + "/" + selectedAlbum
      await  fetchSongs(newurl)

        h2.innerHTML = `${selectedAlbum}`
        Playsong(newurl)
        for (let i = 0; i < albums.length; i++) {
            const element = albums[i];
            const src = element.querySelector("img").getAttribute("src")
            if (newurl.split('/songs/').pop().trim() == src.split('/')[1].trim()) {
                albums[i].classList.add("selected")
            }
            else {
                albums[i].classList.remove("selected")
            }

        }
    })


}





async function main() {
    await displaySongs();
    music.addEventListener("playing", function () {
        playbarname.innerHTML = `${decodeURI(music.src.split(`/songs/`).pop().split('.')[0]).split('/').pop()}`

    })

    play.addEventListener("click", function () {
        if (pause == true) {
            music.play()
        }
        else {
            music.pause()
            play.src = "img/play.svg"
        }

        pause = !pause
    })


    timebar.addEventListener("click", function (e) {

        let percent = e.offsetX / timebar.clientWidth;
        music.currentTime = `${music.duration * percent}`
    });
    music.addEventListener("timeupdate", function () {
        time.innerHTML = `${secondsToMinutesSeconds(music.currentTime)}/${secondsToMinutesSeconds(music.duration)}`
        timecircle.style.left = `${music.currentTime / music.duration * 100 + "%"}`
        timecircle.style.left = `${timebar.clientWidth * (music.currentTime / music.duration) + "px"}`
    })

    prev.addEventListener("click", function () {
       let index =  songs.findIndex((song)=>{
           return song == music.src
        })
        if(index-1>=0){
            music.src = songs[index-1]
            music.play();

        }
        else{
            music.src = songs[index]
          music.play();
        }

    })
    next.addEventListener("click", function () {
       let index =  songs.findIndex((song)=>{
           return song == music.src
        })
        if(index<songs.length-1){
            music.src = songs[index+1]
            music.play();
        }
        else{
            music.src = songs[index]
            music.play();
        }
    })
volume.addEventListener("click",function(){
    if(music.muted){
        music.muted = false
        volume.src = "img/volume.svg"
        music.volume = 0.3;
    }
    else{
        music.muted = true
        volume.src = "img/mute.svg"
        music.volume = 0;

    }
})

music.addEventListener("volumechange", function() {
    volumebar.value = music.volume *100;
});
volumebar.addEventListener("change",function(e){
    music.volume = e.target.value/100
    
})


for (let element of albumNames) {
    const albumSongs = await fetchSongscopy(element);

    Allsongs.push(...albumSongs);
    
    albumSongs.forEach(song => {
        const songName = decodeURI(song.split(element + "/").pop().split(".")[0]).trim();
        songList.push(songName);
    });
}

searchbar.addEventListener("input", function () {
    const searchTerm = searchbar.value.trim();  
    const foundSongs = searchSongs(songList, searchTerm);
    if (searchTerm !== '') {
        searchResults.style.display = "block";
    } else {
        searchResults.style.display = "none";
    }
    
    searchResults.innerHTML = '';
    if(foundSongs.length==0){
        searchResults.innerHTML = "<div>Nothing found</div>"
    }

    
    foundSongs.forEach(found => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('searchresult');
        resultDiv.setAttribute('data-index', found.index);
        resultDiv.textContent = found.song;

        resultDiv.addEventListener('click', function () {
            const index = resultDiv.getAttribute('data-index');
            music.src = Allsongs[index]
            music.play()
            searchbar.value = ""
            searchResults.style.display = "none"
        });

        searchResults.appendChild(resultDiv);
    });
});


function searchSongs(songList, searchTerm) {
    const search = searchTerm.toLowerCase();

    const results = songList
        .map((song, index) => ({ song, index })).filter(item => item.song.toLowerCase().includes(search)); 
    return results;
}

hamburger.addEventListener("click",function(){
    hamburgeraffect.style.left = "21px"
})
close1.addEventListener("click",function(){
    hamburgeraffect.style.left = "-677px"
})


}
main();