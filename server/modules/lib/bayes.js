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
        letter.split("").forEach((element) => {
            if (cache_elements.indexOf(element) == -1 && element != "") {
                result.push(element);
            }
        });
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
    getStemElements(arr) {
        return arr.map((elem) => {
            if (elem != '') {
                return (0, stemmer_1.stem)(elem);
            }
        });
    }
    trainByLetter(letter, links_docs, user_docs_links) {
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
        let cache_words = this.getWordsFromLetter(letter, cache_elements), tmp, cache_counts_words;
        let find_link = false, new_links = [];
        const prepositions = ["по", "", "из", "на", "в", "а", "при", "также", "но", "вы", "об", "как", "не", "или", "пожалуйста", "да", "для", "того", "чтобы", "это", "же", "так", "ваш"];
        cache_words = this.getStemElements(cache_words);
        [cache_words, cache_counts_words] = this.countElements(cache_words);
        let new_total_result, new_total_links_inf;
        const total_links_inf = file_system_1.fs.readFileSync('./server/data/total_links_inf.json');
        const total_result = file_system_1.fs.readFileSync('./server/data/total_result.json');
        if (!total_result || !total_links_inf) {
            return { result: false, message: "Не удалось загрузить файл с данными для обучения. " };
        }
        console.log("user_docs_links", user_docs_links);
        try {
            new_total_links_inf = Object.assign({}, JSON.parse(total_links_inf));
            new_total_result = Object.assign({}, JSON.parse(total_result));
            cache_words.forEach(word => {
                if (prepositions.indexOf(word) == -1) {
                    if (!new_total_result[word]) {
                        tmp = {};
                        tmp.count = 0;
                        tmp.links = [];
                        new_total_result[word] = tmp;
                    }
                    new_links = [];
                    user_docs_links.forEach((user_link, index, arr) => {
                        find_link = false;
                        new_total_result[word].links.forEach(elem_link_result => {
                            if (elem_link_result.link == user_link) {
                                elem_link_result.count += cache_counts_words[index];
                                ;
                                elem_link_result.count_documents += 1;
                                find_link = true;
                                new_total_result[word].count += cache_counts_words[index];
                                if (new_total_links_inf[user_link].indexOf(word) == -1) {
                                    new_total_links_inf[user_link].push(word);
                                }
                            }
                            new_links.push(elem_link_result);
                        });
                        if (!find_link) {
                            console.log("Not Find new word", word);
                            if (!new_total_links_inf[user_link] || !Array.isArray(new_total_links_inf[user_link])) {
                                new_total_links_inf[user_link] = [];
                            }
                            new_total_links_inf[user_link].push(word);
                            tmp = {};
                            tmp.count = 1;
                            tmp.count_documents = 1;
                            tmp.link = user_link;
                            new_links.push(tmp);
                            console.log(new_links);
                            console.log("\n\n");
                            new_total_result[word].count += 1;
                        }
                    });
                    new_total_result[word].links = new_links;
                }
            });
            file_system_1.fs.writeFile('./server/data/new_total_result_test.json', JSON.stringify(new_total_result), function (error) {
                if (error) {
                    return { result: false, message: "Не удалось записать файл с данными для обучения. (new_total_result.json)" };
                }
            });
            file_system_1.fs.writeFile('./server/data/total_links_inf_test.json', JSON.stringify(new_total_links_inf), function (error) {
                if (error) {
                    return { result: false, message: "Не удалось записать файл с данными для обучения. (total_links_inf.json)" };
                }
            });
            return "somethink";
        }
        catch (err) {
            console.log("errr", err);
            return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
        }
    }
}
exports.Bayes = Bayes;

//# sourceMappingURL=../../maps/modules/lib/bayes.js.map
