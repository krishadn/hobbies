async function getContent(filename) {
    const contents = await fetch(filename);
    const contentsJson = await contents.json();
    return contentsJson.entries;
}

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
    contentPar.style.whiteSpace = "pre";
    
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
    contentSource.setAttribute("type", "audio/mp3");

    contentAudio.appendChild(contentSource);
    contentAudio.textContent = "Your browser does not support the audio tag";

    contentDiv.appendChild(contentAudio);
    return contentDiv;
}

function createPhotoContent(entry) {
    const contentFig = document.createElement("figure");
    contentFig.classList.add("main__article__fig");
    
    const contentImg = document.createElement("img");

    contentImg.setAttribute("src", entry.imageFile);
    contentImg.setAttribute("alt",entry.imageAlt);

    const contentCap = document.createElement("figcaption");
    contentCap.textContent = entry.imageDesc;

    contentFig.appendChild(contentImg);
    contentFig.appendChild(contentCap);

    return contentFig;
}

function createArticle(entry) {
    const main = document.querySelector("main");
    const article = document.createElement("article");
    article.classList.add("main__article");

    const title = createArticleTitle(entry.title);
    let content;
    
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
    main.appendChild(article);
}

const filename = "content.json";
getContent(filename).then(res => {
    res.forEach(createArticle);
});