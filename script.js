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
		doStuff(response.data);
	}).fail(function(jqxhr) {
	    var response = $.parseJSON(jqxhr.responseText);
	    alert("API query failed. Perhaps an incorrect API Key?");
  	});

};

var doStuff = function(data) {
	$("#content").html(JSON.stringify(data, null, 4));
};