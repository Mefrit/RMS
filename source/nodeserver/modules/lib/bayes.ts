import Stemmer from "./stemmer";
export class Bayes {
    cache_elements: string[];
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
        // if (this.cache_elements.indexOf(letter[i]) != -1) {
        //     letter[i] = "";
        // }
    }
    trainByLetter(letter: string, links: any[]) {
        let cache_words = this.getWordsFromLetter(letter);

        // letter = letter.replace(
        //     // Match all keys
        //     new RegExp(Object.keys(this.cache_elements).join("|"), "g"),
        //     // Just get value  from replacements
        //     function (i) {
        //         return this.cache_elements[i];
        //     }
        // );
        const stemfer = new Stemmer();
        console.log("after!!!", cache_words);
        cache_words = ["добрый"];
        cache_words.forEach((elem) => {
            console.log("stemfer", stemfer.russian(elem));
        });
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
