if (typeof browser !== 'undefined') {
    chrome = browser
}

// const eIncorrectPassword = document.getElementById("eIncorrectPassword")
const ePassword = document.getElementById("ePassword")
const eButton = document.getElementById("eButton")

function tryLogin() {
    chrome.runtime.sendMessage({command: "LoginPassword", message: ePassword.value}, (user) => {
        // eIncorrectPassword.style.display = "block"
        if (user) {
            // eIncorrectPassword.textContent = "Successfully logged in"
            window.location.href = "options.html"
        } else {
            // eIncorrectPassword.textContent = "Incorrect password"
        }
    })
}

eButton.addEventListener('click', tryLogin)

ePassword.addEventListener('keydown', e => {
    if (e.key == "Enter") {
        tryLogin()
    }
})