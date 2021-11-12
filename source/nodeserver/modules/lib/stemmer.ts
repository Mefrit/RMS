
//    var $PERFECTIVEGROUND = new RegExp ('((ив|ивши|ившись|ыв|ывши|ывшись)((?<=[ая])(в|вши|вшись)))$'); 
var PERFECTIVEGROUND = new RegExp('((ив|ивши|ившись|ыв|ывши|ывшись)(([ая]?)(в|вши|вшись)))$');
var REFLEXIVE = new RegExp('(с[яь])$');
var ADJECTIVE = new RegExp('(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$');
//    var $PARTICIPLE = new RegExp ('((ивш|ывш|ующ)|((?<=[ая])(ем|нн|вш|ющ|щ)))$'); 
var PARTICIPLE = new RegExp('((ивш|ывш|ующ)|(([ая]?)(ем|нн|вш|ющ|щ)))$');
//var VERB = new RegExp ('((ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ет|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)|((?<=[ая])(ла|на|ете|йте|лий|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)))$'); 
var VERB = new RegExp('((ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ет|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)|(([ая]?)(ла|на|ете|йте|лий|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)))$');
var NOUN = new RegExp('(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$');
var RVRE = new RegExp('^(.*?[аеиоуыэюя])(.*)$');
//    var $DERIVATIONAL = new RegExp ('[^аеиоуыэюя][аеиоуыэюя]+[^аеиоуыэюя]+[аеиоуыэюя].*(?<=о)сть?$'); 
var DERIVATIONAL = new RegExp('[^аеиоуыэюя][аеиоуыэюя]+[^аеиоуыэюя]+[аеиоуыэюя].*(о?)сть?$');
function s($s, $re, $to) {
    return $s.replace($re, $to);
}
function m($s, $re) {
    return $s.match($re);
}
export function stem(word) {
    var stem = word;
    do {
        var p = m(word, RVRE);
        if (!p || p.length != 3) break; // Выход из блока :)        
        var start = p[1];
        var rv = p[2];

        // Step 1 
        var rvx = s(rv, PERFECTIVEGROUND, '');
        if (rvx == rv) {
            rv = s(rvx, REFLEXIVE, '');
            rvx = s(rv, ADJECTIVE, '');

            if (rvx != rv) {
                rv = s(rvx, PARTICIPLE, '');
            } else {
                var rvy = s(rvx, VERB, '')


                if (rvy == rvx) {
                    rv = s(rvy, NOUN, '');
                } else {
                    rv = rvy;
                }
            }
        } else {
            rv = rvx;
        }

        // Step 2 
        rv = s(rv, new RegExp('и$'), '');

        // Step 3 
        if (m(rv, DERIVATIONAL)) {
            rv = s(rv, new RegExp('ость?$'), '');
        }

        // Step 4 
        rvx = s(rv, new RegExp('ь$'), '')
        if (rvx == rv) {
            rv = s(rvx, new RegExp('ейше?'), '');
            rv = s(rv, new RegExp('нн$'), 'н');
        } else {
            rv = rvx;
        }

        stem = start + rv;
    } while (false);
    return stem;
}

