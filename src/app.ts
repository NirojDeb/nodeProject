import express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import {IStock, Size} from  '../models/DataModel';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;

const file= require('../../db.json');

// app.get('/', (req, res) => {
//   fs.readFile('./db.json','utf-8',(err,data)=>{
//     console.log(data);
//     let apparels= JSON.parse(data);
//     res.send(apparels);
//   });
// });

app.post('/updateStock',(req,res)=>{
    let data:IStock = req.body;
    let stocks:IStock[]=file.stock;
    for(let i=0;i<stocks.length;i++)
    {
        if(stocks[i].code==data.code && stocks[i].size==data.size)
        {
            stocks[i]=data;
        }
    }
    file.stock=stocks;
    fs.writeFile('./db.json',JSON.stringify(file),(err)=>{
        res.send('Data Received: ' + JSON.stringify(file));
    })
    
});

app.post('/updateStocks',(req,res)=>{
    let data:IStock[] = req.body.stock;
    let stocks:IStock[]=file.stock;
    for(let i=0;i<stocks.length;i++)
    {
        for(let j=0;j<data.length;j++)
        {
            if(stocks[i].code==data[j].code && stocks[i].size==data[j].size)
            {
                stocks[i]=data[j];
            }
        }
    }
    file.stock=stocks;
    fs.writeFile('./db.json',JSON.stringify(file),(err)=>{
        res.send('Data Received: ' + JSON.stringify(file));
    })
    
});

app.post('/checkAvailability',(req,res)=>{
    let data:Partial<IStock[]> = req.body.order;
    let stocks:IStock[]=file.stock;
    let result:boolean=true;
    for(let i=0;i<stocks.length;i++)
    {
        for(let j=0;j<data.length;j++)
        {
            if(stocks[i].code==data[j].code && stocks[i].size==data[j].size && data[j].units>stocks[i].units)
            {
                result=false;
                break;
            }
        }
        if(!result)
        {
            break;
        }
    }
    file.stock=stocks;
    fs.writeFile('./db.json',JSON.stringify(file),(err)=>{
        res.send('Data Received: ' + JSON.stringify(result));
    })
    
});


app.post('/checkPurchase',(req,res)=>{
    let data:Partial<IStock[]> = req.body.order;
    let stocks:IStock[]=file.stock;
    let result:number=0;
    for(let i=0;i<stocks.length;i++)
    {
        for(let j=0;j<data.length;j++)
        {
            if(stocks[i].code==data[j].code && stocks[i].size==data[j].size)
            {
                result+=Math.min(data[j].units,stocks[i].units)*stocks[i].price;
            }
        }
    }
    file.stock=stocks;
    fs.writeFile('./db.json',JSON.stringify(file),(err)=>{
        res.send('Data Received: Rs' + JSON.stringify(result));
    })
    
});



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});