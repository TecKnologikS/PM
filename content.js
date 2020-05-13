
function createActions() {
	console.log('create commande');
	var lstListePillage = ["7821", "8171", "7269", "6989", "6979", "6817", "1651", "7263", "7254", "6822", "5805", "6805", "6804", "8164", "5850", "1019"];
	var commands = `if (document.getElementById('list%1%').querySelectorAll('.listContent')[0].classList.contains('hide')) { Travian.Game.RaidList.toggleList(%1%); };
		 $('#list%1% input:checkbox').not('.markAll').prop('checked', true);
    document.getElementById('list%1%').querySelector('button[type=\"submit\"]').click();`;
	var actions = [];
	for(var i = 0; i < lstListePillage.length; i++) {
		actions.push(commands.replace(/%1%/g, lstListePillage[i]));
	}
	chrome.storage.sync.set({"lstcommande":  JSON.stringify(actions)});
	run();
}

function currentTime() {
	console.log('current time');
		chrome.storage.sync.set({"lasttime":  Date.now()});
}

function launchCommande(commande) {
	console.log('launch commande');
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
	chrome.storage.sync.get("lasttime", function(result){
		if (undefined !== result.lasttime) {
			if (900000 < (Date.now() - result.lasttime)) {//900000
				createActions();
			} else {
				reloadAfterXTime(800  + Math.floor(Math.random() * 300))
			}
		} else {
			currentTime();
			createActions();
		}
	});
}

function run() {
	console.log("run");
	chrome.storage.sync.get("lstcommande", function(result){
		if (result.lstcommande) {
			var commandes = JSON.parse(result.lstcommande);
			if (commandes.length > 0) {
				var commande = commandes.shift();
				chrome.storage.sync.set({"lstcommande":  JSON.stringify(commandes)});
				currentTime();
				console.log((15 + Math.floor(Math.random() * 10)) * 1000);
				setTimeout(function() {
					launchCommande(commande)
				}, (15 + Math.floor(Math.random() * 10)) * 1000);
			} else {
				lastTime();
			}
		} else {
			lastTime();
		}
	});
}

window.addEventListener ("load", myMain, false);

function myMain (evt) {
           run();
}
