// в дефолтную функцию
import { postJSON } from "./query"

export function loadMessageById(id_question) {

    return new Promise((resolve, reject) => {
        postJSON("/api", {
            id_question: id_question
            ,
            module: "App",
            action: "GetMessage"
        }).then((answer) => {
            if (answer.result) {
                resolve(answer.question);
            } else {
                alert(answer.message)
                resolve("");
            }
        });
    })
}

function t2Dig(num) {
    return ("0" + num.toString()).slice(-2);
}
export function getTime(dat) {
    return dat.getFullYear() + "/" + dat.getMonth() + "/" + dat.getDay() + " " + t2Dig(dat.getHours()) + ":" +
        t2Dig(dat.getMinutes())
}
export function getParams(url = window.location) {
    let params = {};
    const url_str = url.toString();
    new URL(url_str).searchParams.forEach(function (val, key) {
        params[key] = val; // Пушим пары ключ / значение (key / value) в объект
    });
    console.log("params", params);
    return params;
}


