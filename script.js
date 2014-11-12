var allData;
var AP = 100;
var AD = 100;
var CDR = 20;

$(document).ready(function() {
	findMostEffectiveSpell();
});

var findMostEffectiveSpell = function() {
	var API_key = "82e1d9e7-6d06-4345-b3ac-bcad6b8e4bbf";
	var request_URL =
		"https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells,stats&api_key="
		+ API_key;

	$.get(request_URL, function(response) {
		allData = response.data;
		doAll(response.data);
	}).fail(function(jqxhr) {
	    var response = $.parseJSON(jqxhr.responseText);
	    alert("API query failed. Perhaps an incorrect API Key?");
  	});

};

var doAll = function(data) {
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

			var spellLetter = getSpellLetter(s);

			//if the spell mentions damage in its sanitized description, or it's in negatives list...
			if((trueNegative(data[champ]["name"], s) || (hasDamageKeyword(keywords,tooltip) && notFalsePositive(data[champ]["name"], s)))) {
				numValid += 1;

				// results += "<li>" + champ + " " + spellLetter + ": " + tooltip + "</li>";
				var parsedDamageText = getPortion(keywords,tooltip);
				parsedDamageText = removeReducedDamageTokens(parsedDamageText);

				var damage = parseDamage(champ, s, parsedDamageText);




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

var getSpellLetter = function(spellNumber) {
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

	return spellName;
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

var parseDamage = function(champ, spellNumber, parsedTexts) {
	var dmg = -1;
	var separateDamages = [];

	if(parsedTexts && parsedTexts.length) {
		for(var i in parsedTexts) {
			var text = parsedTexts[i];
			var matches = text.match(/(({{ ?)[eaf0-9]+( ?}}\)?%?))|([0-9]+%)/g);

			matches = removeBadPercents(champ, spellNumber, matches);
			separateDamages.push(parseDamageFromRegexMatches(champ, spellNumber, matches, text));
		}
	}
	console.log(separateDamages);


	return 0;
}

var parseDamageFromRegexMatches = function(champ, spellNumber, regexMatches, text) {
	// return 0;
	var r = regexMatches;

	var spell = allData[champ]["spells"][spellNumber];
	var stats = allData[champ]["stats"];

	var dmg = 0;
	var baseDmg = 0;

	for(var i in r) {
		if(r[i].indexOf("%") < 0) { //So it's just a standard base/scale dmg
			var token = r[i].substring(3, 5);
			if(token[0] === "e") { //This is a base damage
				var index = parseInt(token[1]);
				
				var eff = spell["effect"][index];
				baseDmg = eff[eff.length - 1];

				dmg += baseDmg;
			} else if(token[0] === "a" || token[0] === "f") { //Scaling damage
				var vars = spell["vars"];
				for(scale in vars) {
					var scale = vars[scale];
					

					if(scale["key"] === token) {//Trying to locate if e.g. f2 is the current one
						var coeffs = scale["coeff"];
						var coeff = coeffs[coeffs.length - 1];

						if(scale["link"] === "spelldamage") {
							dmg += (AP * coeff);
						} else if(scale["link"] === "attackdamage") {
							dmg += (AD * coeff);
						} else if(scale["link"] === "bonusattackdamage") {
							var baseAD = stats["attackdamage"] + 18*stats["attackdamageperlevel"];
							var bonusAD = (AD - baseAD >= 0 ? AD - baseAD : 0);
							dmg += (bonusAD * coeff);
						} else if(scale["link"] === "armor") {
							var armor = stats["armor"] + 18*stats["armorperlevel"];
							dmg += (armor * coeff);
						} else if(scale["link"] === "bonusspellblock") {
							var baseMR = stats["spellblock"] + 18*stats["spellblockperlevel"];
							var MR = baseMR; //Set this since we assume no items or anything. Meh. Obviously this can be changed in the future.
							var bonusMR = (MR - baseMR >= 0 ? MR - baseMR : 0);
							dmg += (bonusMR * coeff);
						} else if(scale["link"] === "bonushealth") {
							var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
							var health = baseHealth; //Again, assume no items
							var bonusHealth = (health - baseHealth >= 0 ? health - baseHealth : 0);
							dmg += (bonusHealth * coeff);
						} else {
							console.log("Can't find " + scale["link"]);
						}

					}
				}
			}
		} else { //Else it's a percentage, probably of a health
			var coeff = 0;

			var percent = 0;

			//First, find the token.
			if(r[i].length === 2) {
				//So it's just x%
				percent = r[i][0];
			} else if(r[i].length >= 8) {
				//So it's of the form ({{ e3 }})% or {{ e3 }}%
				token = r[i].split(" ")[1];

				if(token[0] === "e") { //Base
					var index = parseInt(token[1]);
					var eff = spell["effect"][index];
					percent = eff[eff.length - 1];
				} else {
					var vars = spell["vars"];
					for(scale in vars) {
						var scale = vars[scale];

						if(scale["key"] === token) {
							var coeffs = scale["coeff"];
							var coeff = coeffs[coeffs.length - 1];

							if(scale["link"] === "spelldamage") {
								percent += (AP * coeff);
							} else if(scale["link"] === "attackdamage") {
								percent += (AD * coeff);
							} else if(scale["link"] === "bonusattackdamage") {
								var baseAD = stats["attackdamage"] + 18*stats["attackdamageperlevel"];
								var bonusAD = (AD - baseAD >= 0 ? AD - baseAD : 0);
								percent += (bonusAD * coeff);
							} else if(scale["link"] === "armor") {
								var armor = stats["armor"] + 18*stats["armorperlevel"];
								percent += (armor * coeff);
							} else if(scale["link"] === "bonusspellblock") {
								var baseMR = stats["spellblock"] + 18*stats["spellblockperlevel"];
								var MR = baseMR; //Set this since we assume no items or anything.
								var bonusMR = (MR - baseMR >= 0 ? MR - baseMR : 0);
								percent += (bonusMR * coeff);
							} else if(scale["link"] === "bonushealth") {
								var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
								var health = baseHealth; //Again, assume no items
								var bonusHealth = (health - baseHealth >= 0 ? health - baseHealth : 0);
								percent += (bonusHealth * coeff);
							} else {
								console.log("Can't find " + scale["link"]);
							}

						}
					}
				}
			}


			var coeff = percent * 0.01;

			var loc = text.indexOf(r[i]);
			//We will now check the substring from the token onward to see what type of % it wants
			var substr = text.substring(loc, text.length);
			if(substr.indexOf("health") >= 0) { //So we're looking at some health
				if(substr.indexOf("bonus health") >= 0) {
					var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
					var health = baseHealth; //Again, assume no items
					var bonusHealth = (health - baseHealth >= 0 ? health - baseHealth : 0);

					dmg += (bonusHealth * coeff);
				} else if(substr.indexOf("braum") >= 0) { //This is actually the only case
					var health = stats["hp"] + 18*stats["hpperlevel"];

					dmg += (health * coeff);
				} else { //so it's the enemy. Just assume an average max health at level 18 with no items: about 1950
					var health = 1950;
					//Also assume max/min health, whatever we need to get the most DPS (execute vs % max health, for example)
					dmg += (health * coeff);
				}
			} else if(substr.indexOf("bonus base damage") >= 0) {
				dmg += (baseDmg * coeff);
			} else if(substr.indexOf("bonus attack damage") >= 0) {
				var baseAD = stats["attackdamage"] + 18*stats["attackdamageperlevel"];
				var bonusAD = (AD - baseAD >= 0 ? AD - baseAD : 0);
				dmg += (bonusAD * coeff);
			} else { //Assume it's just a damage multiplier then
				dmg *= (1 + percent);
			}
		}
	}

	return dmg;
}

var removeReducedDamageTokens = function(matches) {
	for(var i in matches) {
		if(matches[i].indexOf("reduced") >= 0 || matches[i].indexOf("less") >= 0) {
			matches.splice(i,1);
		}
	}
	return matches;
}

var removeBadPercents = function(champ, spellNumber, matches) {
	var newMatches = [];

	var badPercentages = ["KhazixW","NidaleeQ2","LucianQ"];
	var spellName = getSpellLetter(spellNumber);

	var spell = champ + spellName;

	if(badPercentages.indexOf(spell) >= 0) {
		newMatches = [];
		for(var m = 0; m < matches.length; m++) {
			if(matches[m].indexOf("%") < 0) {
				newMatches.push(matches[m]);
			}
		}
	} else {
		newMatches = matches;
	}

	return newMatches;
}

var notFalsePositive = function(champName, spellNumber) {
	var spellName = getSpellLetter(spellNumber);
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
	var spellName = getSpellLetter(spellNumber);

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