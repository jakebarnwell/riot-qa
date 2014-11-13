/* Modifications to damage calculations that must be made since the
parser/heuristic missed them. */
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
			"addScale": "80 AP"
		} //I'm just approximating my own AP for their AP
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
		"E": {
			"multiplyBy": 3
		},
		"R": {
			"perSecond": true,
			"lasts": 5
		}
	},
	"Ryze": {
		"E": {
			"multiplyBy": 3
		}
	},
	"Brand": {
		"R": {
			"multiplyBy": 3
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
		}
	},
	"Jax": {
		"E": {
			"deleteStatementContaining": "e5"
		}
	},
	"Rengar": {
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
	"Nasus": {
		"E": {
			"perSecond": true,
			"lasts": "e3",
			"forStatementContaining": "e1 a1"
		},
		"R": {
			"perSecond": true,
			"lasts": 15
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
			"toggle": true
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
	},
	"Volibear": {
		"W": {
			"multiplyBy": 2
		}
	},
	"Lucian": {
		"R": {
			"multiplyBy": 33
		}
	}
};

/* Spells that we have to manually encode since the heuristic got caught up by them */
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
	},
	"Volibear": {
		"W": "{{ e3 }} (+{{ f1 }} [{{ e4 }}% of bonus Health])"
	},
	"Nunu": {
		"R": "{{ e1 }} (+{{ a1 }}) magic damage"
	},
	"Shyvana": {
		"Q": "(+{{ f1 }}) physical damage"
	},
	"Dr. Mundo": {
		"Q": "{{ e2 }}% of the target's current Health"
	},
	"Sejuani": {
		"Q": "{{ e1 }} (+{{ a1 }}) plus {{ e3 }}% of the target's maximum Health"
	},
	"Quinn": {
		"R": "{{ e6 }} (+{{ a2 }}) physical damage"
	},
	"Hecarim": {
		"E": "{{ e3 }} (+{{ f2 }}) physical damage"
	},
	"Lucian": {
		"R": "{{ e2 }} (+{{ a1 }}) (+{{ a2 }}) physical damage."
	},
	"Nasus": {
		"R": "{{ e3 }}% (+{{ a1 }})% of nearby enemies' maximum Health each second"
	},
	"Jinx": {
		"R": "{{ e2 }} (+{{ a2 }}) Physical Damage plus {{ e3 }}% of the target's missing Health"
	},
	"Taric": {
		"E": "{{ e3 }} (+{{ a2 }}) magic damage. "
	},
	"Vel'Koz": {
		"R": "{{ e1 }} (+{{ a1 }}),"
	},
	"Ezreal": {
		"W": "{{ e1 }} (+{{ a1 }}) magic damage."
	},
	"Ryze": {
		"Q": "{{ e1 }} (+{{ a1 }}) plus (+{{ f1 }}) in magic damage.",
		"W": "{{ e2 }} (+{{ a1 }}) plus (+{{ f1 }}) in magic damage.",
		"E": "{{ e1 }} (+{{ a1 }}) plus (+{{ f1 }}) magic damage"
	},
	"Gnar": {
		"E": "{{ e1 }} (+{{ f1 }}) [6% of Gnar's Max Health]"
	},
	"Sejuani": {
		"W": "{{ e3 }} (+{{ a2 }}) {{ e5 }} (+{{ f1 }} (+{{ a1 }}) magic damage"
	},
	"Zac": {
		"W": "{{ e1 }} Magic Damage +{{ e3 }}% (+{{ a1 }})% of the enemy's maximum Health"
	},
	"Amumu": {
		"W": "{{ e2 }} magic damage plus {{ e1 }}% (+{{ a1 }})% of their maximum Health"
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
	"EliseR","EliseR2","ShacoQ","KayleE","JaxR","NasusQ","DravenQ","Cho'GathE","Miss FortuneW",
	"RengarQ"];

/* Spells that the heuristic thinks are not damaging spells when they in fact are. */
var trueNegatives =
	["AzirE","MalzaharW","NunuR","AkaliE","LucianQ","EzrealW"];

/* Keywords that refer to damaging abilities. Used in the heuristic to find spells
that do damage. */
var keywords = ["afflicts","cleaves","damaging","shoots","slicing","take","takes","taking","deal","deals","dealt","dealing","does","doing","suffer"];