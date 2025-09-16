/* 
    to fetch content from json file
*/
const filename = "content.json";
const entries = []
let offset = 0;
const entryPerPage = 5;

fetch(filename)
    .then((contents) => contents.json())
    .then((contentsJson) => entries.push(...contentsJson.entries))
    .then(loadContent);
    

/* functions for loading content */

function loadContent() {
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
            loadContent();
        } else if (e.target.textContent.includes("previous")) {
            offset -= entryPerPage;
            loadContent();
        } else if (e.target.textContent.includes("first")) {
            offset = 0;
            loadContent();
        } else if (e.target.textContent.includes("last")) {
            const fullPages = Math.floor(entries.length / entryPerPage)
            offset = fullPages * entryPerPage;
            loadContent();
        } 
    }

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

function createArticleTitle(title) {
    const titleDiv = document.createElement("div");
    const titleText = document.createElement("h2");
    
    titleText.classList.add("main__article__title");
    titleText.textContent = title;
    titleDiv.appendChild(titleText);

    return titleDiv;
}

function createWritingContent(entry) {
    const contentDiv = document.createElement("div");
    const contentPar = document.createElement("p");
    
    contentPar.classList.add("main__article__text");
    contentPar.textContent = entry.mainText;    
    contentDiv.appendChild(contentPar);

    return contentDiv;
}

function createMusicContent(entry) {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("main__article__audio");

    const contentAudio = document.createElement("audio");
    contentAudio.setAttribute("controls","");

    const contentSource = document.createElement("source");
    contentSource.setAttribute("src", entry.audioFile);
    contentSource.setAttribute("type", entry.audioType);

    contentAudio.append(contentSource, "Your browser does not support the audio tag");

    const contentText = document.createElement("p");
    contentText.textContent = entry.mainText;

    contentDiv.append(contentAudio, contentText);

    return contentDiv;
}

function createPhotoContent(entry) {
    const contentFig = document.createElement("figure");
    contentFig.classList.add("main__article__fig");
    
    const contentImg = document.createElement("img");

    contentImg.setAttribute("src", entry.imageFile);
    contentImg.setAttribute("alt",entry.imageAlt);
    contentImg.setAttribute("width",entry.imageWidth);
    contentImg.setAttribute("height",entry.imageHeight);

    const contentCap = document.createElement("figcaption");
    contentCap.textContent = entry.mainText;

    contentFig.append(contentImg, contentCap);

    return contentFig;
}

function createArticle(entry) {
    const article = document.createElement("article");
    article.classList.add("main__article");

    const title = createArticleTitle(entry.title);
    let content = document.createTextNode("No content");;
    
    switch (entry.category) {
        case "writings":
            content = createWritingContent(entry);
            break;
        case "music":
            content = createMusicContent(entry);
            break;
        case "photos":
            content = createPhotoContent(entry);
            break;
    }

    article.appendChild(title);
    article.appendChild(content);
    return article;
}


/* ------------- Page navigatoffset = ion component ------------- */

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








