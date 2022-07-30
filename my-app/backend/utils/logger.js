const config = require("./config")

const log = (...arg) => {
    if (config.ENV !== "test") { console.log(...arg) }
}

const error = (...arg) => {
    if (config.ENV !== "test") { console.error(...arg) }
}

module.exports = {
    log, error
}