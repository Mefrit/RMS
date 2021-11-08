export default class Stemmer {
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
        let vowels = ["а", "е", "и", "о", "у", "ы", "э", "ю", "я"],
            flag = 0,
            rv_str = "",
            start = "";
        for (let i = 0; i < word.length; i += 2) {
            if (flag == 1) rv_str += word.slice(i, 2);
            else start += word.slice(i, 2);
            if (vowels.indexOf(word.slice(i, 2)) !== -1) flag = 1;
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
            if (this.has_suffix(word, suffix) && this.has_aya(word, suffix)) return this.cut_suffix(word, suffix);
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
            if (this.has_suffix(word, suffix)) return this.cut_suffix(word, suffix);
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
            if (this.has_suffix(word, suffix)) return this.cut_suffix(word, suffix);
        });

        return word;
    }
    step2(word) {
        if (word.slice(-2, 2) == "и") word = word.slice(0, word.length - 2);
        return word;
    }
    step3(word) {
        let vowels = ["а", "е", "и", "о", "у", "ы", "э", "ю", "я"];
        let flag = 0;
        let r1 = "";
        let r2 = "";
        for (let i = 0; i < word.length; i += 2) {
            if (flag == 2) r1 += word.slice(i, 2);
            if (vowels.indexOf(word.slice(i, 2)) !== -1) flag = 1;
            if (flag == 1 && vowels.indexOf(word.slice(i, 2)) === -1) flag = 2;
        }
        flag = 0;
        for (let i = 0; i < r1.length; i += 2) {
            if (flag == 2) r2 += r1.slice(i, 2);
            if (vowels.indexOf(r1.slice(i, 2)) !== -1) flag = 1;
            if (flag == 1 && vowels.indexOf(r1.slice(i, 2)) == -1) flag = 2;
        }
        let derivational = ["ост", "ость"];
        // foreach ( derivational as  suffix)
        derivational.forEach((suffix) => {
            if (r2.slice(-suffix.length) == suffix) word = word.slice(0, r2.length - suffix.length);
        });

        return word;
    }
    step4(word) {
        if (word.slice(-2 * 2) == "нн") word = word.slice(0, word.length - 2);
        else {
            let superlative = ["ейш", "ейше"];

            superlative.forEach((suffix) => {
                if (word.slice(-suffix.length) == suffix) word = word.slice(0, word.length - suffix.length);
            });

            if (word.slice(-2 * 2) == "нн") word = word.slice(0, word.length - 2);
        }
        // should there be a guard flag? can't think of a russian word that ends with ейшь or ннь anyways, though the algorithm states this is an "otherwise" case
        if (word.slice(-2, 2) == "ь") word = word.slice(0, word.length - 2);
        return word;
    }
}
// class Stemmer {

//     static public function russian( word)
//     {
//          a =  this.rv( word);
//          start =  a[0];
//          rv =  a[1];
//          rv =  this.step1( rv);
//          rv =  this.step2( rv);
//          rv =  this.step3( rv);
//          rv =  this.step4( rv);
//         return  start. rv;
//     }

//     static private function rv( word)
//     {
//          vowels = array('а','е','и','о','у','ы','э','ю','я');
//          flag = 0;
//          rv = '';
//          start = '';
//         for ( i=0;  i<strlen( word);  i+=CHAR_LENGTH) {
//             if ( flag==1)
//                  rv .= substr( word,  i, CHAR_LENGTH);
//             else
//                  start .= substr( word,  i, CHAR_LENGTH);
//             if (array_search(substr( word, i,CHAR_LENGTH),  vowels) !== false)
//                  flag=1;
//         }
//         return array( start, rv);
//     }

//     static function substitute ( word, & suffix_list)
//     {
//         foreach ( suffix_list as  suffix) {
//             if ( this.has_suffix( word,  suffix)) {
//                 word =  this.cut_suffix( word,  suffix);
//             }
//         }
//         return  word;
//     }

//     static function has_suffix ( word,  suffix)
//     {
//         return substr( word, -(strlen( suffix))) ==  suffix;
//     }

//     static function has_aya ( word,  suffix)
//     {
//         return (substr( word,-strlen( suffix)-CHAR_LENGTH,CHAR_LENGTH)=='а' || substr( word,-strlen( suffix)-CHAR_LENGTH,CHAR_LENGTH)=='я');
//     }

//     static function cut_suffix ( word,  suffix)
//     {
//         return substr( word, 0, strlen( word) - strlen( suffix));
//     }

//     static private function step1( word)
//     {
//          perfective1 = array('в', 'вши', 'вшись');
//         foreach ( perfective1 as  suffix) {
//             if ( this.has_suffix( word,  suffix) &&  this.has_aya ( word,  suffix)) {
//                 return  this.cut_suffix( word,  suffix);
//             }
//         }

//          perfective2 = array('ив','ивши','ившись','ывши','ывшись');
//         foreach ( perfective2 as  suffix) {
//             if ( this.has_suffix( word,  suffix)) {
//                 return  this.cut_suffix( word,  suffix);
//             }
//         }

//          reflexive = array('ся', 'сь');
//          word =  this.substitute( word,  reflexive);

//          adjective = array('ее','ие','ые','ое','ими','ыми','ей','ий','ый','ой','ем','им','ым','ом','его','ого','ему','ому','их','ых','ую','юю','ая','яя','ою','ею');
//          participle2 = array('ем','нн','вш','ющ','щ');
//          participle1 = array('ивш','ывш','ующ');
//         foreach ( adjective as  suffix) {
//             if ( this.has_suffix( word,  suffix)) {
//                  word =  this.cut_suffix( word,  suffix);

//                 foreach ( participle1 as  suffix)
//                     if ( this.has_suffix( word,  suffix) &&  this.has_aya ( word,  suffix))
//                          word =  this.cut_suffix( word,  suffix);

//                 return  this.substitute( word,  participle2);
//             }
//         }

//          verb1 = array('ла','на','ете','йте','ли','й','л','ем','н','ло','но','ет','ют','ны','ть','ешь','нно');
//         foreach ( verb1 as  suffix)
//             if ( this.has_suffix( word,  suffix) &&  this.has_aya ( word,  suffix))
//                 return  this.cut_suffix( word,  suffix);

//          verb2 = array('ила','ыла','ена','ейте','уйте','ите','или','ыли','ей','уй','ил','ыл','им','ым','ен','ило','ыло','ено','ят','ует','уют','ит','ыт','ены','ить','ыть','ишь','ую','ю');
//         foreach ( verb2 as  suffix)
//             if ( this.has_suffix( word,  suffix))
//             return  this.cut_suffix( word,  suffix);

//          noun = array('а','ев','ов','ие','ье','е','иями','ями','ами','еи','ии','и','ией','ей','ой','ий','й','иям','ям','ием','ем','ам','ом','о','у','ах','иях','ях','ы','ь','ию','ью','ю','ия','ья','я');
//         foreach ( noun as  suffix) {
//             if ( this.has_suffix( word,  suffix))
//                return  this.cut_suffix( word,  suffix);
//         }

//         return  word;
//     }

//     static private function step2( word)
//     {
//         if (substr( word,-CHAR_LENGTH,CHAR_LENGTH) == 'и')
//              word = substr( word, 0, strlen( word)-CHAR_LENGTH);
//         return  word;
//     }

//     static private function step3( word)
//     {
//          vowels = array('а','е','и','о','у','ы','э','ю','я');
//          flag = 0;
//          r1 = '';
//          r2 = '';
//         for ( i=0;  i<strlen( word);  i+=CHAR_LENGTH)
//         {
//             if ( flag==2)
//                  r1.=substr( word,  i, CHAR_LENGTH);
//             if (array_search(substr( word, i,CHAR_LENGTH),  vowels) !== false)
//                  flag=1;
//             if ( flag=1 && array_search(substr( word, i,CHAR_LENGTH),  vowels) === false)
//                  flag=2;
//         }
//          flag=0;
//         for ( i=0;  i<strlen( r1);  i+=CHAR_LENGTH)
//         {
//             if ( flag==2)
//                  r2.=substr( r1,  i, CHAR_LENGTH);
//             if (array_search(substr( r1, i,CHAR_LENGTH),  vowels) !== false)
//                  flag=1;
//             if ( flag=1 && array_search(substr( r1, i,CHAR_LENGTH),  vowels) === false)
//                  flag=2;
//         }
//          derivational=array('ост', 'ость');
//         foreach ( derivational as  suffix)
//             if (substr( r2,-(strlen( suffix))) ==  suffix)
//                  word=substr( word, 0, strlen( r2)-strlen( suffix));
//         return  word;
//     }

//     static private function step4( word)
//     {
//         if (substr( word,-CHAR_LENGTH*2)=='нн')
//              word=substr( word, 0, strlen( word)-CHAR_LENGTH);
//         else
//         {
//              superlative=array('ейш', 'ейше');
//             foreach ( superlative as  suffix)
//                 if (substr( word,-(strlen( suffix))) ==  suffix)
//                  word = substr( word, 0, strlen( word) - strlen( suffix));
//             if (substr( word,-CHAR_LENGTH*2) == 'нн')
//                  word = substr( word, 0, strlen( word) - CHAR_LENGTH);
//         }
//         // should there be a guard flag? can't think of a russian word that ends with ейшь or ннь anyways, though the algorithm states this is an "otherwise" case
//         if (substr( word,-CHAR_LENGTH,CHAR_LENGTH) == 'ь')
//              word=substr( word, 0, strlen( word)-CHAR_LENGTH);
//         return  word;
//     }
// }
