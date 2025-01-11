import express from 'express';
import session from 'express-session';
import moment from 'moment-timezone';
const app = express();

app.use(
    session({
        secret: 'RR3-ADJBT#longLive',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas de sesion
    })
);

app.get('/iniciar-sesion', (req, res) => {
    if (!req.session.inicio) {
        req.session.inicio = new Date();
        req.session.ultimoAcceso = new Date();
        res.send('Sesión Iniciada');
    } else {
        res.send('La sesión ya está iniciada (ACTIVA)');
    }
});

app.get('/actualizar', (req, res) => {
    if (req.session.inicio) {
        req.session.ultimoAcceso = new Date();
        res.send('Fecha de última consulta actualizada');
    } else {
        res.send('No hay una sesión activa');
    }
});

app.get('/estado-sesion', (req, res) => {
    if (req.session.inicio) {
        // Convertir a objetos Date si es necesario
        const inicio = new Date(req.session.inicio);
        const ultimoAcceso = new Date(req.session.ultimoAcceso);
        const ahora = new Date();
        const antiguedadMs = ahora - inicio;
        const horas = Math.floor(antiguedadMs / (1000 * 60 * 60));
        const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000);

        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:ss')
        const ultimoAccesoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH: ss');
        res.json({
            mensaje: 'Estado de la sesión',
            sessionID: req.sessionID,
            inicio: inicioCDMX,
            ultimoAcceso: ultimoAccesoCDMX,
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        });
    } else {
        res.json({ mensaje: 'No hay una sesión activa' });
    }
});


app.get('/cerrar-sesion', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Error al cerrar la sesión');
            }
            res.send('Sesión cerrada correctamente');
        });
    } else {
        res.send('No hay sesión activa para cerrar');
    }
});
//Definir el puerto por el cual el servidor se ejecutara
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Ejecutándose en http://localhost:${PORT}`);
});
