import { createServer, IncomingMessage, ServerResponse } from "http";
import { processBody } from "./github";
import { debug } from "./log";

const port = 6050;

async function recieve(req: IncomingMessage, res: ServerResponse) {
    if (req.method != "POST") {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("403 Forbidden");
        return;
    }
    debug("Received request");
    debug("Request Headers: " + JSON.stringify(req.headers, null, 2));
    const buffers: Buffer[] = [];
    for await (const buffer of req) {
        buffers.push(buffer);
    }

    const body = Buffer.concat(buffers).toString();

    processBody(body);

    res.writeHead(200);
    res.end();
}

const server = createServer(recieve);
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});