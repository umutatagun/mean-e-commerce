const expressJwt = require('express-jwt').expressjwt;

function authJwt(){
    const secret = process.env.SECRET;
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms:['HS256'],
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/,methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

// admin kontrolü için
async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true);
    }
    done();
}

module.exports = authJwt;