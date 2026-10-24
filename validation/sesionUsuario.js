const verificarRequest = (req, res, next) => {
    console.log("Metodo: ", req.method);
    console.log("URL: ", req.url);
    if (req.url === '/favicon.ico') {
        console.log("solicitud de favicon.");
    };
    next();
};



export default verificarRequest;