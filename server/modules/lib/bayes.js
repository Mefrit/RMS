"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayes = void 0;
const stemmer_1 = require("./stemmer");
class Bayes {
    constructor(path2) {
        this.cache_elements = [
            "-",
            '"',
            "'",
            "!",
            "?",
            ".",
            "(",
            ")",
            "/",
            "\\",
            "<",
            ">",
            "  ",
            ",",
            ";",
            "&quot",
            "—",
            "«",
            "»",
            "/s+/",
        ];
    }
    getWordsFromLetter(letter) {
        letter = letter.toLowerCase();
        letter = letter.replace(/<\/?[a-zA-Z]+>/gi, "").trim();
        letter = letter.replace(/\s+/g, " ");
        let result = [];
        console.log(letter);
        letter.split("").forEach((element) => {
            if (this.cache_elements.indexOf(element) == -1 && element != "") {
                result.push(element);
            }
        });
        return result.join("").split(" ");
    }
    trainByLetter(letter, links) {
        let cache_words = this.getWordsFromLetter(letter);
        const stemfer = new stemmer_1.default();
        console.log("after!!!", cache_words);
        cache_words = ["добрый"];
        cache_words.forEach((elem) => {
            console.log("stemfer", stemfer.russian(elem));
        });
    }
}
exports.Bayes = Bayes;

//# sourceMappingURL=../../maps/modules/lib/bayes.js.map
