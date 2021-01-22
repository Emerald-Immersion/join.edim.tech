"use strict";

window.onerror = function (message, url, line, col, err) {
	console.log(message, url, line, col, err);
}

function $(id) {
	return document.getElementById(id);
}

function $$(selectors) {
	return document.querySelectorAll(selectors);
}

function $$$(url, callback, timeout) {
	var callbackMethod = 'callback';

	var callbackUrl = url + callbackMethod;

	if (window[callbackMethod]) {
		showWarning(null, 'There is currently a request in progress, please wait...');
		return;
	}

	var timeoutHandle = setTimeout(function () {
		delete window[callbackMethod];
		callback(null, new Error('Request Timeout'));
	}, timeout || 15000);

	window[callbackMethod] = function (data) {
		clearTimeout(timeoutHandle);
		delete window[callbackMethod];
		document.body.removeChild(script);
		callback(data);
	}

	var script = document.createElement('script');
	script.src = callbackUrl;

	try {
		document.body.appendChild(script);
	} catch (err) {
		clearTimeout(timeoutHandle);
		callback(null, err);
	}
}
/**
 * Entry Point
 */
function app() {
	try {
		loadTopBars();
	} catch (err) {
		console.log(err)
	}
	try {
		loadImages();
	} catch (err) {
		console.log(err)
	}
	try {
		loadParticles();
	} catch (err) {
		console.log(err)
	}
	try {
		loadPlanetside();
	} catch (err) {
		console.log(err)
	}

	if ('serviceWorker' in navigator) {
		console.log('CLIENT: service worker registration in progress.');
		navigator.serviceWorker.register('/app.sw.js').then(function () {
			console.log('CLIENT: service worker registration complete.');
		}, function (err) {
			console.log('CLIENT: service worker registration failure.');
			console.log(err);
		});
	} else {
		console.log('CLIENT: service worker is not supported.');
	}

	window.addEventListener('online', changeOnlineStatus);
	window.addEventListener('offline', changeOnlineStatus);

	setTimeout(tamperDetection, 2000);
}
/**
 * 
 */
function loadTopBars() {
	/*$$('top-bar').forEach(function (el) {
		if (el.id) {
			if (localStorage.getItem(`dismiss_${el.id}`) == 'true') {
				el.hide();
			}

			var button = document.createElement('div');
			button.innerText = 'dismiss';
			button.classList.add('button');
			button.onclick(function (e) {

			})
			el.appendChild(button);
		}
	})*/
}
/**
 * 
 */
function tamperDetection() {
	fetch('/', {
		method: 'GET',
		headers: {
			Accept: 'text/html',
		},
	}).then(function (res) {
		return res.text();
	}).then(function (str) {
		if (!str || str.length == 0) {
			throw 'Body empty';
		}

		var html = document.createElement('html');

		html.innerHTML = str;

		var originalHead = html.getElementsByTagName('head')[0];

		if (!document.head.isEqualNode(originalHead)) {
			var tampered = document.head.innerHTML.split(/[\r\n]+/);
			var originalLookup = str.split(/[\r\n]+/).reduce(function (a, c) {
				return (a[c] = '', a);
			}, {});

			var changed = [];

			for (var t of tampered) {
				if (!originalLookup[t]) {
					changed.push(t);
				}
			}

			console.log('Head has been tampered with:', changed);

			// document.head.innerHTML = originalHead.innerHTML;
		} else {
			console.log('Head has not been tampered with.');
		}
	}).catch(function (err) {
		console.log(err);
	})
}
/**
 * 
 */
function loadImages() {
	$$('img').forEach(function (tag) {
		var curImg = new Image();

		curImg.onload = function () {
			tag.src = tag.dataset.src;
		}

		curImg.src = tag.dataset.src;
	})
}
/**
 * 
 */
function loadParticles() {
	var fps = 60;

	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame;
	
	window.cancelAnimationFrame = window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame    ||
		window.oCancelRequestAnimationFrame      ||
		window.msCancelRequestAnimationFrame;
	
	window.requestAnimFrame = function (cb) {
		cb.timeoutHandle = setTimeout(function () {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(cb);
			} else {
				cb();
			}
		}, 1000 / fps);
	}
	
	window.cancelRequestAnimFrame = function (cb) {
		if (cb.timeoutHandle) {
			clearTimeout(cb.timeoutHandle);
		}
		window.cancelAnimationFrame(cb);
	}
	
	particlesJS('particles-js', JSON.parse(config.particles));
}
/**
 * 
 */
function buildPlanetsideApiUrl(call) {
	return `https://census.daybreakgames.com/get/ps2:v2/${call}&callback=`;
}
/**
 * 
 */
function buildOutfitListApiUrl(outfit) {
	return buildPlanetsideApiUrl(`outfit/?alias_lower=${outfit.toLowerCase().trim()}&c:resolve=member,member_online_status,member_character`);
}
/**
 * 
 */
function buildUserApiUrl(username) {
	return buildPlanetsideApiUrl(`character/?name.first_lower=${username.toLowerCase().trim()}&c:resolve=item`);
}
/**
 * @description
 * @param {*} userid 5428059164954198113
 */
function buildUserDeathsApiUrl(userid) {
	return buildPlanetsideApiUrl(`characters_event_grouped/?character_id=${userid}&type=DEATH&c:tree=characters_event_grouped_list^character_id`);
}
/** */
function changeOnlineStatus() {
	var online = navigator.onLine;

	if (online) {
		$('footer_information').style.display = 'none';
	} else {
		$('footer').style.display = '';
		$('footer_information').style.display = '';
		$('footer_information').innerText = 'You apppear to be offline, tools will only display cached content if available.';
	}
}
/**
 * 
 */
function showWarning(err, msg) {
	console.log(err);

	$('footer_warning_message').innerText = msg || 'There was a problem talking to the API, this could be either your connection, browser, or just DayBreak themselves.';
	$('footer_warning').style.display = '';
	$('footer_loading').style.display = 'none';
	$('footer').style.display = '';

	$('memberlist-submit').disabled = false;
	$('userdetail-submit').disabled = false;
}
/**
 * 
 */
function showError(err) {
	$('footer_error_message').innerText = err.message;
	$('footer_error_details').innerText = err.name + "\n" + new Date().toISOString() + "\n" + err.stack;

	$('footer_loading').style.display = 'none';
	$('footer_error').style.display = '';

	$('footer_error').scrollIntoView({
		behavior: 'smooth'
	});

	$('memberlist-submit').disabled = false;
	$('userdetail-submit').disabled = false;
}
/**
 * 
 */
function showData() {
	$('footer').style.display = '';
	$('footer_warning').style.display = 'none';
	$('footer_error').style.display = 'none';
	$('footer_loading').style.display = 'none';

	$('memberlist-submit').disabled = false;
	$('userdetail-submit').disabled = false;

}
/**
 * 
 */
var memberListCache = {};
var memberListActive = null;
var axilPointCache = null;
/**
 * 
 */
function tidyMemberListCache() {
	var expire = Date.now() - (1 * 60000);

	try {
		for (key in memberListCache) {
			if (memberListCache[key].updated < expire) {
				delete memberListCache[key];
			}
		}
	} catch (err) {
		console.log('Cache cleanup error', err);
	}
}
/**
 * 
 */
function loadPlanetside() {
	var url = buildOutfitListApiUrl('edim');

	var result = $('planetside-result');

	$('ActiveLeaders').innerText = '';
	$('ActiveMembersNow').innerText = '';
	$('ActiveMembersToday').innerText = '';
	$('ActiveMembersWeek').innerText = '';
	$('ActiveMembersMonth').innerText = '';
	$('TotalPrestige').innerText = '';
	$('TotalBattleRank').innerText = '';

	result.classList.remove('error');
	result.classList.add('loading');

	$$$(url, function (data, err) {
		if (err || !data || !data.outfit_list || !data.outfit_list.length || data.outfit_list.length == 0) {
			showWarning(err);
			result.classList.remove('loading');
			result.classList.add('error');
			return;
		}

		var now = Date.now();

		setTimeout(tidyMemberListCache, (5 * 60000));

		var outfit_list = data.outfit_list[0];

		memberListCache[outfit_list['alias_lower']] = {
			updated: now,
			data: data
		}

		var ranks = calcMemberRanks(data);
		var rankSums = sumMemberRanks(ranks);

		$('ActiveLeaders').innerText = rankSums.total.activeLeaders;
		$('ActiveMembersNow').innerText = rankSums.total.activeNow;
		$('ActiveMembersToday').innerText = rankSums.total.activeToday;
		$('ActiveMembersWeek').innerText = rankSums.total.activeWeek;
		$('ActiveMembersMonth').innerText = rankSums.total.activeMonth;
		$('TotalMembers').innerText = rankSums.total.members;
		$('TotalPrestige').innerText = rankSums.total.totalPrestige;
		$('TotalBattleRank').innerText = rankSums.total.totalBattleRank;
		$('AvgBattleRank').innerText = rankSums.average.totalBattleRank;

		$('TotalAxilPoints').className = 'loading';

		var thatGuy = '5428059164954198113';

		var nextUrl = buildUserDeathsApiUrl(thatGuy);

		$$$(nextUrl, function (data, err) {
			if (err) {
				showWarning(err);
				$('TotalAxilPoints').classList.remove('loading');
				$('TotalAxilPoints').classList.add('error');
				return;
			}

			if (!data || !data.characters_event_grouped_list || !data.characters_event_grouped_list.length || data.characters_event_grouped_list.length != 1) {
				showWarning(data, 'Either the subject of Axil Points has been deleted (small mercy), or there was an error.');
				$('TotalAxilPoints').classList.remove('loading');
				$('TotalAxilPoints').classList.add('error');
				return;
			}

			try {
				axilPointCache = data.characters_event_grouped_list[0];

				axilPointCache[thatGuy].count = 0;
				axilPointCache[thatGuy].count = Object.values(axilPointCache).map(function (c) {
					return Number(c.count)
				}).reduce(function (a, c) {
					if (c > a) {
						return c
					} else {
						return a
					}
				});
				axilPointCache[thatGuy].count += 1;

				// var total = Object.values(axilPointCache).map(function (c) { return Number(c.count); }).reduce(function (a,c) { return a+c; });
				var current = calcAxilPoints(outfit_list.members.map(function (a) {
					return a.character_id;
				}));

				$('TotalAxilPoints').innerText = current;
				$('TotalAxilPoints').className = null;

				$('memberlist-submit').disabled = false;
				$('userdetail-submit').disabled = false;
			} catch (e) {
				showError(e);
			}
		})

		result.classList.remove('loading');
	});
}
/**
 * 
 */
function memberlistSubmit() {
	try {
		var outfitalias = $('outfitalias').value;

		var url = buildOutfitListApiUrl(outfitalias);

		$('memberlist-submit').disabled = true;
		$('userdetail-submit').disabled = true;

		$('footer_loading').style.display = '';
		$('footer_warning').style.display = 'none';
		$('footer_error').style.display = 'none';
		$('memberlist_results').style.display = 'none';
		// $('userdetail_results').style.display = 'none';
		$('footer').style.display = '';

		var fiveMinsAgo = Date.now() - (5 * 60000);

		if (memberListActive != outfitalias && memberListCache[outfitalias] && memberListCache[outfitalias].updated > fiveMinsAgo) {
			renderMemberList(memberListCache[outfitalias].data);
		} else {
			$$$(url, renderMemberList);
		}
	} catch (err) {
		console.log(err);
	}

	return false;
}
/**
 * 
 */
function userdetailSubmit() {
	try {
		var username = $('username').value;

		var url = buildUserApiUrl(username);

		$('memberlist-submit').disabled = true;
		$('userdetail-submit').disabled = true;

		$('footer_loading').style.display = '';
		$('footer_warning').style.display = 'none';
		$('footer_error').style.display = 'none';
		$('userdetail_results').style.display = 'none';
		// $('memberlist_results').style.display = 'none';
		$('footer').style.display = '';

		$$$(url, renderUserDetail);
	} catch (err) {
		console.log(err);
	}

	return false;
}
/**
 * 
 */
function calcAxilPoints(members) {
	var total = 0;

	if (axilPointCache) {
		for (var earner of members) {
			if (axilPointCache[earner]) {
				total += Number(axilPointCache[earner].count);
			}
		}
	}

	return total;
}
/**
 * 
 * @param {*} data 
 */
function calcMemberRanks(data) {
	var ranks = {};

	var outfit_list = data.outfit_list[0];

	var lastHour = Date.now() - (60 * 60000);

	var today = new Date();
	if (today.getHours() < 6) {
		today.setDate(today.getDate() - 1);
	}
	today.setHours(6, 0, 0, 0);

	var week = new Date();
	week.setHours(0, 0, 0, 0);
	week.setDate(week.getDate() - 7);

	var month = new Date();
	month.setHours(0, 0, 0, 0);
	month.setMonth(month.getMonth() - 1);

	for (var i = 0; i < outfit_list.members.length; i++) {
		var member = outfit_list.members[i];

		if (!member['rank']) {
			continue;
		}

		var rankName = member['rank'];

		if (!ranks[rankName]) {
			ranks[rankName] = {
				'ordinal': member['rank_ordinal_merged'],
				'members': 0,
				'activeNow': 0,
				'activeToday': 0,
				'activeWeek': 0,
				'activeMonth': 0,
				'totalBattleRank': 0,
				'totalPrestige': 0
			}
		}

		var rank = ranks[rankName];

		rank['members']++;

		var times = member['times'];

		if (times) {
			var lastActiveTimeUnixTimestamp = Math.max(times['last_login'], times['last_save']);

			if (lastActiveTimeUnixTimestamp) {
				var lastActiveTime = new Date(lastActiveTimeUnixTimestamp * 1000);

				if (lastActiveTime > lastHour || member['online_status'] != 0) {
					rank['activeNow']++;
				}

				if (lastActiveTime > today) {
					rank['activeToday']++;
				}

				if (lastActiveTime > week) {
					rank['activeWeek']++;
				}

				if (lastActiveTime > month) {
					rank['activeMonth']++;
				}
			}
		}

		if (member['prestige_level']) {
			rank['totalPrestige'] += member['prestige_level'] * 1;
		}

		if (member['battle_rank'] && member['battle_rank']['value']) {
			// probably need to add prestige_level*125 or 100
			rank['totalBattleRank'] += member['battle_rank']['value'] * 1;
		}
	}

	return ranks;
}
/**
 * 
 * @param {*} ranks 
 */
function sumMemberRanks(ranks) {
	let sums = {
		total: {
			'members': 0,
			'activeLeaders': 0,
			'activeNow': 0,
			'activeToday': 0,
			'activeWeek': 0,
			'activeMonth': 0,
			'totalBattleRank': 0,
			'totalPrestige': 0
		},
		average: {
			'totalBattleRank': 0,
			'totalPrestige': 0
		}
	}

	for (var r in ranks) {
		var rank = ranks[r];

		if (rank['ordinal'] < 3) {
			if (rank['activeMonth'] != '') {
				sums.total.activeLeaders += rank['activeMonth'];
			}
		}

		for (var i in sums.total) {
			if (rank[i]) {
				sums.total[i] += rank[i];

				if (sums.average[i] != undefined) {
					sums.average[i] += rank[i];
				}
			}
		}
	}

	for (var i in sums.average) {
		sums.average[i] = Math.round((sums.average[i] / sums.total.members) * 100) / 100;
	}

	return sums;
}
/**
 * 
 * @param {*} data 
 */
function renderMemberList(data, err) {
	try {
		if (err) {
			showWarning(err);
			return
		}

		if (!data || !data.outfit_list || data.outfit_list.length == 0) {
			showWarning(data, 'Outfit not found');
			return;
		}

		var now = Date.now();

		var lastHour = now - (60 * 60000);

		setTimeout(tidyMemberListCache, (5 * 60000));

		var outfit_list = data.outfit_list[0];

		memberListCache[outfit_list['alias_lower']] = {
			updated: now,
			data: data
		}
		memberListActive = outfit_list['alias_lower'];

		$('outfit-name').innerText = outfit_list['name'];
		$('outfit-created').innerText = outfit_list['time_created_date'];
		$('outfit-members').innerText = outfit_list['member_count'];

		var ranks = calcMemberRanks(data);

		var rankResults = $('rank-tbody');
		rankResults.innerHTML = '';

		for (var r in ranks) {
			var rank = ranks[r];

			var tr = document.createElement('tr');

			var td = document.createElement('td');
			td.innerText = r;
			td.dataset.value = rank['ordinal'];
			tr.appendChild(td);

			for (var i in rank) {
				if (i == 'ordinal') {
					continue
				}
				td = document.createElement('td');
				td.innerText = rank[i];
				tr.appendChild(td);
			}

			rankResults.appendChild(tr);
		}

		var rankSums = sumMemberRanks(ranks);

		$('outfit-active-now').innerText = rankSums.total['activeNow'];
		$('outfit-active-today').innerText = rankSums.total['activeToday'];
		$('outfit-active-week').innerText = rankSums.total['activeWeek'];
		$('outfit-active-month').innerText = rankSums.total['activeMonth'];
		$('outfit-total-battlerank').innerText = rankSums.total['totalBattleRank'];
		$('outfit-total-prestige').innerText = rankSums.total['totalPrestige'];
		$('outfit-average-prestige').innerText = rankSums.average['totalPrestige'];
		$('outfit-average-battlerank').innerText = rankSums.average['totalBattleRank'];

		if (axilPointCache) {
			$('outfit-axilpoints').innerText = calcAxilPoints(outfit_list.members.map(function (a) {
				return a.character_id;
			}));
		}

		var memberResults = $('member-tbody');

		// TODO: Use existing rows
		memberResults.innerHTML = '';

		for (var i = 0; i < outfit_list.members.length; i++) {
			var member = outfit_list.members[i];

			var tr = document.createElement('tr');

			var lastActiveTime = new Date(0);

			if (member.times) {
				var lastActiveTimeUnixTimestamp = Math.max(member.times['last_login'], member.times['last_save']);
				lastActiveTime = new Date(lastActiveTimeUnixTimestamp * 1000);
			}

			if (member.online_status && member.online_status > 0) {
				tr.classList.add('good');
				lastActiveTime = new Date();
			} else if (lastActiveTime > lastHour) {
				tr.classList.add('avg');
			}

			var td = document.createElement('td');
			if (member.name) {
				td.innerText = member.name.first;

				// TODO: Perhaps use span and use offsetWidth or something
				var upperCount = (member.name.first.match(/[A-Z]/g) || []).length

				if (member.name.first.length > 12 || upperCount > 8) {
					td.dataset.tooltip = member.name.first;
				}

				td.onclick = pickOutfitMember;
			}
			tr.appendChild(td);

			td = document.createElement('td');
			if (member.battle_rank && member.battle_rank.value && member.prestige_level) {
				td.innerText = member.battle_rank.value + ' (' + member.prestige_level + ')';
				td.dataset.value = Number(member.battle_rank.value) + (Number(member.prestige_level) * 1000);
			}
			tr.appendChild(td);

			td = document.createElement('td');
			if (member.rank) {
				td.innerText = member.rank;
				td.dataset.value = member.rank_ordinal;
			}
			tr.appendChild(td);

			td = document.createElement('td');
			td.innerText = calcAxilPoints([member.character_id]);
			tr.appendChild(td);

			td = document.createElement('td');
			if (member.member_since_date) {
				td.innerText = member.member_since_date.substring(0, 10);
				td.dataset.tooltip = member.member_since_date;
			}
			tr.appendChild(td);

			td = document.createElement('td');

			var str = lastActiveTime.toISOString()

			td.innerText = str.substring(0, 10);
			td.dataset.tooltip = str;

			tr.appendChild(td);

			memberResults.appendChild(tr);
		}

		sort($('ranksort0'));

		sort($('membersort4'));
		sort($('membersort2'));

		$('memberlist_results').style.display = '';
		showData();

		if ($('userdetail_results').style.display != 'none' || screen.width <= 600) {
			$('memberlist_results').scrollIntoView({
				behavior: 'smooth'
			});
		}
	} catch (e) {
		showError(e);
	}
}
/**
 * 
 * @param {Number} mins 
 */
function formatTimeFromMins(mins) {
	var m = Number(mins);
	var s = null;

	if (m < 60) {
		s = 'Minutes';
	} else {
		m /= 60;
		if (m < 24) {
			s = 'Hours';
		} else {
			m /= 24;
			if (m < 7) {
				s = 'Days';
			} else {
				m /= 7;
				if (m < 4.345) {
					s = 'Weeks';
				} else {
					m /= 4.345;
					if (m < 12) {
						s = 'Months';
					} else {
						m /= 12;
						s = 'Years';
					}
				}
			}
		}
	}

	return `${Math.round(m*100)/100} ${s}`;
}

function pickOutfitMember(e) {
	$('username').value = e.srcElement.innerText;

	$('username').parentElement.parentElement.parentElement.scrollIntoView({
		behavior: 'smooth'
	});

	return userdetailSubmit();
}

function renderUserDetail(data, err) {
	try {
		if (err) {
			showWarning(err);
			return
		}

		if (!data || !data.character_list || !data.character_list.length || data.character_list.length == 0) {
			showWarning(data, 'Player not found');
			return;
		}

		var character = data.character_list[0];

		$('userdetail-name').innerText = character.name.first;
		$('userdetail-rank').innerText = character.battle_rank.value + '.' + character.battle_rank.percent_to_next;
		$('userdetail-totaltime').innerText = formatTimeFromMins(character.times.minutes_played);
		$('userdetail-creation').innerText = character.times.creation_date;
		$('userdetail-lastlogon').innerText = character.times.last_login_date;
		$('userdetail-lastsave').innerText = character.times.last_save_date;
		$('userdetail-totalitems').innerText = character.items.length;
		$('userdetail-axilpoints').innerText = calcAxilPoints([character.character_id]);

		if (character.online_status > 0) {
			$('userdetail-online').innerText = 'Yes';
			$('userdetail-online').className = 'good';
		} else {
			$('userdetail-online').innerText = 'No';
			$('userdetail-online').className = null;
		}

		var items = character.items.reduce(function (p, c) {
			var id = Number(c.item_id);
			delete c.item_id;
			p[id] = c;
			return p;
		}, {});

		$('userdetail_loadout').innerHTML = '';

		for (var rankName in config.ranks) {
			var rank = config.ranks[rankName];

			var contain = document.createElement("div");
			$('userdetail_loadout').appendChild(contain);

			var h3 = document.createElement("h3");
			h3.innerText = rankName;
			contain.appendChild(h3);

			for (var groupName in rank) {
				var h4 = document.createElement("h4");
				h4.innerText = groupName;
				contain.appendChild(h4);

				var ul = document.createElement("ul");
				ul.classList.add('float');
				contain.appendChild(ul);

				for (var item of rank[groupName]) {
					var li = document.createElement("li");

					li.innerText = item.name;

					if (item.tooltip) {
						li.dataset.tooltip = item.tooltip;
					}

					var hasSkill = false;

					if (Array.isArray(item.id)) {
						for (var id of item.id) {
							if (items[id]) {
								hasSkill = true;
								break;
							}
						}
					} else {
						if (items[item.id]) {
							if (item.stack_count) {
								if (item.stack_count == items[item.id].stack_count) {
									hasSkill = true;
								}
							} else {
								hasSkill = true;
							}
						}
					}

					if (hasSkill) {
						li.className = 'good';
					} else {
						li.className = 'bad';
					}

					ul.appendChild(li);
				}
			}
		}

		$('userdetail_results').style.display = '';
		showData();

		if (screen.width <= 600) {
			$('userdetail_results').scrollIntoView({
				behavior: 'smooth'
			});
		}
	} catch (e) {
		showError(e);
	}
}
/**
 * @description Sorts a HTML table tbody elements based on a column.
 * @param {HTMLElement} e th or td element
 * @param {bool} forceDirection 1 for ascending, -1 for descending (default)
 */
function sort(e, forceDirection) {
	var col = Array.prototype.indexOf.call(e.parentNode.children, e);

	var table = e.parentElement.parentElement.parentElement;

	if (table.tagName != 'TABLE') {
		return;
	}

	var tbody = table.getElementsByTagName('tbody')[0];

	if (!tbody) {
		return;
	}

	var alreadySorted = false;
	var direction = 0;

	if (table.dataset.sorted == col + '-') {
		alreadySorted = true;
		direction = 1;
	} else if (table.dataset.sorted == col + '+') {
		alreadySorted = true;
		direction = -1;
	} else {
		alreadySorted = false;
		direction = forceDirection || -1;
	}

	if (direction == 1) {
		table.dataset.sorted = col + '+';
	} else {
		table.dataset.sorted = col + '-';
	}

	var rows = tbody.getElementsByTagName('tr');

	var numeric = !isNaN(rows[0].children[col].innerText);

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var cell = row.children[col];
		var last = row;

		if (alreadySorted) {
			if (i < rows.length - 1) {
				row = rows[0];
				last = rows[rows.length - i];
			}
		} else {
			for (var c = i - 1; c >= 0; c--) {
				var compare = rows[c];
				var compareCell = compare.children[col];
				var ret = 0;

				if (cell.dataset.value) {
					if (Number(cell.dataset.value) < Number(compareCell.dataset.value)) {
						ret = direction;
					}
				} else {
					if (numeric) {
						if (Number(cell.innerText) < Number(compareCell.innerText)) {
							ret = direction;
						}
					} else {
						ret = cell.innerText.localeCompare(compareCell.innerText);
					}
				}

				if (ret == direction) {
					last = compare;
				} else {
					break;
				}
			}
		}

		if (row != last) {
			tbody.insertBefore(row, last);
			// new, existing
		}
	}
}

this.addEventListener('load', app);