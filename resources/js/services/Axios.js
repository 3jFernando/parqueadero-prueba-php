/*
* metodo de Axios para peticiones POST
* */
export async function AxiosPOST(url, params, callback) {
    await axios.post(`/api/${url}`, params)
        .then(response => {
            callback(200, response.data);
        })
        .catch(e => alert("No es posible realizar la acción, para crear los datos."))
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
        .catch(e => alert("No es posible realizar la acción, para cargar los datos."))
        .finally(() => callback(1000, null));

}
