"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stemmer {
    russian(word) {
        let a = this.rv(word);
        console.log(a);
        let start = a[0];
        let rv = a[1];
        rv = this.step1(rv);
        rv = this.step2(rv);
        rv = this.step3(rv);
        rv = this.step4(rv);
        console.log("rv", rv);
        return start + rv;
    }
    rv(word) {
        let vowels = ["а", "е", "и", "о", "у", "ы", "э", "ю", "я"], flag = 0, rv_str = "", start = "";
        for (let i = 0; i < word.length; i += 2) {
            if (flag == 1)
                rv_str += word.slice(i, 2);
            else
                start += word.slice(i, 2);
            if (vowels.indexOf(word.slice(i, 2)) !== -1)
                flag = 1;
        }
        return [start, rv_str];
    }
    substitute(word, suffix_list) {
        suffix_list.forEach((suffix) => {
            if (this.has_suffix(word, suffix)) {
                word = this.cut_suffix(word, suffix);
            }
        });
        return word;
    }
    has_suffix(word, suffix) {
        return word.slice(-suffix.length) == suffix;
    }
    has_aya(word, suffix) {
        return word.slice(-suffix.length - 2, 2) == "а" || word.slice(word, -suffix.length - 2, 2) == "я";
    }
    cut_suffix(word, suffix) {
        return word.slice(0, word.length - suffix.length);
    }
    step1(word) {
        let perfective1 = ["в", "вши", "вшись"];
        perfective1.forEach((suffix) => {
            if (this.has_suffix(word, suffix) && this.has_aya(word, suffix)) {
                return this.cut_suffix(word, suffix);
            }
        });
        let perfective2 = ["ив", "ивши", "ившись", "ывши", "ывшись"];
        perfective2.forEach((suffix) => {
            if (this.has_suffix(word, suffix)) {
                return this.cut_suffix(word, suffix);
            }
        });
        let reflexive = ["ся", "сь"];
        word = this.substitute(word, reflexive);
        let adjective = [
            "ее",
            "ие",
            "ые",
            "ое",
            "ими",
            "ыми",
            "ей",
            "ий",
            "ый",
            "ой",
            "ем",
            "им",
            "ым",
            "ом",
            "его",
            "ого",
            "ему",
            "ому",
            "их",
            "ых",
            "ую",
            "юю",
            "ая",
            "яя",
            "ою",
            "ею",
        ];
        let participle2 = ["ем", "нн", "вш", "ющ", "щ"];
        let participle1 = ["ивш", "ывш", "ующ"];
        adjective.forEach((suffix) => {
            console.log(word, " suffix ", suffix);
            if (this.has_suffix(word, suffix)) {
                console.log(word, " suffix ", suffix);
                word = this.cut_suffix(word, suffix);
                participle1.forEach((suffix) => {
                    if (this.has_suffix(word, suffix) && this.has_aya(word, suffix))
                        word = this.cut_suffix(word, suffix);
                });
                return this.substitute(word, participle2);
            }
        });
        let verb1 = [
            "ла",
            "на",
            "ете",
            "йте",
            "ли",
            "й",
            "л",
            "ем",
            "н",
            "ло",
            "но",
            "ет",
            "ют",
            "ны",
            "ть",
            "ешь",
            "нно",
        ];
        verb1.forEach((suffix) => {
            if (this.has_suffix(word, suffix) && this.has_aya(word, suffix))
                return this.cut_suffix(word, suffix);
        });
        let verb2 = [
            "ила",
            "ыла",
            "ена",
            "ейте",
            "уйте",
            "ите",
            "или",
            "ыли",
            "ей",
            "уй",
            "ил",
            "ыл",
            "им",
            "ым",
            "ен",
            "ило",
            "ыло",
            "ено",
            "ят",
            "ует",
            "уют",
            "ит",
            "ыт",
            "ены",
            "ить",
            "ыть",
            "ишь",
            "ую",
            "ю",
        ];
        verb2.forEach((suffix) => {
            if (this.has_suffix(word, suffix))
                return this.cut_suffix(word, suffix);
        });
        let noun = [
            "а",
            "ев",
            "ов",
            "ие",
            "ье",
            "е",
            "иями",
            "ями",
            "ами",
            "еи",
            "ии",
            "и",
            "ией",
            "ей",
            "ой",
            "ий",
            "й",
            "иям",
            "ям",
            "ием",
            "ем",
            "ам",
            "ом",
            "о",
            "у",
            "ах",
            "иях",
            "ях",
            "ы",
            "ь",
            "ию",
            "ью",
            "ю",
            "ия",
            "ья",
            "я",
        ];
        noun.forEach((suffix) => {
            if (this.has_suffix(word, suffix))
                return this.cut_suffix(word, suffix);
        });
        return word;
    }
    step2(word) {
        if (word.slice(-2, 2) == "и")
            word = word.slice(0, word.length - 2);
        return word;
    }
    step3(word) {
        let vowels = ["а", "е", "и", "о", "у", "ы", "э", "ю", "я"];
        let flag = 0;
        let r1 = "";
        let r2 = "";
        for (let i = 0; i < word.length; i += 2) {
            if (flag == 2)
                r1 += word.slice(i, 2);
            if (vowels.indexOf(word.slice(i, 2)) !== -1)
                flag = 1;
            if (flag == 1 && vowels.indexOf(word.slice(i, 2)) === -1)
                flag = 2;
        }
        flag = 0;
        for (let i = 0; i < r1.length; i += 2) {
            if (flag == 2)
                r2 += r1.slice(i, 2);
            if (vowels.indexOf(r1.slice(i, 2)) !== -1)
                flag = 1;
            if (flag == 1 && vowels.indexOf(r1.slice(i, 2)) == -1)
                flag = 2;
        }
        let derivational = ["ост", "ость"];
        derivational.forEach((suffix) => {
            if (r2.slice(-suffix.length) == suffix)
                word = word.slice(0, r2.length - suffix.length);
        });
        return word;
    }
    step4(word) {
        if (word.slice(-2 * 2) == "нн")
            word = word.slice(0, word.length - 2);
        else {
            let superlative = ["ейш", "ейше"];
            superlative.forEach((suffix) => {
                if (word.slice(-suffix.length) == suffix)
                    word = word.slice(0, word.length - suffix.length);
            });
            if (word.slice(-2 * 2) == "нн")
                word = word.slice(0, word.length - 2);
        }
        if (word.slice(-2, 2) == "ь")
            word = word.slice(0, word.length - 2);
        return word;
    }
}
exports.default = Stemmer;

//# sourceMappingURL=../../maps/modules/lib/stemmer.js.map
