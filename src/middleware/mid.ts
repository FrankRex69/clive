exports.checkAuth = (req: any, res: any, next: any)=>{

    console.log('dsfsf');
    

    const jwtRecall = require('./jwt');

    try {
        if(req.headers['authorization'] == null){
            console.log('aaaa');
            
            res.sendStatus(401);
        }
        else
        {
            console.log('bbb');
            
            let token = req.headers['authorization'];
            console.log(token);
                  
            token = token.slice(7,token.length);
            jwtRecall.checkToken(token);     
            next();
        }        
    } catch (err: any) {
        console.log(err.message);
        res.sendStatus(401);
    }

    
}