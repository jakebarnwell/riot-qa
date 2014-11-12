var allData;
var AP = 100;
var AD = 100;
var CDR = 20;

$(document).ready(function() {
	findMostEffectiveSpell();
});

var findMostEffectiveSpell = function() {
	// var API_key = "82e1d9e7-6d06-4345-b3ac-bcad6b8e4bbf";
	// var request_URL =
	// 	"https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=spells,stats&api_key="
	// 	+ API_key;

	// $.get(request_URL, function(response) {
	// 	allData = response.data;
	// 	doAll(response.data);
	// }).fail(function(jqxhr) {
	//     var response = $.parseJSON(jqxhr.responseText);
	//     alert("API query failed. Perhaps an incorrect API Key?");
 //  	});

  	allData = all_champs.data;
  	// console.log(allData);
  	doAll(allData);

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
				removeErroneousParsings(data[champ]["name"], getSpellLetter(s), parsedDamageText);

				var damage = parseDamage(champ, s, parsedDamageText);




				results += "<li> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + champ + " " + spellLetter + ": " + parsedDamageText + "</li>";
				results += "<li> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + champ + " " + spellLetter + ": " + damage + "</li>";

				



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
			var parsedDamage = parseDamageFromRegexMatches(champ, spellNumber, matches, text);

			//This block applies the "override" features--the damages that we manually
			// take care of instead of allowing the computer to try to parse them,
			// the reason being that the parser, for these few spells that we
			// override, doesn't work too well.
			// parsedDamage = applyOverrides(champ, spellNumber, matches, text);

			parsedDamage = modifyDamage(parsedDamage, champ, spellNumber, text);

			separateDamages.push(parsedDamage);
		}
	}

	// This block applies the "either/or" commane, i.e. if there are two options for
	// a spell, you pick one (and we go with the one that does the more damage):
	// e.g. Fizz' playful/trickster, you can either land straight down or move
	// laterally to do less damage.
	var champName = allData[champ]["name"];
	try{
		if(damageMod[champName][spellLetter]["eitherOr"]) {
			dmg = Math.max.apply(this, separateDamages);
		} else {
			dmg = separateDamages.reduce(function(x,y) {return x+y}, 0);
		}
	} catch(e) {
		dmg = separateDamages.reduce(function(x,y) {return x+y}, 0);
	}




	return dmg;
}

var applyOverrides = function(champ, spellNumber, matches, text) {
	return -5;
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
							var bonusAD = Math.max(AD - baseAD, 0);
							dmg += (bonusAD * coeff);
						} else if(scale["link"] === "armor") {
							var armor = stats["armor"] + 18*stats["armorperlevel"];
							dmg += (armor * coeff);
						} else if(scale["link"] === "bonusspellblock") {
							var baseMR = stats["spellblock"] + 18*stats["spellblockperlevel"];
							var MR = baseMR; //Set this since we assume no items or anything. Meh. Obviously this can be changed in the future.
							var bonusMR = Math.max(MR - baseMR, 0);
							dmg += (bonusMR * coeff);
						} else if(scale["link"] === "bonushealth") {
							var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
							var health = baseHealth; //Again, assume no items
							var bonusHealth = Math.max(health - baseHealth, 0);
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
								var bonusAD = Math.max(AD - baseAD, 0);
								percent += (bonusAD * coeff);
							} else if(scale["link"] === "armor") {
								var armor = stats["armor"] + 18*stats["armorperlevel"];
								percent += (armor * coeff);
							} else if(scale["link"] === "bonusspellblock") {
								var baseMR = stats["spellblock"] + 18*stats["spellblockperlevel"];
								var MR = baseMR; //Set this since we assume no items or anything.
								var bonusMR = Math.max(MR - baseMR, 0);
								percent += (bonusMR * coeff);
							} else if(scale["link"] === "bonushealth") {
								var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
								var health = baseHealth; //Again, assume no items
								var bonusHealth = Math.max(health - baseHealth, 0);
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
					var bonusHealth = Math.max(health - baseHealth, 0);

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
				var bonusAD = Math.max(AD - baseAD, 0);
				dmg += (bonusAD * coeff);
			} else { //Assume it's just a damage multiplier then
				dmg *= (1 + percent);
			}
		}
	}

	return dmg;
}

var modifyDamage = function(dmg, champ, spellNumber, text) {
	// console.log("Here");
	var modifiedDmg = dmg;
	var champName = allData[champ]["name"];

	try {
		var mod = damageMod[champName][getSpellLetter(spellNumber)];
		console.log("modify Damage working. At " + dmg + ", " + champ + ", " + spellNumber + ", " + text);
			
		var tokens = mod["forStatementContaining"];

		if(!tokens || (tokens && tokensMatchStatement(tokens, text))) {
			console.log("Inside of this if statement");
			if(mod["multiplyBy"]) {
				console.log("here1");
				modifiedDmg *= mod["multiplyBy"];
			}
			if(mod["perSecond"]) {
				console.log("here2");
				var duration = mod["lasts"];
				console.log("duration = " + duration);
				if((typeof duration) === "string") {
					console.log("Got here 254");
					var durations = duration.split(" ");
					durationVals = getTokenValues(durations, champ, spellNumber);
					console.log(durationVals);
					modifiedDmg *= durationVals.reduce(function(x,y) {return x+y}, 0);
				} else {
					modifiedDmg *= duration;
				}
			}
		}
		console.log("mod dmg is " + modifiedDmg);
	
	} catch(e) {
		return dmg;
	}

	return modifiedDmg;
}

/* Takes as input an array of tokens e.g. ["e1", "f2", "a6"]
Outputs an array of numbers and arrays; a number if the
input was an "ex" input, the number being the final value; and
an array of length 2 if the input was "fx" or "ax"; the ordering is
[scaling, coeff] e.g. ["armor", 0.5].
*/
var getTokenValues = function(tokens, champ, spellNumber) {
	console.log("inside tokenvalu");
	var stats = allData[champ]["stats"];
	var tokenVals = [];

	for(var t in tokens) {
		var token = tokens[t];
		if(token[0] === "e") {
			var index = parseInt(token[1]);
			var eff = allData[champ]["spells"][spellNumber]["effect"][index];
			tokenVals.push(eff[eff.length - 1]);
		} else if(token[0] === "a" || token[0] === "f") {
			var vars = allData[champ]["spells"][spellNumber]["vars"];
			for(v in vars) {
				var scale = vars[v];

				if(scale["key"] === token) {
					var result = 0;
					var link = scale["link"];
					var coeff = scale["coeff"][coeffs.length - 1];

					if(link === "spelldamage") {
						result = AP * coeff;
					} else if(link === "attackdamage") {
						result = AD * coeff;
					} else if(link === "bonusattackdamage") {
						var baseAD = stats["attackdamage"] + 18*stats["attackdamageperlevel"];
						var bonusAD = Math.max(AD - baseAD, 0);
						result = bonusAD * coeff;
					} else if(link === "armor") {
						var armor = stats["armor"] + 18*stats["armorperlevel"];
						result = armor * coeff;
					} else if(link === "bonusspellblock") {
						var baseMR = stats["spellblock"] + 18*stats["spellblockperlevel"];
						var MR = baseMR; //Set this since we assume no items or anything.
						var bonusMR = Math.max(MR - baseMR, 0);
						result = bonusMR * coeff;
					} else if(link === "bonushealth") {
						var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
						var health = baseHealth; //Again, assume no items
						var bonusHealth = Math.max(health - baseHealth, 0);
						result = bonusHealth * coeff;
					} else {
						;
					}
					tokenVals.push([result, link, coeff]);
				}
			}
		} else {
			console.log("Not a valid token!");
		}
	}

	return tokenVals;
}

var removeErroneousParsings = function(champName, spellLetter, matches) {
	if(damageMod[champName] && damageMod[champName][spellLetter]) {

		var mod = damageMod[champName][spellLetter];
		if(mod["override"]) {
			return [];
		}
		if(mod["deleteStatementContaining"]) {
			//The string with the statement to-be-deleted will look something
			// like "e2" or "e2 a1". This splits it into an array.
			console.log("Here at delete!");

			var deleteTokens = mod["deleteStatementContaining"];

			//We look through all of the parsed damage matches to find the one
			// with all the required tokens in it.
			for(var m = 0; m < matches.length; m++) {
				if(tokensMatchStatement(deleteTokens, matches[m])) {
					matches.splice(m, 1);
					m--;
				}
				//Deletes the match if that's what we want to do.
				
			}

		}
	}
}

var tokensMatchStatement = function(tokens, statement) {
	var tokens_list = tokens.split(" ");

	for(var t in tokens_list) {
		if(statement.indexOf(tokens_list[t]) < 0) {
			return false;
		}
	}

	return true;
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
	var spell = champName + getSpellLetter(spellNumber);

	if(falsePositives.indexOf(spell) >= 0 || falsePositives.indexOf(champName) >= 0) {
		return false;
	}
	return true;
}

var trueNegative = function(champName, spellNumber) {
	var spell = champName + getSpellLetter(spellNumber);

	if(trueNegatives.indexOf(spell) >= 0) {
		return true;
	}
	return false;
}
