var damageMod = {
	"Cassiopeia": {
		"W": {
			"perSecond": true,
			"lasts": "e4 e3"
		}
	},
	"Annie": {
		"R": {
			"perSecond": true,
			"lasts": "e6",
			"forStatementContaining": "e4 a2"
		}
	},
	"Nautilus": {
		"E": {
			"multiplyBy": 2
		}
	},
	"Ahri": {
		"Q": {
			"multiplyBy": 2
		},
		"W": {
			"multiplyBy": 1.6
		},
		"E": {
			"multiplyBy": 3
		},
		"R": {
			"multiplyBy": 3
		}
	},
	"Anivia": {
		"E": {
			"multiplyBy": 2
		}
	},
	"Singed": {
		"Q": {
			"toggle": true
		}
	},
	"Maokai": {
		"R": {
			"add": "e5"
		}
	},
	"Fizz": {
		"E": {
			"eitherOr": true
		}
	},
	"Heimerdinger": {
		"W": {
			"override": {
				"base": "e6",
				"scale": "f2"
			} 
		}
	},
	"Rumble": {
		"E": {
			"multiplyBy": 2
		},
		"R": {
			"perSecond": true,
			"lasts": 5
		}
	},
	"Mordekaiser": {
		"Q": {
			"override": {
				"base": "e1",
				"scale": "f1 a2"
			}
		},
		"W": {
			"perSecond": true,
			"lasts": 6
		}
	},
	"Karthus": {
		"Q": {
			"multiplyBy": 2
		},
		"E": {
			"toggle": true
		}
	},
	"Kha'Zix": {
		"Q": {
			"override": {
				"base": "e6",
				"scale": "a2"
			}
		}
	},
	"Riven": {
		"Q": {
			"multiplyBy": 1.5
		}
	},
	"Corkie": {
		"W": {
			"perSecond": true,
			"lasts": 2
		},
		"E": {
			"perSecond": true,
			"lasts": "e1"
		}
	},
	"Azir": {
		"W": {
			"deleteStatementContaining": "f2 a1"
		}
	},
	"Nidalee": {
		"Q": {
			"override": {
				"base": "e2",
				"scale": "a1"
			}
		}
	},
	"Veigar": {
		"R": {
			"special": "veigar-r"
		}
	},
	"Graves": {
		"Q": {
			"multiplyBy": 1.8,
			"deleteStatementContaining": "e4"
		}
	},
	"Irelia": {
		"R": {
			"multiplyBy": 4
		}
	},
	"Twisted Fate": {
		"W": {
			"eitherOr": true
		}
	},
	"Shyvana": {
		"W": {
			"perSecond": true,
			"lasts": 3
		}
	},
	"Dr. Mundo": {
		"W": {
			"toggle": true
		}
	},
	"Diana": {
		"W": {
			"multiplyBy": 3
		}
	},
	"Sivir": {
		"Q": {
			"multiplyBy": 1.85
		}
	},
	"Xerath": {
		"W": {
			"multiplyBy": 1.5
		},
		"R": {
			"multiplyBy": 3
		}
	},
	"Draven": {
		"R": {
			"multiplyBy": 2
		}
	},
	"Shaco": {
		"W": {
			"multiplyBy": 9
		}
	},
	"Swain": {
		"Q": {
			"perSecond": true,
			"lasts": 3
		},
		"E": {
			"deleteStatementContaining": "e2"
		},
		"R": {
			"toggle": true
		}
	},
	"Ziggs": {
		"R": {
			"deleteStatementContaining": "e2"
		}
	},
	"Janna": {
		"Q": {
			"multiplyBy": 3,
			"forStatementContaining": "e2 a2"
		}
	},
	"Talon": {
		"Q": {
			"add": "e1 f2"
		}
	},
	"Fiddlesticks": {
		"W": {
			"perSecond": true,
			"lasts": 5
		},
		"R": {
			"perSecond": true,
			"lasts": 5
		}
	},
	"Fiora": {
		"R": {
			"override": {
				"base": "e2",
				"scale": "f1"
			},
			"multiplyBy": 2
		}
	},
	"Rammus": {
		"R": {
			"perSecond": true,
			"lasts": "e3"
		}
	},
	"LeBlanc": {
		"R": {
			"eitherOr": true,
			"multiplyBy": 2,
			"forStatementContaining": "e3 a1"
		}
	},
	"Wukong": {
		"R": {
			"perSecond": true,
			"lasts": 4
		}
	},
	"Xin Zhao": {
		"Q": {
			"multiplyBy": 3
		}
	},
	"Gangplank": {
		"R": {
			"perSecond": true,
			"lasts": "e3"
		}
	},
	"Vel'Koz": {
		"Q": {
			"multiplyBy": 0.5
		}
	},
	"Nami": {
		"E": {
			"multiplyBy": "e4"
		}
	},
	"Viktor": {
		"Q": {
			"override": {
				"base": "e1",
				"scale": "a1"
			}
		},
		"E": {
			"deleteStatementContaining": "e2"
		}
	},
	"Darius": {
		"Q": {
			"deleteStatementContaining": "e1",
			"multiplyBy": 1.5
		},
		"W": {
			"percentOfAD": "e4"
		},
		"R": {
			"multiplyBy": 2
		}
	},
	"Gnar": {
		"Q": {
			"deleteStatementContaining": "e7",
			"eitherOr": true
		},
		"W": {
			"deleteStatementContaining": "e1 a1 e2"
		},
		"E": {
			"multiplyBy": 0.5,
			"special": "gnar-e"
		}
	},
	"Jax": {
		"E": {
			"deleteStatementContaining": "e5"
		}
	},
	"Sejuani": {
		"W": {
			"special": "sejuani-w"			
		}
	},
	"Rengar": {
		"Q": {
			"special": "rengar-q"
		},
		"W": {
			"deleteStatementContaining": "f2 a1"
		},
		"E": {
			"deleteStatementContaining": "f1 a1"
		}
	},
	"Skarner": {
		"R": {
			"deleteStatementContaining": "e3"
		}
	},
	"Miss Fortune": {
		"Q": {
			"override": {
				"base": "e4",
				"scale": "a2"
			},
			"addScale": "100 AD"
		}
	},
	"Yorick": {
		"Q": {
			"deleteStatementContaining": "e2"
		}
	},
	"Zac": {
		"W": {
			"special": "zac-w"
		}
	},
	"Nasus": {
		"E": {
			"perSecond": true,
			"lasts": "e3",
			"forStatementContaining": "e1 a1"
		}
	},
	"Renekton": {
		"Q": {
			"override": {
				"base": "e4",
				"scale": "f2"
			}
		},
		"W": {
			"override": {
				"base": "e4",
				"scale": "f2"
			}
		},
		"E": {
			"override": {
				"base": "e3",
				"scale": "f2"
			}
		},
		"R": {
			"perSecond": true,
			"lasts": 15
		}
	},
	"Amumu": {
		"W": {
			"special": "amumu-w"
		}
	},
	"Sona": {
		"Q": {
			"deleteStatementContaining": "e6"
		}
	},
	"Kennen": {
		"W": {
			"deleteStatementContaining": "e2"
		}
	},
	"Soraka": {
		"Q": {
			"multiplyBy": 1.5
		}
	},
	"Garen": {
		"E": {
			"perSecond": true,
			"lasts": 3
		}
	},
	"Morgana": {
		"W": {
			"perSecond": true,
			"lasts": 5
		}
	},
	"Syndra": {
		"R": {
			"multiplyBy": 7
		}
	},
	"Pantheon": {
		"E": {
			"multiplyBy": 6
		}
	},
	"Malzahar": {
		"W": {
			"perSecond": true,
			"lasts": "e3"
		}
	}
};

var manualDmg = {
	"Gragas": {
		"W": "{{ e3 }} (+{{ a1 }}) plus {{ e2 }}% of the target's maximum Health"
	},
	"Sion": {
		"Q": "{{ e4 }} (+{{ f2 }}) physical damage"
	},
	"Garen": {
		"E": "{{ e1 }} plus {{ e3 }}% of his attack damage"
	},
	"Morgana": {
		"W": "{{ e6 }} (+{{ a2 }}) magic damage"
	},
	"Mordekaiser": {
		"R": "{{ e1 }}% (+{{ a1 }})% of target champion's maximum Health"
	},
	"Varus": {
		"Q": "{{ e2 }} (+{{ f2 }}) physical damage"
	},
	"Jayce": {
		"E": "Deals {{ e4 }}% of the enemy's maximum health (+{{ a1 }}) as magic damage"
	},
	"Syndra": {
		"R": "Damage per sphere: {{ e1 }} (+{{ a1 }})."
	},
	"Pantheon": {
		"E": "{{ e1 }} (+{{ f1 }}) physical damage per strike."
	},
	"Riven": {
		"R": "{{ e2 }} (+{{ f2 }}) physical damage"
	},
	"Malzahar": {
		"W": "{{ e1 }}% (+{{ a1 }}%) of their max Health"
	},
	"Vi": {
		"Q": "{{ e2 }} (+{{ f1 }}) physical damage"
	},
	"Elise": {
		"Q": "{{ e1 }} plus 8% (+{{ a1 }}%) of the target's current Health",
		"Q2": "{{ e1 }} plus 8% (+{{ a1 }}%) of the target's missing Health"
	}
};

/* Spells that the heuristic thinks are damaging spells but they aren't. (Actually, most
of them are, it's just that they're not appropriate to find the most "efficient" spells
with, e.g. auto-attack-enhancing spells). */
var falsePositives =
	["PoppyW","PoppyR","RyzeR","AnnieE","KarmaR","HeimerdingerR","AlistarR","VayneW","VarusW",
	"Udyr","RivenE","GalioW","ViW","IreliaW","AatroxW","NunuQ","Twisted FateE","QuinnW",
	"SivirW","TeemoE","ZileanR","JinxQ","YorickR","BlitzcrankE","BraumE","TwitchQ",
	"TwitchE","TwitchR","Master YiE","ZyraW","ZedR","Kog'MawW","RengarR","WarwickQ","JayceW2","JayceR2",
	"EliseR","EliseR2","ShacoQ","KayleE","JaxR","NasusQ","DravenQ","Cho'GathE","Miss FortuneW"];

/* Spells that the heuristic thinks are not damaging spells when they in fact are. */
var trueNegatives =
	["AzirE","MalzaharW","NunuR","AkaliE","LucianQ","EzrealW"];