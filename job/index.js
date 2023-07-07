

const { sendMail } = require("../modules")

// cron job
let worked = false;
const fs = require("fs");

async function makeRequest(
    url, 
    method = "GET", 
    body = null, 
    headers = { 
        "Content-Type": "application/json" 
    }
) {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            if (method === "GET")
                response = await fetch(url)
            else
                response = await fetch(
                    url,
                    {
                    method,
                    headers,
                    body: JSON.stringify(body) 
                    }
                )
            let status = response.status;
            response = await response.json();
            if (status >= 300) return reject(response);
            return resolve(response);
        } catch(error) {
            return reject(error)
        }
    })
}

async function runJobs() {
    let storage = [];

    try {
        storage = await makeRequest(`http://localhost:${process.env.PORT}/todo`)
        storage = storage.data
    } catch(error) {
        console.log(error);
        setTimeout(() => {
            runJobs()
        }, 10000)
        return
    }

    let now = new Date().getTime();

    try {
        const new_storage = []
        storage.forEach(async item => {
            let todo = item
            // console.log(item.notified)
            if (item.time_to_do <= now && !item.notified && !worked) {
                try {
                    worked = true
                    let message = Object.keys(todo).map(i => i === "time_to_do" ? `<p><strong>${i}</strong>: <span>${new Date(todo[i]).toLocaleString()}</span></p>` : `<p><strong>${i}</strong>: <span>${todo[i]}</span></p>`).join("") 
                    let mailResponse = await sendMail(`Time to fulfil ${item.title} in your TODO list`, message, item.creator)
                    // console.log("creator has been notified!")
                    return
                    console.log(mailResponse)
                    todo.notified = true;
                    new_storage.push(todo)
                } catch(error) {
                    console.log(error)
                    return
                }
            }
            else {
                new_storage.push(todo)
            }
        })
        if (worked === true)
        {
            fs.writeFileSync("storage.json", JSON.stringify(new_storage, null, 4))
            return
        }
        worked = false
        return await runJobs();
    } catch(error) {
        console.log(error.message);
    }
}

(async () => {
    await runJobs();
})()