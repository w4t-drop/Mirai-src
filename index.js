const { spawn } = require("child_process");
const logger = require("./utils/log");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000; // Specify your desired port number

function startBot(message) {
    (message) ? logger(message, "[ Starting ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Restarting...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

// Create a simple HTTP server that serves index.html
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        // Path to index.html file
        const filePath = path.join(__dirname, "index.html");
        
        // Read the index.html file and serve it
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error: Unable to load index.html");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

// Start the server on the specified port
server.listen(PORT, () => {
    logger(`Server is running on port ${PORT}`, "[ Server ]");
});

// Start the bot
startBot();
