if (typeof browser !== 'undefined') {
    chrome = browser
}

function createRedirect(target, redirect) {
    chrome.webRequest.onBeforeRequest.addListener((details) => {
        return { redirectUrl: redirect }
    }, { urls: [ target ] }, ["blocking"])
}

function postJson(url, json) {
    return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText);
            }
        };
        xhttp.onerror = function() {
            reject()
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(json));
    })
}

function Tulc(info)
{
    this.trainerId = info.trainerId
    this.url = {}
    this.url.login = info.baseURL + "/login/signin"
    
    this.user = null
    this.setUser = user => this.user = user
    this.getUser = () => this.user
    this.login = password => {
        this.setUser(null)

        var requestInfo = {}
        requestInfo.trainerId = this.trainerId
        requestInfo.password = password

        return new Promise((resolve, reject) => {
            postJson(this.url.login, requestInfo).then((response) => {
                try {
                    response = JSON.parse(response)
                    if (response.status == "success") {
                        this.setUser({name: response.name})
                        resolve(this.getUser());
                    } else { reject() }
                } catch (e) {console.log(e); reject()}
            }, () => {
                reject()
            })
        })
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command == "LoginPassword" && request.message) {
        tulc.login(request.message).then((user) => {
            sendResponse(user)
            onLoginSuccess(tulc.getUser())
        }, () => {
            sendResponse()
        })
        return true
    }
    return false
});

function onLoginSuccess(user)
{
    chrome.browserAction.setPopup({popup: "popup/options.html"})
                                                                                                       
    createRedirect("*://*.qublixaws.com/tropictrouble_html5/CandyWeb.js*",             "https://www.tropictrouble.cheatenginebrasil.com.br/scripts/tropic.js")
}

var tulc = new Tulc({baseURL: "https://www.tropictrouble.cheatenginebrasil.com.br/tulc/ext"});
chrome.browserAction.setPopup({popup: "popup/login.html"})
