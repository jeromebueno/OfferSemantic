const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser');
const app = express()

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var myHeaders = new fetch.Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Basic RVNHSS1XRUItMjAyMDpFU0dJLVdFQi0yMDIwLWhlVXE5Zg==");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

app.post('/insert-offer', async function(req, res){
    var urlencoded = new URLSearchParams();
    urlencoded.append("update", 
    "PREFIX wd: <http://www.wikidata.org/entity/> \nPREFIX js: <http://example.com/vocabulary#>\n\nINSERT DATA\n{\n    GRAPH <https://www.esgi.fr/2019/ESGI5/IW1/projet8>\n    {\n        wd:"+ req.body.company.split('/').pop() +"  js:job <"+ req.body.offer_url + "> .\n    }\n}");
    
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };
    
    const response = await fetch("https://sandbox.bordercloud.com/sparql", requestOptions)
    if(response.status == "200"){
        res.redirect('/')
    }
})

app.get('/',async function(req,res){
    var urlencoded = new URLSearchParams();
    urlencoded.append("query", "PREFIX wdt: <http://www.wikidata.org/prop/direct/> \nPREFIX bd: <http://www.bigdata.com/rdf#> \nPREFIX wd: <http://www.wikidata.org/entity/> \n \nPREFIX wikibase: <http://wikiba.se/ontology#> \nSELECT ?item ?itemLabel ?image\nWHERE \n{\n  ?item wdt:P31 wd:Q4830453.\n  ?item wdt:P17 wd:Q142.\n  optional{ ?item wdt:P18 ?image }\n \n  SERVICE wikibase:label { bd:serviceParam wikibase:language \"fr\". }\n} \nLIMIT 100");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const response = await fetch("https://query.wikidata.org/sparql", requestOptions)
    const json = await response.json()
    res.render('index',{'companies':json.results.bindings})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
