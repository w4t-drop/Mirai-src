const { spawn } = require("child_process");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");

// Express app setup
const app = express();
const port = 3000;

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start Express server
app.listen(port, () => {
    logger(`Server started on http://localhost:${port}`, "[ Express ]");
});

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 || (global.countRestart && global.countRestart < 5)) {
            startBot("Restarting...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", (error) => {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

// Start the bot
startBot();
