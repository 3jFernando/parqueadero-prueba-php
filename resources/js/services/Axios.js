/*
* metodo de Axios para peticiones POST
* */
export async function AxiosPOST(url, params, callback) {
    await axios.post(`/api/${url}`, params)
        .then(response => {
            callback(200, response.data);
        })
        .catch(e => alert("No es posible realziar la acción."))
        .finally(() => callback(1000, null));
}

/*
* metodo de Axios para peticiones GET
* */
export async function AxiosGET(url, callback) {
    await axios.get(`/api/${url}`)
        .then(response => {
            callback(200, response.data);
        })
        .catch(e => alert("No es posible realziar la acción."))
        .finally(() => callback(1000, null));

}
