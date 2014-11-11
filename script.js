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
		showLevelUpScalings(response.data);
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
				if(damageNotInScalings(spell.leveltip.label)) {
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

//Only looks at scaling coefficients
var naiveFindMostEfficient = function(data) {

}