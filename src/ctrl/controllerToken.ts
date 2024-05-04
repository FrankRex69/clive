exports.getToken = (req: any, res: any, next: any) => {    

    const jwt = require('.././middleware/jwt');    
    
    let token: any = jwt.setToken();
    let payload = jwt.getPayload(token);

    console.log('1) acquisito token');
    
    
    res.json(
        {
            token: token,
            payload: payload
        }
    );

}

