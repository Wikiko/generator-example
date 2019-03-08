// interpretador de generators.
function genRunner(generator){
    const iterator = generator(resume);
    function resume(error, callbackValue){
		if(error){
			iterator.throw(error);
        } else {
        	iterator.next(callbackValue);
        }
    }
    iterator.next();
}

// exemplo de uso
genRunner(function*(resume){
	console.log('antes');
    yield setTimeout(resume, 2000);
	console.log('depois');
});

function teste(callback){
	setTimeout(() => callback(Error('nossa'), null), 2000);
}

// exemplo de lançar exception... fata o try catch
genRunner(function*(resume){
	console.log('antes');
    yield teste(resume);
	console.log('depois');
});

function getCep(cep, callback){
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
	.then(response => response.json())
	.then(cepJson => callback(null, cepJson))
	.catch(err => callback(err, null));
}

//exemplo de uso para requisições e outras ações assincronas.
genRunner(function*(resume){
    const cep = yield getCep('01001000', resume);
	console.log(cep);
})

//exemplo de loop para fazer as requests sequenciais.
function getCeps(arrayOfCeps, callback){
    genRunner(function* (resume){
        var ceps = arrayOfCeps;
        var cepsJson = [];

        for(var i = 0; cep = ceps[i], i < ceps.length; i++){
            cepsJson.push(yield getCep(cep, resume));
        }

        callback(cepsJson);
	});
}