export function getJSON(url) {

    return fetch(url).then((data: any) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            alert("Error " + err.toString());
            return null;
        }
    });
}
export function postJSON(url, args) {

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(args),
    }).then((data: any) => {
        try {
            console.log("data", data, data.text);
            return JSON.parse(data);
        } catch (err) {
            alert("Error11 " + err.toString());
            return null;
        }
    });
}