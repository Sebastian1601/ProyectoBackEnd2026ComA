const validarSesion = (req, res, next) => {
    if (req.url !== '/favicon.ico') {
        console.log("aqui se verifica la request del cliente para chequear si tiene sesión válida");
    };
    next();
};

export default validarSesion;