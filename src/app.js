
function $(id) {
	return document.getElementById(id);
}
function $$(selectors) {
	return document.querySelectorAll(selectors);
}
function $$$(url, callback) {
	var callbackMethod = 'callback_' + new Date().getTime();

	window[callbackMethod] = function (data) {
		delete window[callbackMethod];
		document.body.removeChild(script);
		callback(data);
	}

	var script = document.createElement('script');

	script.src = url + callbackMethod;
	
	try {
		document.body.appendChild(script);
	} catch {
		
	}
}
/**
 * Entry Point
 */
function app() {
	try { loadImages(); } catch (err) { console.log(err) }
	try { loadParticles(); } catch (err) { console.log(err) }
	try { loadPlanetside(); } catch (err) { console.log(err) }
}
/**
 * 
 */
function loadImages() {
	$$('img').forEach(function (tag) {
		var curImg = new Image();

		curImg.onload = function() {
			tag.src = tag.dataset.src;
		}
		
		curImg.src = tag.dataset.src;
	})
}
/**
 * 
 */
function loadParticles() {
	particlesJS('particles-js',	JSON.parse(config.particles));
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
    return buildPlanetsideApiUrl(`character/?name.first_lower=${username.toLowerCase().trim()}&c:resolve=item_full(name.en,description.en)`);
}
/**
 * @description
 * @param {*} userid 5428059164954198113
 */
function buildUserDeaths(userid) {
    return buildPlanetsideApiUrl(`characters_event_grouped/?character_id=${userid}&type=DEATH&c:tree=characters_event_grouped_list^character_id`);
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
function tidyMemberListCache () {
    var now = Date.now();

    var fiveMinsAgo = now - (5*60000);

    for (key in memberListCache) {
        if (memberListCache[key] < fiveMinsAgo) {
            delete memberListCache[key];
        }
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
	
	$$$(url, function (data) {
		if (!data || !data.outfit_list || data.outfit_list.length == 0) {
			result.classList.add('error');
			result.classList.remove('loading');
			return;
        }
            
        var now = Date.now();
        
        setTimeout(tidyMemberListCache, (5*60000));

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
        
        var nextUrl = buildUserDeaths(thatGuy);

	    $$$(nextUrl, function (data) {
            axilPointCache = data.characters_event_grouped_list[0];

            axilPointCache[thatGuy].count = 0;
            axilPointCache[thatGuy].count = Object.values(axilPointCache).map((c) => Number(c.count) ).reduce((a,c)=>{ if (c > a) { return c } else { return a } });
            axilPointCache[thatGuy].count += 1;

            $('TotalAxilPoints').innerText = calcAxilPoints(outfit_list.members.map(a => a.character_id));;
            $('TotalAxilPoints').className = null;
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

        $('footer').style.display = '';
        $('memberlist_results').style.display = 'none';
        // $('userdetail_results').style.display = 'none';
        $('footer_loading').style.display = '';

        var fiveMinsAgo = Date.now() - (5*60000);

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

        $('userdetail_results').style.display = 'none';
        // $('memberlist_results').style.display = 'none';
        $('footer_loading').style.display = '';
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
    var ranks = { };
    
    var outfit_list = data.outfit_list[0];

    var lastHour = Date.now() - (60*60000);
    
    var today = new Date();
    if (today.getHours() < 6) {
        today.setDate(today.getDate() - 1);
    }
    today.setHours(6,0,0,0);

    var week = new Date();
    week.setHours(0,0,0,0);
    week.setDate(week.getDate() - 7);

    var month = new Date();
    month.setHours(0,0,0,0);
    month.setMonth(month.getMonth() - 1);
    
    for (var i = 0; i < outfit_list.members.length; i++)
    {
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
                var lastActiveTime = new Date(lastActiveTimeUnixTimestamp*1000);

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
            rank['totalPrestige'] += member['prestige_level']*1;
        }

        if (member['battle_rank'] && member['battle_rank']['value']) {
            // probably need to add prestige_level*125 or 100
            rank['totalBattleRank'] += member['battle_rank']['value']*1;
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
        sums.average[i] = Math.round((sums.average[i]/sums.total.members)*100)/100;
    }

    return sums;
}
/**
 * 
 * @param {*} data 
 */
function renderMemberList(data) {
    var memberResults = $('member-tbody');
    
    // TODO: Use existing rows
    memberResults.innerHTML = '';

    if (data.outfit_list.length == 0) {
        var h2 = document.createElement("h2");
        h2.innerText = "Outfit not found";
        result.appendChild(h2);

        $('footer_loading').style.display = 'none';
        $('memberlist_results').style.display = '';
        
        return;
    }

    var now = Date.now();
    
    var lastHour = now - (60*60000);

    setTimeout(tidyMemberListCache, (5*60000));

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

        var td1 = document.createElement('td');
        td1.innerText = r;
        tr.appendChild(td1);

        for (var i in rank) {
            if (i == 'ordinal') { continue }
            var td = document.createElement('td');
            td.innerText = rank[i];
            if (i == 'name') { td.dataset.value = Number(rank['ordinal']) }
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
        $('outfit-axilpoints').innerText = calcAxilPoints(outfit_list.members.map(a => a.character_id));
    }

    for (var i = 0; i < outfit_list.members.length; i++)
    {
        var member = outfit_list.members[i];

        var tr = document.createElement('tr');

        var lastActiveTime = 0;

        if (member.times) {
            var lastActiveTimeUnixTimestamp = Math.max(member.times['last_login'], member.times['last_save']);
            lastActiveTime = new Date(lastActiveTimeUnixTimestamp*1000);
        }

        if (member.online_status && member.online_status > 0) {
            tr.classList.add('good');
            lastActiveTime = new Date();
        } else if (lastActiveTime > lastHour) {
            tr.classList.add('avg');
        }

        var td = document.createElement('td');
        if (member.name) td.innerText = member.name.first;
        tr.appendChild(td);

        td = document.createElement('td');
        if (member.battle_rank && member.battle_rank.value && member.prestige_level)
        {
            td.innerText = member.battle_rank.value + ' (' + member.prestige_level + ')';
            td.dataset.value = Number(member.battle_rank.value) + (Number(member.prestige_level) * 1000);
        }
        tr.appendChild(td);

        td = document.createElement('td');
        if (member.rank)
        {
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

    sort($('ranksort0'), 0);
    
    sort($('membersort4'), 4, -1);
    sort($('membersort2'), 2, -1);
    
    $('footer_loading').style.display = 'none';
    $('memberlist_results').style.display = '';

    if ($('userdetail_results').style.display != 'none' || screen.width <= 600) {
        $('memberlist_results').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

function formatTimeFromMins(mins) {
    if (mins < 60) {
        return `${mins} Minutes`;
    } else if (mins < 60*24) {
        return `${Math.round((mins/(60))*100)/100} Hours`;
    } else if (mins < 60*24*7) {
        return `${Math.round((mins/(60*24))*100)/100}} Days`;
    } else if (mins < 60*24*30) {
        return `${Math.round((mins/(60*24*7))*100)/100} Weeks`;
    } else if (mins < 60*24*365) {
        return `${Math.round((mins/(60*24*7))*100)/100} Months`;
    } else {
        return `${Math.round((mins/(60*24*7*12))*100)/100} Years`;
    }
}

function renderUserDetail(data) {
    if (data.character_list.length == 0) {
        $('footer_loading').style.display = 'none';
        $('error_results').style.display = '';
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
        $('userdetail-online').className = 'bad';
    }
    

    var items = character.items;

    $('userdetail_loadout').innerHTML = '';

    for (var rank in config.ranks)
    {
        var contain = document.createElement("div");
        $('userdetail_loadout').appendChild(contain);

        var h3 = document.createElement("h3");
        h3.innerText = rank;
        contain.appendChild(h3);

        var ul;
        var section;

        for (var index in config.ranks[rank])
        {
            var skill = config.ranks[rank][index];

            if (skill.section != section)
            {
                section = skill.section;

                var h4 = document.createElement("h4");
                h4.innerText = section;
                contain.appendChild(h4);
                
                ul = document.createElement("ul");
                contain.appendChild(ul);
            }

            var li = document.createElement("li");

            var hasSkill = false;

            for (var i = 0; i < items.length; i++)
            {
                if (skill.id && skill.id > 0)
                {
                    if (items[i].item_id == skill.id)
                    {
                        hasSkill = true;
                        break;
                    }
                }
                else if (items[i] && items[i].name)
                {
                    if (items[i].name.en == skill.name)
                    {
                        hasSkill = true;
                        break;
                    }
                }
            }

            li.innerText = skill.name;
            li.title = skill.id;

            if (hasSkill) {
                li.className = 'good';
            } else {
                li.className = 'bad';
            }

            ul.appendChild(li);
        }
    }
    
    $('footer_loading').style.display = 'none';
    $('userdetail_results').style.display = '';
    
    if (screen.width <= 600) {
        $('userdetail_results').scrollIntoView({ 
            behavior: 'smooth' 
        });
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

    if (table.dataset.sorted == col + '-') {
        alreadySorted = true;
        direction = 1;
        table.dataset.sorted = col + '+';
    } else if (table.dataset.sorted == col + '+') {
        alreadySorted = true;
        direction = -1;
        table.dataset.sorted = col + '-';
    } else {
        alreadySorted = false;
        direction = forceDirection || -1;

        if (direction == 1) {
            table.dataset.sorted = col + '+';
        } else {
            table.dataset.sorted = col + '-';
        }
    }

    var rows = tbody.getElementsByTagName('tr');

    var numeric = !isNaN(rows[0].children[col].innerText);

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var rowCol = row.children[col];
        var last = row;
        
        if (alreadySorted) {
            if (i < rows.length - 1) {
                row = rows[0];
                last = rows[rows.length - i];
            }
        } else {
            for (var c = i - 1; c >= 0; c--) {
                var compare = rows[c];
                var compareCol = compare.children[col];
                var ret = 0;

                if (rowCol.dataset.value) {
                    if (Number(rowCol.dataset.value) < Number(compareCol.dataset.value)) {
                        ret = direction;
                    }
                } else {
                    if (numeric) {
                        if (Number(rowCol.innerText) < Number(compareCol.innerText)) {
                            ret = direction;
                        }
                    } else {
                        ret = rowCol.innerText.localeCompare(compareCol.innerText);
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
