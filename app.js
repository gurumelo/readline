var port = 3000;
var http = require('http');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

var server = http.createServer( function(llamada, respuesta) {
	fs.readFile('./index.html', function(error, data) {
		respuesta.writeHead(200, { 'Content-Type': 'text/html' });
		respuesta.end(data, 'utf-8');
	});
}).listen(port);

console.log('Servidor rulando');

var io = require('socket.io').listen(server);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var b64encode = function(archivo) {
	var bitmap = fs.readFileSync(archivo);
	return new Buffer(bitmap).toString('base64');
}

var llamada = function() {
	console.log('[1] Mensaje de texto');
	console.log('[2] Imagen');
	console.log('[3] Audio');
	rl.question("¿1 ó 2 ó 3? ", function(r) {
		if (r == 1) {
			rl.question("¿Qué pasa? ", function(m) {
				io.emit('mensaje', m);
				llamada();
			});
		}
		if (r == 2) {
			rl.question("Ruta imagen: ", function(f) {
				var extension = path.extname(f);
				var f64 = b64encode(f);
				f64 = '<img src="data:image/'+ extension +';base64,'+ f64 +'" />';
				io.emit('mensaje', f64);
				llamada();
			});
		}
		if (r == 3) {
			rl.question("Ruta ogg: ", function(a) {
				var a64 = b64encode(a);
				a64 = '<audio controls src="data:audio/ogg;base64,'+ a64 +'" />';
				
				io.emit('mensaje', a64);
				llamada();
			});
		}
		
	});

}

llamada();


