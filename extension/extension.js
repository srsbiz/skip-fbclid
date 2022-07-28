chrome.contextMenus.create({title: 'Open incognito without tracking', id: 'skip-fbclid', contexts: ['link']});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const fbLinker = 'l.facebook.com/l.php?u='
    let url = info.linkUrl,
        linkerPos = url.lastIndexOf(fbLinker),
        fbClidPos = -1
    ;
    if (linkerPos > -1) {
        url = unescape(url.substring(linkerPos + fbLinker.length));
    }
    if (
        -1 < (fbClidPos = url.lastIndexOf('?fbclid='))
        ||
        -1 < (fbClidPos = url.lastIndexOf('&fbclid='))
    ) {
        url = url.substring(0, fbClidPos);
    }
    chrome.windows.create({url: url, incognito: true});
})
