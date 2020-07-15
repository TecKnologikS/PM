
function createActions() {
	console.log('create commande');
	chrome.storage.local.get("lists", function(result){
	  var lstListePillage = JSON.parse(result.lists);
		var commands = `if (document.getElementById('list%1%').querySelectorAll('.listContent')[0].classList.contains('hide')) { Travian.Game.RaidList.toggleList(%1%); };
			setTimeout(function() {
				$('#list%1% input:checkbox').not('.markAll').prop('checked', true);
				document.getElementById('list%1%').querySelector('button[type=\"submit\"]').click();
			}, 2000);`;
		var actions = [];
		for(var i = 0; i < lstListePillage.length; i++) {
			actions.push(commands.replace(/%1%/g, lstListePillage[i].id));
		}
		chrome.storage.local.set({"lstcommande":  JSON.stringify(actions)});
		console.log("create");
		run();
	});
}

function currentTime() {
	console.log('current time');
	chrome.storage.local.set({"lasttime":  Date.now()});
}

function launchCommande(commande) {
	console.log('launch commande', commande);
	var script = document.createElement('script');
	script.textContent = commande;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

function reloadAfterXTime(time) {
	console.log("reload " + time);
	setTimeout(reload, time*1000);
}

function reload() {
		window.location.href = window.location.href
}

function lastTime() {
	console.log("lastime");
	chrome.storage.local.get("lists", function(result){
		console.log(result);
		if(result.lists) {
			var lists = JSON.parse(result.lists);
			console.log(lists.length);
			if (lists.length > 0) {
				chrome.storage.local.get("lasttime", function(result){
					chrome.storage.local.get("auto", function(result){
						if(result.auto) {
							currentTime();
							createActions();
						}
					});
					//if (undefined !== result.lasttime) {
					//	if (750000 < (Date.now() - result.lasttime)) {//900000
					//		createActions();
					//	} else {
					//		reloadAfterXTime(650  + Math.floor(Math.random() * 300))
					//	}
					//} else {
					//	currentTime();
					//	createActions();
					//}
				});
			}
		}
	});
}

function run() {
	console.log("run");
	chrome.storage.local.get("lstcommande", function(result){console.log("test", result);
		if (result.lstcommande) {console.log("lstcommande 1", result.lstcommande);
			var commandes = JSON.parse(result.lstcommande);
			console.log("lstcommande_ok", commandes, commandes.length);
			if (commandes.length > 0) {
				console.log("lstcommande_sup0_ok");
				var commande = commandes.shift();
				chrome.storage.local.set({"lstcommande":  JSON.stringify(commandes)});
				currentTime();
				setTimeout(function() {
					launchCommande(commande)
				}, (15 + Math.floor(Math.random() * 10)) * 1000);
			} else {
				console.log("lstcommande_sup0_nok");
				lastTime();
			}
		} else {
			console.log("lstcommande_nok");
			lastTime();
		}
	});
}

window.addEventListener ("load", myMain, false);

function myMain (evt) {
           run();
}
