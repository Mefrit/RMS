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
    try {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",

                "Authorization": "Basic " + btoa("customuser:custompassword")
            },
            body: JSON.stringify({ ...args }),
        }).then((response) => {

            if (response.status == 401) {
                return { result: false, message: "Вы не вошли в систему, пожалуйста, авторизуйтесь" }
            } else {
                return response.json();
            }

        })
            .then((data) => {
                return data;
            });
    } catch (err) {
        alert("Error11 " + err.toString());
        return null;
    }
}
