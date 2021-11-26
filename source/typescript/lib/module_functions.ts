// в дефолтную функцию
import { postJSON } from "./query"
import { loadMessageById } from "../lib/module_functions"
export function loadMessageById(id_question) {

    return new Promise((resolve, reject) => {
        postJSON("/?module=App&action=GetMessage", {
            id_question: id_question
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

export function getParams(url = window.location) {
    let params = {};
    const url_str = url.toString();
    new URL(url_str).searchParams.forEach(function (val, key) {
        params[key] = val; // Пушим пары ключ / значение (key / value) в объект
    });
    console.log("params", params);
    return params;
}


