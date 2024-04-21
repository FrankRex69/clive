exports.getAlfaNumeCasuale = (req: any, res: any, next: any) => {  

   const codcasuale = require('../assets/alfaNumeCasuale'); 
   
   let codcas = codcasuale.alfaNumeCasuale(10);
   console.log('Codice casuale univoco: ' + codcas);   
       
   res.json(codcas);
   
}