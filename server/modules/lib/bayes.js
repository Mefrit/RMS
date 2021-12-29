"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayes = void 0;
const stemmer_1 = require("./stemmer");
const file_system_1 = require("file-system");
class Bayes {
    constructor(path2) {
        this.prepositions = [
            "по",
            "",
            "из",
            "на",
            "в",
            "а",
            "при",
            "также",
            "но",
            "вы",
            "об",
            "как",
            "не",
            "или",
            "пожалуйста",
            "да",
            "для",
            "того",
            "чтобы",
            "это",
            "же",
            "так",
            "ваш",
        ];
        this.symvols = [
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
            ",",
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
    getStemElements(arr) {
        return arr.map((elem) => {
            if (elem != "") {
                return (0, stemmer_1.stem)(elem);
            }
        });
    }
    getRecomendation(letter, links_docs) {
        let cache_words = this.getWordsFromLetter(letter, this.symvols), cache_find_links = [], inf_word, cache_probability_links = [], probability;
        const total_links_inf = JSON.parse(file_system_1.fs.readFileSync("./server/data/total_links_inf.json"));
        const total_result = JSON.parse(file_system_1.fs.readFileSync("./server/data/total_result.json"));
        cache_words.forEach((word) => {
            inf_word = total_result[(0, stemmer_1.stem)(word)];
            cache_find_links = [];
            if (inf_word == undefined) {
                inf_word = total_result[word];
            }
            if (inf_word != undefined) {
                inf_word.links.forEach((elem_link) => {
                    probability = elem_link.count_documents / (Object.keys(total_links_inf).length - 1);
                    cache_find_links.push(elem_link.link);
                    if (!cache_probability_links[elem_link.link]) {
                        cache_probability_links[elem_link.link] = probability;
                    }
                    cache_probability_links[elem_link.link] += Math.log((1 + elem_link.count) /
                        (1 * Object.keys(total_result).length + total_links_inf[elem_link.link].length));
                });
                cache_probability_links = this.setLinkNotFoundWithCheck(total_links_inf, total_result, cache_probability_links, cache_find_links);
            }
            else {
                if (word != "" && this.prepositions.indexOf(word) == -1) {
                    cache_probability_links = this.setLinkNotFound(total_links_inf, total_result, cache_probability_links);
                }
            }
        });
        let sortable = [];
        for (var key in cache_probability_links) {
            sortable[key] = cache_probability_links[key];
        }
        let sorted_keys = this.getSortedKeys(sortable);
        let new_sortable = [];
        let count = 0;
        sorted_keys.forEach((elem, index, arr) => {
            if (count < 5) {
                new_sortable[elem] = sortable[elem];
            }
            count++;
        });
        return this.prepareDocsLinks(new_sortable, links_docs);
    }
    getSortedKeys(obj) {
        var keys = Object.keys(obj);
        return keys.sort(function (a, b) {
            return obj[b] - obj[a];
        });
    }
    prepareDocsLinks(cache_chosen_links, links_docs) {
        let result = [];
        for (let link in cache_chosen_links) {
            links_docs.forEach((link_obj) => {
                if (link_obj.url == link) {
                    result.push(link_obj);
                }
            });
        }
        return result;
    }
    setLinkNotFound(total_links_inf, total_result, cache_probability_links) {
        let probability, new_result = Object.assign({}, cache_probability_links);
        for (let key in total_links_inf) {
            if (!new_result.hasOwnProperty(key)) {
                probability = 1 / Object.keys(total_links_inf).length;
                new_result[key] = probability;
            }
            new_result[key] += Math.log(1 / (1 * Object.keys(total_result).length + total_links_inf[key].length));
        }
        return new_result;
    }
    setLinkNotFoundWithCheck(total_links_inf, total_result, cache_probability_links, cache_find_links) {
        let probability, new_result = Object.assign({}, cache_probability_links);
        for (let key in total_links_inf) {
            if (cache_find_links.indexOf(key) == -1) {
                if (!new_result.hasOwnProperty(key)) {
                    probability = 1 / Object.keys(total_links_inf).length;
                    new_result[key] = probability;
                }
                cache_find_links.push(key);
                new_result[key] += Math.log(1 / (1 * Object.keys(total_result).length + total_links_inf[key].length));
            }
        }
        return new_result;
    }
    trainByLetter(letter, links_docs, user_docs_links) {
        let cache_words = this.getWordsFromLetter(letter, this.symvols), tmp, cache_counts_words;
        let find_link = false, new_links = [];
        cache_words = this.getStemElements(cache_words);
        [cache_words, cache_counts_words] = this.countElements(cache_words);
        let new_total_result, new_total_links_inf;
        const total_links_inf = file_system_1.fs.readFileSync("./server/data/total_links_inf.json");
        const total_result = file_system_1.fs.readFileSync("./server/data/total_result.json");
        if (!total_result || !total_links_inf) {
            return { result: false, message: "Не удалось загрузить файл с данными для обучения. " };
        }
        try {
            new_total_links_inf = Object.assign({}, JSON.parse(total_links_inf));
            new_total_result = Object.assign({}, JSON.parse(total_result));
            cache_words.forEach((word) => {
                if (this.prepositions.indexOf(word) == -1) {
                    if (!new_total_result.hasOwnProperty(word)) {
                        tmp = {};
                        tmp.count = 0;
                        tmp.links = [];
                        new_total_result[word] = tmp;
                    }
                    new_links = [];
                    new_links = new_total_result[word].links;
                    user_docs_links.forEach((user_link, index, arr) => {
                        find_link = false;
                        new_links = new_links.map((elem_link_result) => {
                            if (elem_link_result.link == user_link) {
                                elem_link_result.count += cache_counts_words[index];
                                elem_link_result.count_documents += 1;
                                find_link = true;
                                new_total_result[word].count += cache_counts_words[index];
                                if (new_total_links_inf[user_link].indexOf(word) == -1) {
                                    new_total_links_inf[user_link].push(word);
                                }
                            }
                            return elem_link_result;
                        });
                        if (!find_link) {
                            find_link = false;
                            if (!new_total_links_inf[user_link] || !Array.isArray(new_total_links_inf[user_link])) {
                                new_total_links_inf[user_link] = [];
                            }
                            new_total_links_inf[user_link].push(word);
                            tmp = {};
                            tmp.count = 1;
                            tmp.count_documents = 1;
                            tmp.link = user_link;
                            new_links.push(tmp);
                            new_total_result[word].count += 1;
                        }
                    });
                    new_total_result[word].links = new_links;
                }
            });
            file_system_1.fs.writeFile("./server/data/total_result.json", JSON.stringify(new_total_result), function (error) {
                if (error) {
                    return {
                        result: false,
                        message: "Не удалось записать файл с данными для обучения. (new_total_result.json)",
                    };
                }
            });
            file_system_1.fs.writeFile("./server/data/total_links_inf.json", JSON.stringify(new_total_links_inf), function (error) {
                if (error) {
                    return {
                        result: false,
                        message: "Не удалось записать файл с данными для обучения. (total_links_inf.json)",
                    };
                }
            });
            return { result: true };
        }
        catch (err) {
            return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
        }
    }
    trainByOldData() {
        const total_key_words = file_system_1.fs.readFileSync("./server/data/keywords.json");
        const total_result = file_system_1.fs.readFileSync("./server/data/total_result_started.json");
        let new_total_result = Object.assign({}, JSON.parse(total_result));
        let json_total_key_words = Object.assign({}, JSON.parse(total_key_words));
        let result = {}, new_links;
        for (let key in new_total_result) {
            if (isNaN(Number(key))) {
                if (!result[(0, stemmer_1.stem)(key)]) {
                    result[(0, stemmer_1.stem)(key)] = { count: 0, links: [] };
                }
                new_links = result[(0, stemmer_1.stem)(key)].links;
                new_total_result[key].links.forEach((element_new_link) => {
                    if (!this.checkLinks(new_links, element_new_link.link)) {
                        result[(0, stemmer_1.stem)(key)].count += element_new_link.count;
                        new_links.push(element_new_link);
                    }
                });
                result[(0, stemmer_1.stem)(key)].links = new_links;
            }
        }
        let element;
        for (let i in json_total_key_words) {
            element = json_total_key_words[i];
            element.keys.forEach((key) => {
                if (!result[key]) {
                    result[key] = { count: 0, links: [] };
                }
                new_links = result[key].links;
                element.links.forEach((link_obj) => {
                    if (!this.checkLinks(new_links, link_obj.link)) {
                        result[key].count += 100;
                        new_links.push({ count: 100, count_documents: 1, link: link_obj.link });
                    }
                });
                result[key].links = new_links;
            });
        }
        file_system_1.fs.writeFile("./server/data/total_result.json", JSON.stringify(result), function (error) {
            if (error) {
                return {
                    result: false,
                    message: "Не удалось записать файл с данными для обучения. (new_total_result.json)",
                };
            }
        });
    }
    checkLinks(cache_links, link) {
        let result = false;
        cache_links.forEach((element) => {
            if (element.link == link) {
                result = true;
            }
        });
        return result;
    }
}
exports.Bayes = Bayes;

//# sourceMappingURL=../../maps/modules/lib/bayes.js.map
