"use strict"

require("dotenv").config();

// const axios = require("axios");

function makeRequest(
    url, 
    method = "GET", 
    data = null, 
    headers = { "Content-Type": "application/json" }
) {
    return new Promise(async (resolve, reject) => {
        let response;
        
        try {
            if (method === "GET")
                response = await fetch(url)
            else {
                let options = {
                    body: JSON.stringify(data),
                    method,
                    headers
                }
                
                response = await fetch(url, options)
            }
            response = await response.json();
            return resolve(response)
        } catch(error) {
            return reject(error)
        }
    })
}

const URL = `http://localhost:${process.env.PORT}`;


(async () => {
    try {
        console.log("Should add todo..")
        let new_todo = {
            title: "dance",
            time_to_do: new Date().getTime() + (1000*10),
            creator: "mail@mail.com",
            parts: [
                {
                    subtitle: "buy ingredents from the market",
                    done: false
                },
                {
                    subtitle: "wash ingredents",
                    done: false
                },
                {
                    subtitle: "heat food until ready",
                    done: false
                },
                {
                    subtitle: "serve prepared food",
                    done: false
                }
            ]
        }
        let storage = await makeRequest(`${URL}/todo`);
        let oldListLength = storage.data.length
        let res = await makeRequest(`${URL}/todo/add`, "POST", new_todo)
        storage = await makeRequest(`${URL}/todo`);
        let newListLength = storage.data.length
        console.log(oldListLength, newListLength)

        if (newListLength === oldListLength) console.log("did not return error but failed to add todo")
        else console.log("todo added successfuly")
    } catch(error) {
        console.log(`failed to add todo: Reason => ${error}`)
    }

    // try {
    //     let res = await makeRequest(`${URL}/todo/`)
    //     console.log(res)
    // } catch(error) {
    //     console.log(error.message)
    // }

    // try {
    //     const res = await makeRequest(`${URL}/todo/cook`, "PUT", { title: "cook", time_to_do: new Date().getTime() + (1000*60*60*2) })
    //     console.log(res);
    // } catch(error) {
    //     console.log(error.message)
    // }

    // try {
    //     let res = await makeRequest(`${URL}/todo/cook`, "DELETE", {});
    //     console.log(res)
    // } catch(error) {
    //     console.log(error.message)
    // }
})()