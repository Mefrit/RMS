import { stem } from "./stemmer";
import { fs } from "file-system";
// const test = require('../../../../server/data/total_result.json');
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
        console.log("letter ==> ", letter);
        letter.split("").forEach((element) => {
            if (cache_elements.indexOf(element) == -1 && element != "") {
                result.push(element);
            }
        });
        console.log("result", result);
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
    getStemElement(cache_words) {
        return cache_words.map((elem) => {
            return stem(elem);
            // console.log("stemfer", stemfer.russian(elem));
        });
    }
    trainByLetter(letter: string, links_docs: any[]) {
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
        // letter = letter.replace(
        //     // Match all keys
        //     new RegExp(Object.keys(this.cache_elements).join("|"), "g"),
        //     // Just get value  from replacements
        //     function (i) {
        //         return this.cache_elements[i];
        //     }
        // );
        // const stemfer = new Stemmer();
        // console.log(cache_words);
        // cache_words = ["аленушка"];
        cache_words = this.getStemElement(cache_words);
        //получить ссылки
        // let count_words;
        // [cache_words, count_words] = this.countElements(cache_words);
        // console.log("cache_words, count_words", cache_words, count_words);
        console.log(":start REad File", cache_words);
        fs.readFile("./server/data/total_result.json", "utf8", (err, jsonString) => {
            if (err) {
                return { result: false, message: "Не удалось загрузить файл с данными для обучения. " + err };
            }
            try {
                const file = JSON.parse(jsonString);
                console.log("Load File", typeof prepositions);
                // console.l"og("Customer address is:", links);
                cache_words.forEach(elem => {

                    if (prepositions.indexOf(elem) == -1) {
                        // console.log(elem, file[elem], "\n");
                    } else {
                        console.log("not Found", elem, "\n");
                    }
                });
                // => "Customer address is: Infinity Loop Drive"
            } catch (err) {
                console.log("errr", err);
                return { result: false, message: "Не удалось обработать файл с данными для обучения. " + err };
            }
        });
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
