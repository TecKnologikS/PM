var pillageList = [];
var lists = [];

chrome.storage.local.get("lists", function(result){
  if(result.lists)
    lists = JSON.parse(result.lists);
  showList();
});

chrome.storage.local.get("auto", function(result){
  if(result.auto) {
    document.getElementById('fullauto').checked = result.auto;
  }
});

function createList(lstVillage) {
  pillageList = [];

  for (var i = 0; i  < lstVillage.length; i++) {
    var pillage = {};

    pillage.x = lstVillage[i].split('|')[0].replace(/[^\d|\.\-]/g,'') + "";
    pillage.y = lstVillage[i].split('|')[1].replace(/[^\d|\.\-]/g,'') + "";

    pillageList.push(pillage);
  }
  chrome.storage.local.set({"list":  JSON.stringify(pillageList)});
}

function deleteList(id) {
  lists = lists.filter(list => list.id !== id);
  showList();
  chrome.storage.local.set({"lists":  JSON.stringify(lists)});
}

function showList() {
  var listUL = document.getElementById('listPillageList');
  listUL.innerHTML = "";
  lists.forEach(list => {
    var li = document.createElement('li'); // is a node
    li.innerHTML = list.name + "<button class='deleteIt' data-id='" + list.id + "'>X</button>";
    listUL.appendChild(li);
  });
}

function showListAvailable() {
  var codeJS = `
  (function getList() {
    var lstList=[];
    var lst = document.getElementsByClassName('listEntry');
    for (var i = 0; i< lst.length; i++) {
      lstList.push([lst[i].id.replace('list', ''), lst[i].getElementsByClassName('listTitleText')[0].innerText]);
    }
    return lstList;
  })()
  `;
  chrome.tabs.executeScript( null,
                            {code:codeJS},
          function(results){
            if (results[0].length > 0) {
              for (var i = 0; i < results[0].length; i++) {
                   liste = document.getElementById('selectList');
                  liste.options[liste.options.length] = new Option(results[0][i][1], results[0][i][0]);
          }}}
  );
}

function resetIt() {
  var actions = [];
  lists = [];
	chrome.storage.local.set({"lstcommande":  JSON.stringify(actions)});
	chrome.storage.local.set({"lists":  JSON.stringify(lists)});
  chrome.storage.local.set({"auto":  false});
}

function startIt() {
  var commands = `if (document.getElementById('list%1%').querySelectorAll('.listContent')[0].classList.contains('hide')) { Travian.Game.RaidList.toggleList(%1%); };
    setTimeout(function() {
      $('#list%1% input:checkbox').not('.markAll').prop('checked', true);
      document.getElementById('list%1%').querySelector('button[type=\"submit\"]').click();
    }, 2000);`;
	var actions = [];
	for(var i = 0; i < lists.length; i++) {
		actions.push(commands.replace(/%1%/g, lists[i].id));
	}
	chrome.storage.local.set({"lstcommande":  JSON.stringify(actions)});
  chrome.storage.local.set({"auto":  document.getElementById('fullauto').checked});
  console.log(document.getElementById('fullauto').checked);
}

document.addEventListener('DOMContentLoaded', function() {
  showListAvailable();
  var addItButton = document.getElementById('addIt');
  var resetButton = document.getElementById('resetIt');
  var reloadButton = document.getElementById('reloadIt');
  var addAllButton = document.getElementById('addALL');
  var list = document.getElementById('selectList');

  /////// SAVE
  addItButton.addEventListener('click', function() {
    var exist = false;
    lists.forEach(item => {
      if (item.id === list.value)
        exist = true;
    });

    if(!exist){
      var pillage = {};
      pillage.id = list.value;
      pillage.name = list.options[list.selectedIndex].text;
      lists.push(pillage);
      showList();

      chrome.storage.local.set({"lists":  JSON.stringify(lists)});
    }
  }, false);

  addAllButton.addEventListener('click', function() {
    lists = [];

    for(var i = 0; i < list.options.length; i++) {
      var pillage = {};
      pillage.id    = list.options[i].value;
      pillage.name  = list.options[i].text;
      lists.push(pillage);
    }

    showList();
    chrome.storage.local.set({"lists":  JSON.stringify(lists)});
  }, false);

  resetButton.addEventListener('click', function() {
    resetIt();
    chrome.tabs.reload();
  }, false);

  reloadButton.addEventListener('click', function() {
    startIt();
    chrome.tabs.reload();
  }, false);


  document.body.addEventListener('click', function (evt) {
      if (evt.target.className === 'deleteIt') {
        deleteList(evt.target.dataset.id);
      }
  }, false);
}, false);
