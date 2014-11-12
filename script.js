var r;

$(document).ready(function() {
	findMostEffectiveSpell();
});

var findMostEffectiveSpell = function() {
	var API_key = "82e1d9e7-6d06-4345-b3ac-bcad6b8e4bbf";
	var request_URL =
		"https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells&api_key="
		+ API_key;

	$.get(request_URL, function(response) {
		r = response.data;
		showTooltipsNotHavingDamageKeywordsBeforeDamage(response.data);
	}).fail(function(jqxhr) {
	    var response = $.parseJSON(jqxhr.responseText);
	    alert("API query failed. Perhaps an incorrect API Key?");
  	});

};

var doStuff = function(data) {
	var abilitypower = 200;
	var attackdamage = 200;
	var cooldownreduction = 15; // In percent, max 40%

	var spellDamage_byChampion = [];

	$("#content").html(JSON.stringify(data, null, 4));
	for(var champ in data) {
		var champData = data.champ;

		var champSpellDamage = {};
		champSpellDamage.champion = champData.name;
		champSpellDamage.AP = abilitypower;
		champSpellDamage.AD = attackdamage;
		champSpellDamage.CDR = cooldownreduction;

		var Q = champData.spells[0];
		// Q_dmg = Q.effect[1][Q.maxrank-1] + 
		//For now, only scale with ad/ap/cdr, nothing else.




		spellDamage_byChampion.append(champSpellDamage);

	}
};

var showScaleFactors = function(data) {
	// $("#content").html(JSON.stringify(data, null, 4));
	results = {};

	for(var champ in data) {
		// console.log(champ);
		var champSpells = data[champ]["spells"];
		// console.log(champSpells);
		// console.log(champSpells);

		var scalings = [];

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			// console.log(spell);


			var vars = spell.vars;

			if(vars) {

				for(var v = 0; v < vars.length; v++) {
					var q = vars[v]["link"];
					if(["bonusattackdamage","spelldamage","attackdamage","bonushealth","armor"].indexOf(q) < 0) {
						scalings[scalings.length] = q;
					}
				}

				results[champ] = scalings;
			}
		}


	}

	$("#content").html(JSON.stringify(results, null, 4));
}

var showSanitizedTooltips = function(data) {
	results = {};

	var results = "<ul>";
	for(var champ in data) {
		// console.log(champ);
		var champSpells = data[champ]["spells"];
		// console.log(champSpells);
		// console.log(champSpells);

		

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			// console.log(spell);


			var sanitizedTooltip = spell.sanitizedTooltip;

			// results[champ + "" + s] = sanitizedTooltip;
			results += "<li>" + sanitizedTooltip + "</li>";
			
		}

	results += "</li>";


	}

	$("#content").html(results);

}

var showLevelUpScalings = function(data) {
	results = {};

	var results = "<ul>";
	for(var champ in data) {
		// console.log(champ);
		var champSpells = data[champ]["spells"];
		// console.log(champSpells);
		// console.log(champSpells);

		

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			// console.log(spell);


			var label = spell.leveltip.label;

			var spellLetter = "R";
			if(s === 0) {
				spellLetter = "Q";
			} else if(s === 1) {
				spellLetter = "W";
			} else if(s === 2) {
				spellLetter = "E";
			}

			//if the spell mentions damage in its sanitized description...
			if(spell.sanitizedTooltip.toLowerCase().indexOf("damage") >= 0) {

				//if the spell does not have 'damamge' in its level scalings labels...
				// if(damageNotInScalings(spell.leveltip.label)) {
				if(true) {
					results += "<li>" + champ + " " + spellLetter + ": " + label + "</li>";
				}
			}

			
		}

	results += "</li>";


	}

	$("#content").html(results);
}

var damageNotInScalings = function(labels) {
	var hasDamage = false;
	for(var i = 0; i < labels.length; i++) {
		if(labels[i].toLowerCase().indexOf("damage") >= 0) {
			hasDamage = true;
		}
	}
	return !hasDamage;
}

var showTooltipsNotHavingDamageKeywordsBeforeDamage = function(data) {
	results = {};

	var numZero = 0;
	var numValid = 0;

	var results = "<ol>";
	for(var champ in data) {
		// console.log(champ);
		var champSpells = data[champ]["spells"];
		// console.log(champSpells);
		// console.log(champSpells);

		

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			// console.log(spell);


			var tooltip = spell.sanitizedTooltip;

			var keywords = ["afflicts","cleaves","damaging","shoots","slicing","take","takes","taking","deal","deals","dealt","dealing","does","doing","suffer"];
			var keywords_withSquiggle = [];
			for(var k in keywords) {
				keywords_withSquiggle[k] = keywords[k] + " {{";
			}
			

			var spellLetter = "R";
			if(s === 0) {
				spellLetter = "Q";
			} else if(s === 1) {
				spellLetter = "W";
			} else if(s === 2) {
				spellLetter = "E";
			} else if(s === 4) {
				spellLetter = "Q2";
			} else if(s === 5) {
				spellLetter = "W2";
			} else if(s === 6) {
				spellLetter = "E2";
			} else if(s === 7) {
				spellLetter = "R2";
			}

			//if the spell mentions damage in its sanitized description, or it's in negatives list...
			if((trueNegative(data[champ]["name"], s) || (hasDamageKeyword(keywords,tooltip) && notFalsePositive(data[champ]["name"], s)))) {
				numValid += 1;

				results += "<li>" + champ + " " + spellLetter + ": " + tooltip + "</li>";
				var parsedDamageText = getPortion(keywords,tooltip);
				parsedDamageText = removeReducedDamageTokens(parsedDamageText);

				var damage = parseDamage(data[champ]["name"], s, parsedDamageText);




				results += "<li> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + champ + " " + spellLetter + ": " + parsedDamageText + "</li>";

				



				if(parsedDamageText.length === 0) {
					numZero += 1;
					var alternateD
					console.log("Champ: " + data[champ]["name"] + ", spell: " + s);
					results += "<li><h1> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + champ + " " + spellLetter + ": " + parsedDamageText + "</h1></li>";
				}

				
			}

			
		}

	results += "</li>";


	}
	console.log("numZero is " + numZero);
	console.log("numValid is " + numValid);
	$("#content").html(results);
}

var hasDamageKeyword = function(keywords, tooltip) {
	for(var i = 0; i < keywords.length; i++) {
		if(tooltip.toLowerCase().indexOf(keywords[i] + " ") >= 0) {
			return true;
		}
	}
	return false;
}

var getPortion = function(keywords, tooltip) {
	var tooltip = tooltip.toLowerCase();

	var results = [];

	for(var k in keywords) {
		var key = keywords[k];
		var regex = new RegExp("("+key+" )([A-Za-z0-9:.;()\\[\\]\\+]+ ){0,5}([{(]+ )([(plus)eaf0-9().%{} \\+]*)([)}%]+ )(['%A-Za-z0-9:.;()\\[\\]\\+]+ ){0,12}(damage)", "g"); 
		var matches = tooltip.match(regex);
		if(matches && matches.length) {
			results = results.concat(matches);
		}
	}

	return results;
}

var parseDamage = function(champName, spellNumber, parsedTexts) {
	if(!parsedTexts || !parsedTexts.length) {
		return -1;
	}

	for(var i in parsedTexts) {
		var text = parsedTexts[i];
	}
	return 0;
}

var removeReducedDamageTokens = function(matches) {
	for(var i in matches) {
		if(matches[i].indexOf("reduced") >= 0 || matches[i].indexOf("less") >= 0) {
			matches.splice(i,1);
		}
	}
	return matches;
}

var notFalsePositive = function(champName, spellNumber) {
	var spellName = "";
	switch(spellNumber) {
		case 0:
			spellName = "Q";
			break;
		case 1:
			spellName = "W";
			break;
		case 2:
			spellName = "E";
			break;
		case 3:
			spellName = "R";
			break;
		case 4:
			spellName = "Q2";
			break;
		case 5:
			spellName = "W2";
			break;
		case 6:
			spellName = "E2";
			break;
		case 7:
			spellName = "R2";
			break;
		default:
			break;
	}

	var spell = champName + spellName;

	var falsePositives =
		["PoppyW","PoppyR","RyzeR","AnnieE","KarmaR","HeimerdingerR","AlistarR","VayneW","VarusW",
		"Udyr","RivenE","GalioW","ViW","IreliaW","AatroxW","NunuQ","Twisted FateE","QuinnW",
		"SivirW","TeemoE","ZileanR","JinxQ","YorickR","BlitzcrankE","BraumE","TwitchQ",
		"TwitchE","TwitchR","Master YiE","ZyraW","ZedR","Kog'MawW","RengarR","WarwickQ","JayceW2","JayceR2",
		"EliseR","EliseR2","ShacoQ","KayleE","JaxR","NasusQ","DravenQ","Cho'GathE","Miss FortuneW"];
	if(falsePositives.indexOf(spell) >= 0 || falsePositives.indexOf(champName) >= 0) {
		return false;
	}
	return true;
}

var trueNegative = function(champName, spellNumber) {
	var spellName = "";
	switch(spellNumber) {
		case 0:
			spellName = "Q";
			break;
		case 1:
			spellName = "W";
			break;
		case 2:
			spellName = "E";
			break;
		case 3:
			spellName = "R";
			break;
		case 4:
			spellName = "Q2";
			break;
		case 5:
			spellName = "W2";
			break;
		case 6:
			spellName = "E2";
			break;
		case 7:
			spellName = "R2";
			break;
		default:
			break;
	}

	var spell = champName + spellName;

	var trueNegatives =
		["AzirE","MalzaharW","NunuR","AkaliE","LucianQ","EzrealW"];
	if(trueNegatives.indexOf(spell) >= 0) {
		return true;
	}
	return false;
}

//Only looks at scaling coefficients
var naiveFindMostEfficient = function(data) {

}

//Uses labels to find most efficient
var findMostEfficient_withLabels = function(data) {
	results = {};

	var results = "<ul>";
	for(var champ in data) {
		var champSpells = data[champ]["spells"];

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			var label = spell.leveltip.label;


			
		}

	results += "</li>";


	}

	$("#content").html(results);
}

//Uses sanitzedTooltip to find most efficient
var findMostEfficient_withTooltip = function(data) {
	results = {};

	var results = "<ul>";
	for(var champ in data) {
		var champSpells = data[champ]["spells"];

		for(var s = 0; s < champSpells.length; s++) {
			var spell = champSpells[s];
			var label = spell.leveltip.label;


			
		}

	results += "</li>";


	}

	$("#content").html(results);
}