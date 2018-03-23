//lib http
const https = require('https');
const request = require('request');
var $ = require('jQuery');
var jose = require('node-jose');
var keystore = jose.JWK.createKeyStore();

var service = function service(){
    var props = {
        kid: 'ServiceKeys',
        alg: 'A256GCM',
        use: 'enc'
    };
    keystore.generate("oct", 1024, props).
    then(function (result) {
        // {result} is a jose.JWK.Key
        key = result;
        console.log("generate Key completed");
    });



    this.init =function(api, token) {
        //request public key
        https.get('http://[ip_address]/getPublicJey', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (key) => {
                keystore.add(key, "pem").
                then(function (result) {
                    // {result} is a jose.JWK.Key
                   return handshake(api, token);
                });

            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            return err;
        });

    }

    function handshake(api, token) {
        let data = {
            "api": api,
            "token": token,
            "pK": keystore.get('ServiceKeys').toPEM()
        };
        jose.JWE.createEncrypt(keystore.get('ServerKey')).
        update(data).
        final().
        then(function (cypher) {
            // {cypher} is a JSON Object -- JWE using the JSON General Serialization

            https.post('http://localhost/handShake/' + cypher, (resp) => {

                // A chunk of data has been recieved.
                resp.on('data', (dat) => {
                    console.log(dat);
                    jose.JWE.createDecrypt(keystore.get('ServiceKeys')).
                    decrypt(dat).
                    then(function (result) {
                        console.log(result);
                        return result;
                    });
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                return err;
            });


        });

    }

    this.load = function(url) {
        jose.JWE.createEncrypt(keystore.get('ServerKey')).
        update(url).
        final().
        then(function (cypher) {
            // {cypher} is a JSON Object -- JWE using the JSON General Serialization

            https.get('https://localhost/load/' + cypher, (resp) => {

                // A chunk of data has been recieved.
                resp.on('data', (dat) => {
                    console.log(dat);
                    resp.render('candlechart',{items:dat});
                    return "open complete";
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                return err;
            });


        });

    }

}



service.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
service.getInstance = function(){
    if(this.instance === null){
        this.instance = new service();
    }
    return this.instance;
}
 
module.exports = service.getInstance();