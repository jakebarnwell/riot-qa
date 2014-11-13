
//Sorts an array of objects by DPS. The objects have to be
// of the correct form.
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

//Given a champion spell and its damage, calculate the DPS
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
	var bestCD = getCD(allCDs, champ, s);

	CDR = Math.min(100, CDR);
	CDR = Math.max(0, CDR);
	var myCD = bestCD * (1 - (CDR / 100.0));

	var dps = damage / myCD;

	return dps;
}

//Gets the cooldown required for a spell, given the array of all cooldowns 
// taken from the API JSON object.
var getCD = function(allCDs, champ, s) {
	var spell = champ.toLowerCase() + getSpellLetter(s);

	//Special cases.
	var recharge_cds = {
		"yasuoE": 6,
		"yasuoR": 30,
		"syndraW": 12,
		"shyvanaR": 49.5,
		"rumbleE": 10,
		"rengarE": 10,
		"rengarW": 12,
		"teemoR": 27,
		"viE": 8,
		"xerathW": 10,
		"akaliR": 15,
		"velkozW": 15,
		"corkiR": 8,
		"xinzhaoQ": 5
	}

	if(recharge_cds[spell]) {
		return recharge_cds[spell];
	} else {
		return allCDs[allCDs.length - 1];
	}
}

//Given a spellNumber (e.g. 2), returns the corresponding
// spell Letter (e.g. E).
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


$("#submitform").submit(function(evt) {
	evt.preventDefault();

	var inputAP = $("#AP").val();
	var inputAD = $("#AD").val();
	var inputCDR = $("#CDR").val();

	if(inputAP) AP = inputAP;
	if(inputAD) AD = inputAD;
	if(inputCDR) CDR = inputCDR;

	var info = "Calculating most efficient spells with: " + AP + " Ability Power, " + AD + " Attack Damage, and " + CDR + "% Cooldown Reduction.";

	$("#info").html(info);

	findMostEfficientSpell();
});