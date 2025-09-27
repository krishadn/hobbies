/* 
    to fetch content from json file
*/
const filename = "content.json";
const entries = [];
const bestEntries = [];
let offset = 0;
const entryPerPage = 5;

fetch(filename)
    .then((contents) => contents.json())
    .then((contentsJson) => entries.push(...contentsJson.entries))
    .then(() => bestEntries.push(...entries.filter((entry) => entry.best)))
    .then(loadMainContent)
    .then(loadAsideContent);
    

/* functions for loading content */

function loadMainContent() {
    const main = document.querySelector(".main");
    clearMain();

    let index = 0;
    while (index != entryPerPage && entries[offset+index]) {
        main.append(createArticle(entries[offset+index]))
        index++
    }

    const navDiv = document.createElement("div");
    navDiv.classList.add("main__page-nav");

    if (entries[offset+index]) {
        navDiv.append(createByPageNav("next"));
    }

    if (offset !== 0) {
        navDiv.append(createByPageNav("previous"));
        navDiv.append(createEndNav("first"));
    }

    if (entries[offset+index]) {
        navDiv.append(createEndNav("last"));
    }

    navDiv.addEventListener("click", handlePageNav)
    main.append(navDiv);
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    })
}


function handlePageNav(e) {
    
    if (e.target.tagName === "SPAN"){
        if (e.target.textContent.includes("next")) {
            offset += entryPerPage;
            loadMainContent();
        } else if (e.target.textContent.includes("previous")) {
            offset -= entryPerPage;
            loadMainContent();
        } else if (e.target.textContent.includes("first")) {
            offset = 0;
            loadMainContent();
        } else if (e.target.textContent.includes("last")) {
            const fullPages = Math.floor(entries.length / entryPerPage)

            if (entries.length % entryPerPage) {
                offset = fullPages * entryPerPage;   
            } else {
                offset = (fullPages * entryPerPage) - entryPerPage;
            }
            loadMainContent();
        } 
    }

}


function loadAsideContent() {
    const asideCarousel = document.querySelector(".aside__carousel");

    bestEntries.forEach(entry => {
        const article = createArticle(entry,aside=true);
        asideCarousel.appendChild(article);
    })



}


/* utility functions */

function clearMain() {
    const main = document.querySelector(".main");

    if (main.children[0]) {
        while (main.children[0]) {
            main.children[0].remove();
        }
    }

}




/* functions for components */

/* ------------- Article component ------------- */

function createArticleTitle(title, aside=false) {
    const titleDiv = document.createElement("div");
    const titleText = document.createElement(`${aside?"h3":"h2"}`);
    
    titleText.classList.add(`${aside?"aside":"main"}__article__title`);
    titleText.textContent = title;
    titleDiv.appendChild(titleText);

    return titleDiv;
}

function createWritingContent(entry, aside=false) {
    const contentDiv = document.createElement("div");
    const contentPar = document.createElement("p");
    
    contentPar.classList.add(`${aside?"aside":"main"}__article__text`);
    contentPar.textContent = entry.mainText;    
    contentDiv.appendChild(contentPar);

    return contentDiv;
}

function createMusicContent(entry, aside=false) {
    const audioId = `${entry.audioFile.split("/")[2].split(".")[0]}-${aside? "aside": "main"}`;
    const contentDiv = document.createElement("div");
    contentDiv.classList.add(`${aside? "aside": "main"}__article__audio`);

    const playerDiv = document.createElement("div");
    playerDiv.classList.add(`${aside? "aside": "main"}__article__audio__player`);

    const playBtn = document.createElement("button");
    playBtn.setAttribute("data-title", `${audioId}`);
    playBtn.classList.add("control");
    playBtn.textContent = "▶";
    playBtn.onclick = playAudio;

    const contentAudio = document.createElement("audio");
    contentAudio.setAttribute("src", entry.audioFile);
    contentAudio.setAttribute("type", entry.audioType);
    contentAudio.setAttribute("data-title", `${audioId}`);
    contentAudio.ontimeupdate = throttle(updateTimeIndicator, 750);
    contentAudio.onpause = updatePlayBtn;
    contentAudio.onplay = updatePlayBtn;



    const screenDiv = document.createElement("div");
    screenDiv.classList.add("screen");

    const topText = document.createElement("p");
    topText.textContent = "DIGITAL MP3 PLAYER";


    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("screen__details");

    const timeStamp = document.createElement("p");
    timeStamp.setAttribute("data-title", `${audioId}`);
    timeStamp.textContent = "00:00";

    const title = document.createElement("p");
    title.textContent = entry.title;

    const progressDiv = document.createElement("div");
    progressDiv.setAttribute("data-title", `${audioId}`);
    progressDiv.classList.add("progress-container");
    progressDiv.onclick = moveProgressBar;

    const progressBar = document.createElement("div");
    progressBar.setAttribute("data-title", `${audioId}`);
    progressBar.classList.add("progress-bar");

    progressDiv.append(progressBar);


    detailsDiv.append(timeStamp, title, progressDiv);

    const bottomText = document.createElement("p");
    bottomText.textContent = "MP3/WMA/REC";

    screenDiv.append(topText,detailsDiv,bottomText);

    playerDiv.append(playBtn, contentAudio, screenDiv);


    const contentText = document.createElement("p");
    contentText.textContent = entry.mainText;

    contentDiv.append(playerDiv, contentText);

    return contentDiv;
}

function createPhotoContent(entry, aside=false) {
    const contentFig = document.createElement("figure");
    contentFig.classList.add(`${aside?"aside":"main"}__article__fig`);
    
    const contentImg = document.createElement("img");
    
    if (aside) {
        contentImg.classList.add("aside__article__fig__img");
    }

    contentImg.setAttribute("src", entry.imageFile);
    contentImg.setAttribute("alt",entry.imageAlt);
    contentImg.setAttribute("width",entry.imageWidth);
    contentImg.setAttribute("height",entry.imageHeight);

    const contentCap = document.createElement("figcaption");
    contentCap.textContent = entry.mainText;

    contentFig.append(contentImg, contentCap);

    return contentFig;
}

function createArticle(entry, aside=false) {
    const article = document.createElement("article");
    article.classList.add(`${aside?"aside":"main"}__article`);

    const title = createArticleTitle(entry.title, aside);
    let content = document.createTextNode("No content");;
    
    switch (entry.category) {
        case "writings":
            content = createWritingContent(entry, aside);
            break;
        case "music":
            content = createMusicContent(entry, aside);
            break;
        case "photos":
            content = createPhotoContent(entry, aside);
            break;
    }

    article.appendChild(title);
    article.appendChild(content);
    return article;
}


/* ------------- Page navigation component ------------- */

// for Next and Previous
function createByPageNav(text) {
    const par = document.createElement("p");
    par.classList.add(text);

    const span = document.createElement("span");
    span.append(text);
    span.append(document.createElement("br"));
    span.append("page");
 
    par.append(span)

    return par;
}

// for First and Last
function createEndNav(text) {
    const par = document.createElement("p");
    par.classList.add(text);

    const span = document.createElement("span");
    span.append(`${text} page`);
    par.append(span)

    return par;
}

function createPageNav() {
    const navDiv = document.createElement("div");
    navDiv.classList.add("main__page-nav");
    navDiv.append(createByPageNav("next"));
    navDiv.append(createByPageNav("previous"));
    navDiv.append(createEndNav("first"));
    navDiv.append(createEndNav("last"));
    return navDiv;
}




/* functions for interactivity */

function playAudio(event) {
    const audioId = event.target.dataset.title;
    const audio = document.querySelector(`audio[data-title=${audioId}]`);

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }

}

function moveProgressBar(event) {
    const audioId = event.target.dataset.title;
    const audio = document.querySelector(`audio[data-title=${audioId}]`);
    audio.currentTime = audio.duration * (event.offsetX/event.currentTarget.offsetWidth);
}

function updatePlayBtn(event) {
    const audio = event.target;
    const audioId = audio.dataset.title;
    const playBtn = document.querySelector(`button[data-title=${audioId}]`);
    
    playBtn.textContent = (audio.paused) ? "▶" : "⏸︎";

}


function updateTimeIndicator(event) {
    const audio = event.target;
    const audioId = audio.dataset.title;

    // timestamp
    const timeStamp = document.querySelector(`p[data-title=${audioId}]`);
    const currentTime = Math.floor(audio.currentTime);
    const seconds = Math.floor(currentTime % 60).toString().padStart(2, "0");
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, "0");
    timeStamp.textContent = `${minutes}:${seconds}`;

    // progressbar
    const progressBar = document.querySelector(`div.progress-bar[data-title=${audioId}]`);
    const width = Math.floor((audio.currentTime / audio.duration) * 100);
    progressBar.style.width = `${width}%`;


}



function throttle(func, delay=1000) {

    let shouldWait = false;

    return (...args) => {

        if (shouldWait) return;
        
        func(...args);

        shouldWait = true;

        setTimeout (() => {
            shouldWait = false;
        }, delay)

    }



}
