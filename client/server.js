const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Carrega o arquivo proto
const PROTO_PATH = path.join(__dirname, './proto/remedio.proto');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const remedioProto = grpc.loadPackageDefinition(packageDefinition).remedio;

// Cria o cliente gRPC
const client = new remedioProto.RemedioService(
    process.env.GRPC_SERVER_ADDRESS || 'localhost:50051',
    grpc.credentials.createInsecure()
);

// API REST que chama os métodos gRPC
app.post('/api/remedios', async (req, res) => {
    try {
        const dados = req.body;
        const response = await new Promise((resolve, reject) => {
            client.Cadastrar(dados, (err, response) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/remedios', async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            client.Listar({}, (err, response) => {
                if (err) reject(err);
                else resolve(response.remedios || []);
            });
        });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/remedios/:id', async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            client.Detalhar({ id: parseInt(req.params.id) }, (err, response) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor web rodando em http://localhost:${PORT}`);
});