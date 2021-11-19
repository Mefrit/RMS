import { stem } from "./stemmer";
import { fs } from "file-system";
// import * as total_links_inf from 'server/data/total_links_inf.json'
// var json = require('./server/data/total_links_inf.json');

export class Bayes {
    cache_elements: string[];
    links_docs: any[];
    prepositions: any;
    symvols: any;
    constructor(path2) {
        this.prepositions = ["по", "", "из", "на", "в", "а", "при", "также", "но", "вы", "об", "как", "не", "или", "пожалуйста", "да", "для", "того", "чтобы", "это", "же", "так", "ваш"];
        this.symvols = ["-", "\"", "'", "!", "?", ".", "(", ")", "/", "\\", "<", ">", ",", "-", '"', "'", "!", "№", "?", ".", "(", ")", "/", "\\", "<", ">", ",", ";", "&quot", "—", "«", "»", "/s+/",];
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
            } else {
                b[b.length - 1]++;
            }
            prev = arr[i];
        }

        return [a, b];
    }
    // loadTrainData() {
    //     return new Promise((resolve, reject) => {

    //     });
    // }
    getStemElements(arr) {
        return arr.map((elem) => {
            if (elem != '') {
                return stem(elem);
            }
        });
    }
    getRecomendation(letter, links_docs) {
        // replace JS
        console.log("getRecomendation");
        let cache_words = this.getWordsFromLetter(letter, this.symvols),
            cache_find_links = [],
            inf_word,
            cache_probability_links = [],
            probability;
        const total_links_inf = JSON.parse(fs.readFileSync('./server/data/total_links_inf.json'));
        const total_result = JSON.parse(fs.readFileSync('./server/data/total_result.json'));
        const about_links = JSON.parse(fs.readFileSync('./server/data/about_links.json'));
        cache_words = this.getStemElements(cache_words);

        console.log("tcache_words", cache_words);
        cache_words.forEach(word => {
            // console.log(word, total_result[word]);
            inf_word = total_result[word];
            cache_find_links = [];
            if (inf_word) {
                inf_word.links.forEach(elem_link => {
                    probability = elem_link.count_documents / (Object.keys(total_links_inf).length - 1);
                    // console.log("probability", elem_link.link, elem_link.count_documents, probability, "  Object.keys(total_links_inf).length", Object.keys(total_links_inf).length)
                    cache_find_links.push(elem_link.link)

                    if (!cache_probability_links[elem_link.link]) {
                        cache_probability_links[elem_link.link] = probability;
                    }
                    // console.log(total_links_inf.length, total_links_inf[elem_link.link].length, elem_link.count, "!!!!!!", Math.log((1 + elem_link.count) /
                    // (1 * Object.keys(total_links_inf).length + total_links_inf[elem_link.link].length)));
                    // console.log(elem_link.link, total_links_inf[elem_link.link].length);
                    cache_probability_links[elem_link.link] += Math.log((1 + elem_link.count) /
                        (1 * (Object.keys(total_links_inf).length - 1) + total_links_inf[elem_link.link].length));

                });
                cache_probability_links = this.setLinkNotFoundWithCheck(total_links_inf, total_result, cache_probability_links, cache_find_links)
            } else {
                if (word != "" && this.prepositions.indexOf(word) == -1) {
                    // дефолтные 3 ссылки
                    cache_probability_links = this.setLinkNotFound(total_links_inf, total_result, cache_probability_links);
                }
            }
        });

        let sortable = [];
        // );
        for (var key in cache_probability_links) {
            sortable[key] = cache_probability_links[key];
        }
        // console.log(" AFTER ALL Sortable ", sortable);
        let sorted_keys = this.getSortedKeys(sortable);

        let new_sortable = [];
        let count = 0;
        sorted_keys.forEach((elem, index, arr) => {
            if (count < sorted_keys.length) {
                new_sortable[elem] = sortable[elem];
            }
            count++;
        });
        console.log(" new_sortable ", new_sortable);
        // return [];
        // console.log("this.prepareDocsLinks(new_sortable, about_links)", this.prepareDocsLinks(new_sortable, about_links));
        return this.prepareDocsLinks(new_sortable, about_links)
    }
    getSortedKeys(obj) {
        var keys = Object.keys(obj);
        return keys.sort(function (a, b) { return obj[b] - obj[a] });
    }
    prepareDocsLinks(cache_chosen_links, about_links) {
        let result = [];
        console.log("about_links", about_links);
        console.log("cache_chosen_links", cache_chosen_links);
        for (let link in cache_chosen_links) {
            about_links.forEach(link_obj => {
                // console.log("link_obj =>  ", link_obj.title);

                if (link_obj.link == link) {
                    link_obj.url = link_obj.link;
                    link_obj.mark = cache_chosen_links[link];
                    delete link_obj.link;
                    result.push(link_obj);
                }

            });
        }
        return result;
    }
    setLinkNotFound(total_links_inf, total_result, cache_probability_links) {
        let probability, new_result = { ...cache_probability_links };
        for (let key in total_links_inf) {
            console.log("HERE setLinkNotFound");
            if (!new_result[key] || new_result[key] === undefined) {
                probability = 1 / Object.keys(total_links_inf).length;
                new_result[key] = probability;
            }

            new_result[key] = Math.log(1 / (1 * Object.keys(total_result).length + total_links_inf[key].length))

            // console.log("key", key);
        }
        // foreach($total_links_inf as $key => $elem_word){
        //     if (!array_key_exists($key, $cache_probability)) {
        //         $probability = 1 / count((array)$total_links_inf);
        //         $cache_probability[$key] = $probability;
        //     }
        //     $cache_probability[$key] += log(1 / (1 * count((array)$total_result) + count($elem_word)));
        // }
        return cache_probability_links;
    }
    setLinkNotFoundWithCheck(total_links_inf, total_result, cache_probability_links, cache_find_links) {
        let probability, new_result = { ...cache_probability_links };
        // console.log("  Array.from(total_links_inf)", total_links_inf);
        // total_links_inf.forEach((elem_word: any, key, arr) => {

        for (let key in total_links_inf) {
            console.log("key => ", key);
            if (cache_find_links.indexOf(key) == -1) {
                // if (key.indexOf("personal") != -1) {
                //     console.log("HERE", !new_result[key], "total_links_inf==> ", key, total_links_inf[key].length);
                // }

                if (!new_result[key] || new_result[key] === undefined) {
                    probability = 1 / Object.keys(total_links_inf).length;
                    new_result[key] = probability;
                }
                cache_find_links.push(key);
                new_result[key] = Math.log(1 / (1 * Object.keys(total_result).length + total_links_inf[key].length))
            }
            // console.log("key", key);
        }

        //     if (cache_find_links.indexOf(key) == -1) {
        //         console.log("HEREEE");
        //         if (!new_result[key]) {
        //             probability = 1 / Object.keys(total_links_inf).length;
        //             new_result[key] = probability;
        //         }

        //         cache_find_links.push(key);
        //         new_result[key] = Math.log(1 / (1 * total_result.length + elem_word.count))
        //     }


        return new_result;
    }
    // private function setLinkNotFoundWithCheck($total_links_inf, $total_result, $cache_probability, $cache_finds_link, $probability){
    //     foreach($total_links_inf as $key => $elem_word){
    //         if(!in_array($key, $cache_finds_link)){
    //             if(!array_key_exists($key, $cache_probability)){
    //                 $probability = 1 / count((array)$total_links_inf);
    //                 $cache_probability[$key] = $probability;
    //             }
    //             $cache_finds_link []= $key;
    //             $cache_probability[$key] += log(1  / (1 *  count((array)$total_result) + count($elem_word)));
    //         }
    //     }
    //     return $cache_probability;
    // }
    trainByLetter(letter: string, links_docs: any[], user_docs_links) {

        let cache_words = this.getWordsFromLetter(letter, this.symvols), tmp, cache_counts_words;
        let find_link = false,
            new_links = [];

        cache_words = this.getStemElements(cache_words);

        [cache_words, cache_counts_words] = this.countElements(cache_words);
        //получить ссылки
        let new_total_result, new_total_links_inf;
        const total_links_inf = fs.readFileSync('./server/data/total_links_inf.json');
        const total_result = fs.readFileSync('./server/data/total_result.json');

        if (!total_result || !total_links_inf) {
            return { result: false, message: "Не удалось загрузить файл с данными для обучения. " };
        }
        try {
            new_total_links_inf = { ...JSON.parse(total_links_inf) };
            new_total_result = { ...JSON.parse(total_result) };
            // console.log("Load File cache_words", cache_words);

            cache_words.forEach(word => {

                if (this.prepositions.indexOf(word) == -1) {

                    // new_file[elem].links.forEach(link_elem => {
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

                                elem_link_result.count += cache_counts_words[index];;
                                elem_link_result.count_documents += 1;

                                find_link = true;
                                new_total_result[word].count += cache_counts_words[index];
                                if (new_total_links_inf[user_link].indexOf(word) == -1) {
                                    new_total_links_inf[user_link].push(word)
                                }
                            }
                            new_links.push(elem_link_result);
                        });
                        if (!find_link) {
                            if (!new_total_links_inf[user_link] || !Array.isArray(new_total_links_inf[user_link])) {
                                new_total_links_inf[user_link] = [];
                            }
                            new_total_links_inf[user_link].push(word);
                            tmp = {};
                            tmp.count = 1;
                            tmp.count_documents = 1;
                            tmp.link = user_link;

                            new_links.push(tmp);
                            // console.log(new_links);
                            // console.log("\n\n");
                            new_total_result[word].count += 1;
                        }
                    });
                    new_total_result[word].links = new_links;
                }
            });
            fs.writeFile('./server/data/new_total_result_test.json', JSON.stringify(new_total_result), function (error) {
                if (error) {
                    return { result: false, message: "Не удалось записать файл с данными для обучения. (new_total_result.json)" };
                }// если возникла ошибка

            });
            fs.writeFile('./server/data/total_links_inf_test.json', JSON.stringify(new_total_links_inf), function (error) {
                if (error) {
                    return { result: false, message: "Не удалось записать файл с данными для обучения. (total_links_inf.json)" };
                }// если возникла ошибка

            });
            return { result: true };

        } catch (err) {
            console.log("errr", err);
            return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
        }

    }
}
