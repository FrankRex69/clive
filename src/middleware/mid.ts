exports.checkAuth = (req: any, res: any, next: any)=>{    

    const jwtRecall = require('./jwt');

    try {
        if(req.headers['authorization'] == null){
            console.log('Non autorizzato.');            
            res.sendStatus(401);
        }
        else
        {
            console.log('Autorizzazione corretta.');            
            let token = req.headers['authorization'];
                              
            token = token.slice(7,token.length);
            jwtRecall.checkToken(token);     
            next();
        }        
    } catch (err: any) {
        console.log(err.message);
        res.sendStatus(401);
    }

    
}