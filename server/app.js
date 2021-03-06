var express = require('express'),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))

var fs = require('fs');
var _ = require('underscore');

var db = {
	jogadores: JSON.parse(fs.readFileSync(__dirname + "/data/jogadores.json")),
	jogosPorJogador: JSON.parse(fs.readFileSync(__dirname + "/data/jogosPorJogador.json"))
};

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');
app.set('view engine', 'hbs');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', 'server/views');

app.get('/', function (req, res) {
  res.render('index', db.jogadores);
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:id/', function (req, res) {

	jogador = _.find(db.jogadores.players, function(el) {
		return el.steamid === req.params.id;
	});

	var gamesPlayer = db.jogosPorJogador[req.params.id];

	let gamesNotPlayed = _.where(gamesPlayer.games, { playtime_forever: 0 });
  	gamesPlayer.jogosNaoJogados = gamesNotPlayed.length;

	gamesPlayer.games = _.sortBy(gamesPlayer.games, function(data) {
		return -data.playtime_forever;
	});

	gamesPlayer.games = _.first(gamesPlayer.games, 5);

	gamesPlayer.games = _.map(gamesPlayer.games, function(data) {

		var tempoHoras = Math.round(data.playtime_forever/60)
		data.playtime_forever_horas = tempoHoras;

		return data;
	});
  
	res.render('jogador', {
		profile: jogador,
		gameInfo: gamesPlayer,
		favorito: gamesPlayer[0]
	});
});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
let server = app.listen(3000, function () {
  console.log('Escutando em: http://localhost:3000');
});
