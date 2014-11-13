

var allData;
var AP = 100;
var AD = 200;
var CDR = 0;
var results = [];

$(document).ready(function() {
  	allData = all_champs.data;
	findMostEfficientSpell();
});

var findMostEfficientSpell = function() {
	results = [];

	for(var champ in allData) {

		//Loop through all spells of all champs.
		var champSpells = allData[champ]["spells"];	
		for(var s = 0; s < champSpells.length; s++) {
			//Gets the (sanitized) tooltip of the current spell of the current champion
			var tooltip = champSpells[s].sanitizedTooltip;
			//Calculates the letter (e.g. Q or R) of the spell given the index (e.g. 0 or 3)
			var spellLetter = getSpellLetter(s);

			//The big test to see if a skill is a damaging skill or not. There are some false postiives
			// and vice versa so those are accounted for by two functions I manually created.
			var champName = allData[champ]["name"];
			if(trueNegative(champName, s) ||
				(hasDamageKeyword(keywords,tooltip) && notFalsePositive(champName, s))) {


				listing += "<li>" + champ + " " + spellLetter + ": " + tooltip + "</li>";
				var parsedDamageText = getPortion(keywords,tooltip);
				parsedDamageText = removeReducedDamageTokens(parsedDamageText);
				removeErroneousParsings(champName, spellLetter, parsedDamageText);

				var damage = parseDamage(champ, s, parsedDamageText);

				var dps = calculateDPS(damage, champ, s);

				results.push({"dps": dps, "damage": damage, "spell": spellLetter, "champion": champName});
				
				

				

			}

		}




	}

	sortByDPS(results);

	var listing = "<ol>";
	for(var r in results) {
		var x = results[r];
		listing += "<li><b>"+x["dps"]+"</b> damage per second by "+x["champion"]+"'s " + x["spell"]+"</li>";
	}
	listing += "</ol>";

	$("#content").html(listing);
}

var sortByDPS = function(arr) {
	return arr.sort(function(x, y) {
		var a = x["dps"];
		var b = y["dps"];
		if(a < b) {
			return 1;
		} else if(a > b) {
			return -1;
		} else {
			return 0;
		}
	});
}

var calculateDPS = function(damage, champ, s) {

	var dps = 0;

	try {
		if(damageMod[allData[champ]["name"]][getSpellLetter(s)]["toggle"]) {
			dps = damage;
			return dps;
		}
	} catch(e) {
		;
	}

	var allCDs = allData[champ]["spells"][s]["cooldown"];

	CDR = Math.min(100, CDR);
	var myCD = allCDs[allCDs.length - 1] * (1 - (CDR / 100.0));

	//Arbitrary assigns a CD of 8 if there's a "0 second cooldown" -___-
	if(myCD === 0) {
		myCD = 8; 
	}

	var dps = damage / myCD;

	return dps;
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

	if(parsedTexts && parsedTexts.length && !manualParse(champ, spellNumber)) {
		for(var i in parsedTexts) {
			var text = parsedTexts[i];
			var matches = text.match(/(({{ ?)[eaf0-9]+( ?}}\)?%?))|([0-9]+%)/g);

			matches = removeBadPercents(champ, spellNumber, matches);
			matches = overrideMatches(champ, spellNumber, matches);

			var parsedDamage = parseDamageFromRegexMatches(champ, spellNumber, matches, text);

			//This block applies the "override" features--the damages that we manually
			// take care of instead of allowing the computer to try to parse them,
			// the reason being that the parser, for these few spells that we
			// override, doesn't work too well.



			parsedDamage = modifyDamageMult(parsedDamage, champ, spellNumber, text);

			separateDamages.push(parsedDamage);
		}
	} else { //For the manual case when there are no auto matches


		var parsedDamage = calculateManualSpells(champ, spellNumber);
		parsedDamage = modifyDamageMult(parsedDamage, champ, spellNumber, "");

		separateDamages.push(parsedDamage);
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

	dmg = modifyDamageAdd(dmg, champ, spellNumber);



	return dmg;
}

var manualParse = function(champ, spellNumber) {
	try {
		var x = manualDmg[allData[champ]["name"]][getSpellLetter(spellNumber)];
		if(x) {
			return true;
		} else {
			return false;
		}
	} catch(e) {
		return false;
	}

}


var calculateManualSpells = function(champ, spellNumber) {


	try {
		var manualText = manualDmg[allData[champ]["name"]][getSpellLetter(spellNumber)].toLowerCase();
		var matches = manualText.match(/(({{ ?)[eaf0-9]+( ?}}\)?%?))|([0-9]+%)/g);
		var dmg = parseDamageFromRegexMatches(champ, spellNumber, matches, manualText);

		return dmg;
	} catch(e) {
		return 0;
	}

	return 0;
}

var overrideMatches = function(champ, spellNumber, matches) {
	var overriddenMatches = [];

	try {
		var mod = damageMod[allData[champ]["name"]][getSpellLetter(spellNumber)];

		if(mod["override"]) {

			var override = mod["override"];

			if(override["base"]) {

				overriddenMatches.push("{{ " + override["base"] + " }}");	
			}

			if(override["scale"]) {
				var scales = override["scale"].split(" ");
				for(var s in scales) {
					overriddenMatches.push("{{ " + scales[s] + " }}");
				}

			}


			
			return overriddenMatches;
		}

	} catch(e) {
		// console.log(e);
	}

	return matches;

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
				baseDmg = getTokenValues([token], champ, spellNumber)[0];

				dmg += baseDmg;
			} else if(token[0] === "a" || token[0] === "f") { //Scaling damage
				addtlDmg = getTokenValues([token], champ, spellNumber)[0][0];

				dmg += addtlDmg;
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



			//We will now check the substring from the token onward to see what type of % it wants
			var loc = text.indexOf(r[i]);
			var substr = text.substring(loc, text.length);

			if(substr.indexOf("health") >= 0) { //So we're looking at some health
				if(substr.indexOf("bonus health") >= 0) {
					var baseHealth = stats["hp"] + 18*stats["hpperlevel"];
					var health = baseHealth; //Again, assume no items
					var bonusHealth = Math.max(health - baseHealth, 0);

					dmg += (bonusHealth * coeff);
				} else if(substr.indexOf("braum") >= 0 || substr.indexOf("gnar") >= 0) { //This is actually the only case
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
			} else if(substr.indexOf("attack damage") >= 0) {
				dmg += (AD * coeff);
			} else { //Assume it's just a damage multiplier then
				dmg *= (1 + coeff);
			}
		}
	}

	if(champ === "Darius" && spellNumber == 1) {
		return AD;
	} else {
		return dmg;
	}
}

var modifyDamageMult = function(dmg, champ, spellNumber, text) {
	var modifiedDmg = dmg;
	var champName = allData[champ]["name"];

	try {
		var mod = damageMod[champName][getSpellLetter(spellNumber)];
			
		var tokens = mod["forStatementContaining"];

		if(!tokens || (tokens && tokensMatchStatement(tokens, text))) {
			if(mod["multiplyBy"]) {
				if(typeof mod["multiplyBy"] === "string") {
					var e = getTokenValues([mod["multiplyBy"]], champ, spellNumber)[0];
					modifiedDmg *= e;
				} else {
					modifiedDmg *= mod["multiplyBy"];
				}
			}
			if(mod["perSecond"]) {
				var duration = mod["lasts"];
				if((typeof duration) === "string") {
					var durations = duration.split(" ");
					durationVals = getTokenValues(durations, champ, spellNumber);
					modifiedDmg *= durationVals.reduce(function(x,y) {return x+y}, 0);
				} else {
					modifiedDmg *= duration;
				}
			}
		}
	
	} catch(e) {
		return dmg;
	}

	return modifiedDmg;
}

var modifyDamageAdd = function(dmg, champ, spellNumber) {
	var modifiedDmg = dmg;
	var champName = allData[champ]["name"];

	try {

		var mod = damageMod[champName][getSpellLetter(spellNumber)];

		if(mod["add"]) {
			var add = mod["add"].split(" ");
			var tokenVals = getTokenValues(add, champ, spellNumber);

			for(var t in tokenVals) {
				if((typeof tokenVals[t]) === "number") {
					modifiedDmg += tokenVals[t];
				} else { //Must be an array then, i.e. fx or ax type
					modifiedDmg += tokenVals[t][0];
				}
			}
		}

		if(mod["addScale"]) {
			var addScale = mod["addScale"];
			var words = addScale.split(" ");

			var coeff = parseInt(words[0]) / 100.0;

			var scaling;
			if(words[1] === "AD") {
				scaling = AD;
			} else if(words[1] === "AP") {
				scaling = AP;
			}

			modifiedDmg += (coeff * scaling);
		}
	} catch(e) {
		// console.log(e);
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
	var stats = allData[champ]["stats"];
	var tokenVals = [];

	for(var t in tokens) {
		var token = tokens[t];
		var result = 0;

		if(token[0] === "e") {
			var index = parseInt(token[1]);
			var eff = allData[champ]["spells"][spellNumber]["effect"][index];
			if(!eff) {
				tokenVals.push(0);
			} else {
				tokenVals.push(eff[eff.length - 1]);
			}
		} else if(token[0] === "a" || token[0] === "f") {
			var vars = allData[champ]["spells"][spellNumber]["vars"];
			for(v in vars) {
				var scale = vars[v];

				if(scale["key"] === token) {
					var link = scale["link"];
					var coeffs = scale["coeff"];
					var coeff = coeffs[coeffs.length - 1];

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
					} else if(link === "mana") {
						var mana = stats["mp"] + 18*stats["mpperlevel"];
						result = mana * coeff;
					} else {
						;
					}
					
				}
			}
			tokenVals.push([result, link, coeff]);

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
