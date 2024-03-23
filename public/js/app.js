let messages = []
let users = []
let queries = []

function getIdentifier() {
    return document.querySelector("meta[name=identifier]")?.getAttribute("content")
}

function setIdentifier(value) {
    const identifier = document.querySelector("meta[name=identifier]")
    if (!identifier) {
        return
    }

    identifier.setAttribute("content", value)
}

function convertMarkdownToHtml(markdown) {
    const converter = new showdown.Converter({extensions: ['table']})
    const html = converter.makeHtml(markdown);

    const doc = new DOMParser().parseFromString(html, "text/xml");

    doc.querySelectorAll("table").forEach((table) => {
        table.classList.add("table")
    })

    return doc.body.innerHTML
}

function getMessages() {

    return fetch("/api/messages", {
        headers: {
            "x-identifier": getIdentifier()
        }
    })
        .then((res) => res.json())
}

function getUsers() {
    return fetch("/api/users")
        .then((res) => res.json())

}

function getQueries() {
    return fetch("/api/queries")
        .then((res) => res.json())
}

function setQueries(qs) {
    queries = qs

    const container = document.querySelector("#queries-table tbody")

    container.innerHTML = ""

    queries.forEach(q => container.appendChild(createQueryRow(q)))
}

function createQueryRow(query) {
    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    td1.innerText = query.query
    td2.innerText = query.sql
    tr.appendChild(td1)
    tr.appendChild(td2)
    return tr
}

function sendMessage(message) {
    return fetch("/api/messages", {
        method: "POST", body: JSON.stringify({query: message}), headers: {
            "Content-Type": "application/json", "x-identifier": getIdentifier()
        }
    })
        .then((res) => res.json())
}

function createUserMessage(txt) {
    const template = document.querySelector("template#user-message-template")
    const clone = template.content.cloneNode(true)
    clone.querySelector(".card-body").innerHTML = convertMarkdownToHtml(txt)
    return clone
}

function createAssistantMessage(txt) {
    const template = document.querySelector("template#assistant-message-template")
    const clone = template.content.cloneNode(true)
    clone.querySelector(".card-body").innerHTML = convertMarkdownToHtml(txt)
    return clone
}

function clearConversation() {
    const container = document.querySelector("#conversation-container")
    container.innerHTML = ""
}

function insertMessageToContainer(element) {
    const container = document.querySelector("#conversation-container")
    container.appendChild(element)
}

function createMessages() {
    messages.forEach(msg => {
        if (msg.role === "user") {
            insertMessageToContainer(createUserMessage(msg.content))
        } else {
            insertMessageToContainer(createAssistantMessage(msg.content))
        }
    })
}

function scrollToBottom() {
    console.log("scrolling")
    const container = document.body
    container.scrollTop = container.scrollHeight
}

function init() {
    getMessages()
        .then((msgs) => messages = msgs || [])
        .then(() => clearConversation())
        .then(() => createMessages())
        .then(() => getQueries().then(setQueries))
        .finally(() => scrollToBottom())
}

function ask(e) {
    e.preventDefault()
    const message = e.target.message
    insertMessageToContainer(createUserMessage(message.value))
    scrollToBottom()
    sendMessage(message.value)
        .then((res) => {
            messages.push({'role': 'assistant', 'content': res.message})
            insertMessageToContainer(createAssistantMessage(res.message))
        })
        .finally(() => scrollToBottom())

    return false
}

function updateSettings(e) {
    e.preventDefault()

    setIdentifier(e.target.identifier.value)
    init()
}

init()