"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayes = void 0;
const stemmer_1 = require("./stemmer");
const file_system_1 = require("file-system");
class Bayes {
    constructor(path2) {
    }
    getWordsFromLetter(letter, cache_elements) {
        letter = letter.toLowerCase();
        letter = letter.replace(/<\/?[a-zA-Z]+>/gi, "").trim();
        letter = letter.replace(/\s+/g, " ");
        let result = [];
        console.log("letter ==> ", letter);
        letter.split("").forEach((element) => {
            if (cache_elements.indexOf(element) == -1 && element != "") {
                result.push(element);
            }
        });
        console.log("result", result);
        return result.join("").split(" ");
    }
    countElements(arr) {
        var a = [], b = [], prev;
        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== prev) {
                a.push(arr[i]);
                b.push(1);
            }
            else {
                b[b.length - 1]++;
            }
            prev = arr[i];
        }
        return [a, b];
    }
    loadTrainData() {
        return new Promise((resolve, reject) => {
        });
    }
    getStemElement(cache_words) {
        return cache_words.map((elem) => {
            return (0, stemmer_1.stem)(elem);
        });
    }
    trainByLetter(letter, links_docs) {
        const cache_elements = [
            "-",
            '"',
            "'",
            "!",
            "№",
            "?",
            ".",
            "(",
            ")",
            "/",
            "\\",
            "<",
            ">",
            ",",
            ";",
            "&quot",
            "—",
            "«",
            "»",
            "/s+/",
        ];
        let cache_words = this.getWordsFromLetter(letter, cache_elements);
        const prepositions = ["по", "из", "на", "в", "а", "при", "также", "но", "вы", "об", "как", "не", "или", "пожалуйста", "да", "для", "того", "чтобы", "это", "же", "так", "ваш"];
        cache_words = this.getStemElement(cache_words);
        console.log(":start REad File", cache_words);
        file_system_1.fs.readFile("./server/data/total_result.json", "utf8", (err, jsonString) => {
            if (err) {
                return { result: false, message: "Не удалось загрузить файл с данными для обучения. " + err };
            }
            try {
                const file = JSON.parse(jsonString);
                console.log("Load File", typeof prepositions);
                cache_words.forEach(elem => {
                    if (prepositions.indexOf(elem) == -1) {
                    }
                    else {
                        console.log("not Found", elem, "\n");
                    }
                });
            }
            catch (err) {
                console.log("errr", err);
                return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
            }
        });
    }
}
exports.Bayes = Bayes;

//# sourceMappingURL=../../maps/modules/lib/bayes.js.map
