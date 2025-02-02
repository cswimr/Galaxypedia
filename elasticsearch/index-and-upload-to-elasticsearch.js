const hes = require('hugo-elasticsearch');
const { Client } = require('@elastic/elasticsearch')
const fs = require('fs');
const ndjson = require("ndjson");

(async () => {
console.log("Copy your http_ca.crt file to this directory and press any key to continue.");
await waitKeyPressed();

const client = new Client({
    node: 'https://localhost:9200',
    tls: {
        ca: fs.readFileSync('./http_ca.crt'),
        rejectUnauthorized: false
    },
    auth: {
        username: 'elastic',
        password: 'sugondese'
    }
})

const Indexer = new hes({
    input: '../content/**',
    output: '../public/elasticsearch.json',
    language: 'yaml',
    delimiter: '---',
    indexName: 'galaxypedia'
})

Indexer.index();

const fetchBulkJson = () => {
    return new Promise((resolve, reject) => {
      let lines = [];

      fs.createReadStream("../public/elasticsearch.json")
        .pipe(ndjson.parse())
        .on("data", line => lines.push(line))
        .on("end", () => resolve(lines))
        .on("error", err => reject(err));
    });
};

const bulkUpload = async () => {
    const json = fs.readFileSync("../public/elasticsearch.json", "utf8");
    return await client.bulk({ body: json });
};

await bulkUpload()

})()

function waitKeyPressed() {
    return new Promise(resolve => {
        const wasRaw = process.stdin.isRaw;
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", (data) => {
            process.stdin.pause();
            process.stdin.setRawMode(wasRaw);
            resolve(data.toString());
        });
    });
}
