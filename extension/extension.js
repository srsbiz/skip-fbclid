chrome.contextMenus.create({
    title: 'Open incognito without tracking',
    id: 'skip-fbclid',
    contexts: [
        'link',
        'selection'
    ]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const fbLinker = 'l.facebook.com/l.php?u='
    let url = info.linkUrl || info.selectionText,
        linkerPos = url.lastIndexOf(fbLinker),
        fbClidPos = -1,
        tabOptions = { active: true }
    ;
    if (linkerPos > -1) {
        url = decodeURIComponent(url.substring(linkerPos + fbLinker.length));
    }
    if (
        -1 < (fbClidPos = url.lastIndexOf('?fbclid='))
        ||
        -1 < (fbClidPos = url.lastIndexOf('&fbclid='))
    ) {
        url = url.substring(0, fbClidPos);
    }
    if (url.lastIndexOf('https://') !== 0 && url.lastIndexOf('http://') !== 0) {
        if (url.lastIndexOf('.') == -1 || url.lastIndexOf(' ') >= 0) {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        } else {
            url = 'http://' + url;
        }
    }
    tabOptions.url = url;
    chrome.windows.getAll({ populate: true, windowTypes: ["normal"] }, function(allWindows){
        for (const window of allWindows){
            if (window.incognito) {
                tabOptions.windowId = window.id;
                break;
            }
        }
        if (tabOptions.windowId) {
            chrome.tabs.create(tabOptions);
        } else {
            chrome.windows.create({ url: url, incognito: true })
        }
    });
})
