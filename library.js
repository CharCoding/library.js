String.prototype.capitalize = function() {
	for(var i = 0, arr = this.split(' '); i < arr.length; i++) {
		var str = arr[i];
		if(str != "of") arr[i] = str.charAt(0).toUpperCase() + str.substr(1);
	}
	return arr.join(' ');
}; // capitalize all words, separated by spaces, excluding "of": str.capitalize();
function R(a) {
	return a[Math.floor(Math.random() * a.length)];
} // select random element from array or string
function r(n) {
	return n ? Math.random() <= n : Math.random();
} // return random decimal, optionally compares it with parameter.
function log(str) {
	if(debug) info.innerHTML += ++debugStep + ': ' + str + '<br />';
}
var timer,
	consonants = 'bcdfghjklmnpqrstvwxyz',
	vowels = 'aeiouy',
	consonants_start_2 = ['kn', 'pn', 'wr', 'ts', 'tw'],
	consonants_start_$h = ['g', 'p', 't', 'c', 's', 'sc', 'sp', 'k', 'w'], // Khaaaaaaan!!!
	consonants_start_$l = ['b', 'c', 'f', 'g', 'k', 'p', 'ph', 'ch', 'sp'], // $ is a placeholder
	consonants_start_$r = ['b', 'c', 'f', 'g', 'k', 'p', 't', 'ph', 'th', 'ch', 'sh', 'st', 'sc', 'sp'],
	consonants_start_s$ = 'cklmnpqtvw', // tr is not added. (st is present in $r for "str")
	// vowel_2, // use function instead, simpler.
	vowel_3 = ['eau'], // That's it?
	vowel_$r = ['a', 'e', 'i', 'o', 'u', 'y', 'ae', 'ai', 'au', 'ea', 'ee', 'ei', 'eu', 'ia', 'ie', 'io', 'oa', 'oe', 'oi', 'oo', 'ou', 'ua', 'ue'],
	vowel_$l = ['a', 'e', 'i', 'o', 'u', 'y', 'ai', 'au', 'ea', 'ee', 'ei', 'ia', 'ie', 'io', 'oa', 'oe', 'oi', 'oo', 'ou', 'ua', 'ue', 'ui'],
	vowel_$rl = 'aeiou',
	vowel_$w = 'aeo',
	vowel_$n = ['a', 'e', 'i', 'o', 'u', 'y', 'ai', 'au', 'ea', 'ee', 'ei', 'ia', 'ie', 'io', 'oa', 'oo', 'ua', 'ui'],
	vowel_$ng = vowel_$rl, // same
	vowel_$gh = ['ai', 'ou', 'ei', 'au'],
	consonants_end = 'bcdfghkmnpstvxz',
	consonants_end_2 = ['mb', 'mp', 'ck', 'cq', 'dg', 'ts'],
	consonants_end_$h = ['c', 's', 'p', 't', 'tc'],
	consonants_end_$t = 'cfkpsx',
	consonants_end_s$ = 'kmpt',
	consonants_end_double = ['bb', 'cc', 'dd', 'ff', 'gg', 'll', 'nn', 'pp', 'rr', 'ss', 'tt', 'zz'],
	presets = ['tion', 'sion', 'cion', 'xion'],
	directions = ['north', 'south', 'east', 'west', 'central', ''],
	country_prefix = ['new', 'united', 'united states of', 'republic of', 'empire of', 'imperial', 'great', 'greater', ''],
	country_suffix = ['a', 'ia', 'stan', 'land', 'ar', 'es', 'rus', 'na', 'ua', 'ea', ''],
	country_suffix_word = ['federation', 'kingdom', 'states', 'republic', 'empire', 'union', ''],
	city_prefix = ['new ', 'st. ', 'los ', 'novo', ''],
	city_suffix = ['grad', 'gorod', 'sk', 'ton', 'ville', 'berg', 'burg', 'jing', 'polis', 'by', 'ad', ' city', ''],
	punctuation = ['.', ',', '!', '?', ':', ';', '...'],
	punctuation_end = '.,!?',
	paragraph_end = ['.', '!', '?', '...'],
	debug = true, // log all actions
	debugStep = 0, // for logging

function vowel_2() {
	var str = R(vowels) + R(vowels);
	if(str.match(/[iy]{2}/)) return str.charAt(0); // if string is ii, iy, yi, or yy.
	return str;
}

function globalReplace(word, option) {
	log(word);
	if(option && r(.9)) { // prefixing and suffixing (country/city specific)
		if(option == 1) {
			if(r(.4)) word += R(country_suffix);
			var rand = r();
			if(rand < .3) word = R(directions) + ' ' + word;
			else if(rand < .6) word = R(country_prefix) + ' ' + word;
			else if(rand < .9) word += ' ' + R(country_suffix_word);
		} else {
			if(r(.5)) word += R(city_suffix);
			else if(r(.8)) word = R(city_prefix) + word; // prefix word should be rarer.
		}
		log(word + ((option == 1) ? " (countrified)" : " (citified)"));
	}
	word = word.replace(/[bcdfghjklmnpqrstvwxz]{5,}/g, function(match) { return match.substr(0, 4); }) // replace 5 consonants with 4
		.replace(/[aeiouy]{4,}/g, function(match) { return match.substr(1, 3); }) // replace 4 vowels with 3
		.replace(/((.)\2\2\2|(.)\3\3)/g, function(match) { return match.substr(0, 2); }) // replace 3 or 4 repeating letters
		.replace(/[bcdfghjklmnpqrstvwxz]([bcdfglnprstz])\1/g, function(match) { return match.substr(0, 2); }) // replace awkward double consonants
		.replace(/[iy]{2,}/g, function(match) { return match.charAt(0); }) // replace ii, iy, yi, yy
		.replace(/^x[^eyia]/g, function(match) { return match.substr(1); }) // replace [start of string]+x+[?] with [*]
		.replace(/[^ srlhvaeiouy]v/g, function(match) { return match.charAt(0); }) // replace [not:srlhvaeiouy]+v with [*]
		.replace(/.?k.k/g, function(match) { return match.slice(-2); }) // Don't let things like "cksk" slip (via citify)
		.replace(/dg$/, 'dge') // dg ending add e
		.replace(/q([^u])/g, 'qu$1'); // add u after q
	log(word + " (adjusted)");
	return word;
}

function localReplace(syl) {
	syl = syl.replace(/nm/g, function() { return r(.5) ? 'n' : 'm' }); // no m following n, pick one.
	syl = syl.replace(/gh[bcdfghkmpvxz]/g, function(match) { return match.substr(2); }); // gh non-silent
	return syl;
}
// MAIN WORD GENERATOR
// Uses: var foo = word(3,"country"); var bar = word(2); var baz = word(4,2); var qux = word(1,false);
function word(syllables, option) { // accepted options: 1, 2, "country", "city", [falsy value]
	if(option == "country") option = 1;
	else if(option == "city") option = 2;
	if(syllables == 2 && r(0.0025)) return 'ayylmao';
	var str = '',
		state = {
			start: true,
			end: false,
			consonantStart: false,
			consonantEnd: false,
			isLong: false
		},
		syl = '';
	for(var i = 0; i < syllables; i++) {
		if(r(.03) && !state.start && !option) syl = R(presets);
		else syl = localReplace(syllable(state));
		log(syl);
		state = updateState(syl);
		state.end = (i + 1) === syllables;
		str += syl;
	}
	return globalReplace(str, option);
}

function updateState(syllable) {
	var state = {
		start: false,
		end: false,
		consonantStart: false,
		consonantEnd: false,
		isLong: false
	};
	if(syllable.length >= 4) state.isLong = true;
	if(/^[bcdfghjklmnpqrstvwxyz]/.test(syllable)) state.consonantStart = true;
	if(/[bcdfghjklmnpqrstvwxyz]$/.test(syllable)) state.consonantEnd = true;
	return state;
}

function syllable(state) {
	var syl = '',
		rand = r(),
		shorten = false;
	if(state.start) {
		if(r(.5 + state.consonantEnd / 10)) syl += R(consonants);
		else if(r(.2 + state.consonantStart / 10 + state.consonantEnd / 10)) {
			if(rand < .2) syl += R(consonants_start_$h) + 'h';
			else if(rand < .4) syl += R(consonants_start_$l) + 'l';
			else if(rand < .6) syl += R(consonants_start_$r) + 'r';
			else if(rand < .8) syl += 's' + R(consonants_start_s$);
			else syl += R(consonants_start_2);
		}
	}
	rand = r();
	if(r(.9 + state.isLong / 10)) {
		if(rand < .01) syl += R(vowel_3);
		else if(rand < .5) syl += R(vowels);
		else if(rand < .6) syl += vowel_2(); // function
		else if(rand < .7) syl += R(vowel_$r) + 'r';
		else if(rand < .8) syl += R(vowel_$l) + 'l';
		else if(rand < .9) syl += R(vowel_$n) + 'n';
		else syl += R(vowel_$w) + 'w';
	} else {
		if(rand < .33) syl += R(vowel_$gh) + 'gh';
		else if(rand < .66) syl += R(vowel_$rl) + 'rl';
		else if(rand < .99) syl += R(vowel_$ng) + 'ng';
		else syl += R(vowel_3);
		shorten = true;
	}
	rand = r();
	if(shorten) syl += r(.8) ? R(consonants_end) : '';
	else if(r(.8 + state.consonantStart / 10)) {
		if(rand < .5) syl += R(consonants_end);
		else if(rand < .6) syl += R(consonants_end_2);
		else if(rand < .7) syl += R(consonants_end_$h) + 'h';
		else if(rand < .8) syl += R(consonants_end_$t) + 't';
		else if(rand < .9) syl += 's' + R(consonants_end_s$);
		else syl += R(consonants_end_double);
	}
	if(state.end && r(.1)) syl += 'e';
	return syl;
}

function display() {
	debugStep=0;
	info.innerHTML='';
	result.innerHTML=word(Math.min(+iteration.value,10),+type.value).capitalize();
	return false;
}

function paragraph() {
	var temp = debug;
	debug = false;
	timer = setInterval(sentence, 5);
	setTimeout(function() {
		clearInterval(timer);
		par.value = par.value.replace(/[,;:] $/, R(paragraph_end) + ' ')
			.replace(/ $/, '\r');
		debug = temp;
		par.scrollTop = par.scrollHeight;
	}, 20 + r() * 20); // crappy timing loop control
}

function sentence() {
	var sen = word(r() * 3 + 1 | 0)
		.capitalize();
	for(var i = 0; i < r() * 10 + 3; i++) sen += ' ' + word(r() * 3.95 + 1.15 | 0);
	if(r(0.05)) {
		sen = '"' + sen + R(punctuation_end) + '" ';
		par.value += sen;
		return;
	}
	if(r(0.7)) sen += '. ';
	else if(r(0.4)) {
		sen += r(0.5) ? '! ' : '? ';
	} else sen += R(punctuation) + ' ';
	par.value += sen;
}
