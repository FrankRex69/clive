exports.getToken = (req: any, res: any, next: any) => {
    console.log('1111');
    

    const jwt = require('.././middleware/jwt');    
    
    let token: any = jwt.setToken();
    let payload = jwt.getPayload(token);
    
    res.json(
        {
            token: token
        }
    );

}

