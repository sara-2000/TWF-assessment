var  express        = require("express")
   , app            = express()
   , cors           = require('cors')
   , bodyParser     = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: "50mb"}));

let createGraph = ()=>{
    let map = []
    map.push([0,4,0,3])
    map.push([4,0,3,2.5])
    map.push([0,3,0,2])
    map.push([3,2.5,2,0])
    return map
}

let  calculate = (source,dest,weight,graph)=>{
    let cost = graph[source][dest] * 10;
    weight = weight - 5;
    while(weight > 0 ){
        cost += graph[source][dest] * 8;
        weight = weight-5;
    }
    return cost;
}


let findcost = (source ,dest ,graph,t)=>{
    let temp = t[source];
    let cost = calculate(source , 3 , temp , graph);
    let s = 3;
    for(let j = 0 ; j<3 ; j++){
        if( j != source && t[j] != 0){
            cost += calculate(s , j , 0 , graph);
            s = j;
            cost += calculate(s , 3 , t[j] , graph);
        }
    }
    return cost;
}

let findmincost = (graph,payload)=>{
    let  mincost = Number.MAX_VALUE;
    let c1 = (payload[0]*3)+(payload[1]*2)+(payload[2]*8)
    let c2 =(payload[3]*12)+(payload[4]*25)+(payload[5]*15)
    let c3 = (payload[6]*0.5)+(payload[7]*1)+(payload[8]*2)
    let t = [c1,c2,c3]
    for(let i=0 ; i<3 ; i++){
        if(t[i] != 0){
            let cost = findcost(i , 3 , graph , t );
            if(cost < mincost){
                mincost = cost;
            }
        }
    }
    return mincost
}


let pathFinder = (payload)=>{
    let graph = createGraph()
    let mincost = findmincost(graph,payload)
    return mincost
}

app.post("/getMinPath",(req,res)=>{
    //             a b c d e f g h i
    let payload = [0,0,0,0,0,0,0,0,0]
    if(req.body.a){
       payload[0] = Number(req.body.a)
    }
    if(req.body.b){
        payload[1] = Number(req.body.b)
    }
    if(req.body.c){
        payload[2] = Number(req.body.c)
    }
    if(req.body.d){
        payload[3] = Number(req.body.d)
    }
    if(req.body.e){
        payload[4] = Number(req.body.e)
    }
    if(req.body.f){
        payload[5] = Number(req.body.f)
    }
    if(req.body.g){
        payload[6] = Number(req.body.g)
    }
    if(req.body.h){
        payload[7] = Number(req.body.h)
    }
    if(req.body.i){
        payload[8] = Number(req.body.i)
    }
    let mincost = pathFinder(payload)
    res.json(mincost)
});


app.listen(process.env.PORT, process.env.IP , function(){
    console.log("TWF server has started");
});