"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const bodyParser = __importStar(require("body-parser"));
const app = (0, express_1.default)();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;
const file = require('../../db.json');
// app.get('/', (req, res) => {
//   fs.readFile('./db.json','utf-8',(err,data)=>{
//     console.log(data);
//     let apparels= JSON.parse(data);
//     res.send(apparels);
//   });
// });
app.post('/updateStock', (req, res) => {
    let data = req.body;
    let stocks = file.stock;
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].code == data.code && stocks[i].size == data.size) {
            stocks[i] = data;
        }
    }
    file.stock = stocks;
    fs.writeFile('./db.json', JSON.stringify(file), (err) => {
        res.send('Data Received: ' + JSON.stringify(file));
    });
});
app.post('/updateStocks', (req, res) => {
    let data = req.body.stock;
    let stocks = file.stock;
    for (let i = 0; i < stocks.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (stocks[i].code == data[j].code && stocks[i].size == data[j].size) {
                stocks[i] = data[j];
            }
        }
    }
    file.stock = stocks;
    fs.writeFile('./db.json', JSON.stringify(file), (err) => {
        res.send('Data Received: ' + JSON.stringify(file));
    });
});
app.post('/checkAvailability', (req, res) => {
    let data = req.body.order;
    let stocks = file.stock;
    let result = true;
    for (let i = 0; i < stocks.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (stocks[i].code == data[j].code && stocks[i].size == data[j].size && data[j].units > stocks[i].units) {
                result = false;
                break;
            }
        }
        if (!result) {
            break;
        }
    }
    file.stock = stocks;
    fs.writeFile('./db.json', JSON.stringify(file), (err) => {
        res.send('Data Received: ' + JSON.stringify(result));
    });
});
app.post('/checkPurchase', (req, res) => {
    let data = req.body.order;
    let stocks = file.stock;
    let result = 0;
    for (let i = 0; i < stocks.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (stocks[i].code == data[j].code && stocks[i].size == data[j].size) {
                result += Math.min(data[j].units, stocks[i].units) * stocks[i].price;
            }
        }
    }
    file.stock = stocks;
    fs.writeFile('./db.json', JSON.stringify(file), (err) => {
        res.send('Data Received: Rs' + JSON.stringify(result));
    });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map