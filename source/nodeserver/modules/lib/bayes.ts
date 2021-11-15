import { stem } from "./stemmer";
import { fs } from "file-system";
// import * as total_links_inf from 'server/data/total_links_inf.json'
// var json = require('./server/data/total_links_inf.json');

export class Bayes {
    cache_elements: string[];
    links_docs: any[];
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
        // if (this.cache_elements.indexOf(letter[i]) != -1) {
        //     letter[i] = "";
        // }
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
    loadTrainData() {
        return new Promise((resolve, reject) => {

        });
    }
    getStemElements(arr) {
        return arr.map((elem) => {
            if (elem != '') {
                return stem(elem);
            }

            // console.log("stemfer", stemfer.russian(elem));
        });
    }
    trainByLetter(letter: string, links_docs: any[], user_docs_links) {
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
        let find_link = false,
            new_links = [];
        const prepositions = ["по", "", "из", "на", "в", "а", "при", "также", "но", "вы", "об", "как", "не", "или", "пожалуйста", "да", "для", "того", "чтобы", "это", "же", "так", "ваш"];

        // console.log("links_docs", links_docs);
        // cache_words = ["аленушка"];
        cache_words = this.getStemElements(cache_words);

        [cache_words, cache_counts_words] = this.countElements(cache_words);
        //получить ссылки
        let new_total_result, new_total_links_inf;
        const total_links_inf = fs.readFileSync('./server/data/total_links_inf.json');
        const total_result = fs.readFileSync('./server/data/total_result.json');

        // fs.readFile("./server/data/total_result.json", "utf8", (err, jsonString) => {
        if (!total_result || !total_links_inf) {
            return { result: false, message: "Не удалось загрузить файл с данными для обучения. " };
        }
        console.log("user_docs_links", user_docs_links);
        try {
            new_total_links_inf = { ...JSON.parse(total_links_inf) };
            new_total_result = { ...JSON.parse(total_result) };
            // console.log("Load File cache_words", cache_words);

            cache_words.forEach(word => {

                if (prepositions.indexOf(word) == -1) {

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

                        // console.log("new_file[elem].link", word, new_total_result[word]);
                        new_total_result[word].links.forEach(elem_link_result => {
                            // console.log("letter_link", letter_link);
                            if (elem_link_result.link == user_link) {

                                elem_link_result.count += cache_counts_words[index];;
                                elem_link_result.count_documents += 1;

                                find_link = true;
                                // console.log("!!!!!!!!!!! ", elem, cache_counts_words[index]);

                                new_total_result[word].count += cache_counts_words[index];
                                if (new_total_links_inf[user_link].indexOf(word) == -1) {
                                    new_total_links_inf[user_link].push(word)
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
                    // });
                }
                // console.log("new_total_result", new_total_result);
                // console.log(json);


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
            return "somethink"
            // => "Customer address is: Infinity Loop Drive"
        } catch (err) {
            console.log("errr", err);
            return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
        }
        // });
        // console.log("links_docs=> ", links_docs);
        // cache_words.forEach(elem => {
        //     if (prepositions.indexOf(elem) == -1) {
        //         //
        //     }
        // });
        // $article = preg_replace('|[\s]+|s', ' ', mb_strtolower($article));
        // $article = explode(' ', $article);
        // $article = array_filter(array_count_values($article), function($v){
        //     return $v > 0;
        // });
        // $new_result = [];

        // foreach($article as $word=>$count){

        //     if(strlen($word) > 2 && !in_array($word, $prepositions)){

        //         $word = $stemmer->russian($word);

        //         if(!array_key_exists($word,$total_result)){
        //             $tmp = new StdClass();
        //             $tmp->count = 0;

        //             $tmp->links = [];
        //             $total_result[$word] = $tmp;
        //         }
        //         foreach($elem->links as $link_from_letter){
        //             $find_link = false;
        //             $new_links = [];
        //             foreach(  $total_result[$word]->links as $elem_link_result){
        //                 $elem_link_result = (array)$elem_link_result;
        //                 if($elem_link_result['link'] == $link_from_letter){
        //                     $elem_link_result['count_documents'] += 1;
        //                     $elem_link_result['count'] += $count;
        //                     $find_link = true;
        //                     $total_result[$word]->count += $count;
        //                 }
        //                 $new_links []= $elem_link_result;

        //             }
        //             if(!$find_link){
        //                 if(!array_key_exists($link_from_letter, $total_links_inf)){
        //                     $total_links_inf[$link_from_letter] = [];
        //                 }
        //                 if(!is_array($total_links_inf[$link_from_letter ])){
        //                     $total_links_inf[$link_from_letter] = [];
        //                 }
        //                 $tmp = new StdClass();
        //                 $tmp->count = 1;
        //                 $tmp->count_documents = 1;
        //                 $tmp->link = $link_from_letter;
        //                 $new_links []=  $tmp;
        //                 $total_result[$word]->count += 1;
        //             }
        //         }
        //         $total_result[$word]->links = $new_links ;
        //     }
        // }
    }
}
