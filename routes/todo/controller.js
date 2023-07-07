
const fs = require("fs");
const { title } = require("process");

const add = async (req, res) => {
    /**
     * {
     *      title: '',
     *      time_to_do: 'timestamp',
     *      creator: 'email',
     *      parts: [
     *          {
     *              subtitle: '',
     *              done: boolean      
     *          }
     *      ],
     *      fulfilment: boolean
     * }
     */

    const body = req.body;

    if (
        !body.title ||
        !body.time_to_do ||
        !body.creator ||
        !body.parts
    ) return res.status(400).json({
        success: 0,
        message: "missing required params"
    });

    let storage = require("../../storage.json");
    
    const does_exist = storage.find(item => item.title.toLowerCase() === body.title.toLowerCase());

    if (does_exist) return res.status(409).json({
        success: 0,
        message: "todo already exists"
    })

    body.fulfilment = false;
    storage.push(body)

    try {
        fs.writeFileSync("storage.json", JSON.stringify(storage, null, 4))
        return res.status(201).json({
            success: 1,
            message: "Todo added!"
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: 0,
            message: error.message
        });
    }
}

const get = (req, res) => {
    const query = req.query;

    const storage = require("../../storage.json");
    
    if (query.title) {
        let todo = storage.filter(item => item.title.toLowerCase() === query.title.toLowerCase())
        
        if (todo.length <= 0) return  res.status(404).json({
            success: 0,
            message: "todo not found"
        })

        return res.json({
            success: 1,
            message: "OK",
            data: todo[0]
        })
    }

    return res.json({
        success: 1,
        message: "OK",
        data: storage
    })
}

const modify = (req, res) => {
    const title = req.params.title;
    let storage = require("../../storage.json");
    let todo = storage.filter(item => item.title.toLowerCase() === title.toLowerCase())

    if (todo.length <= 0) return res.status(404).json({
        success: 0,
        message: "todo not found"
    })

    todo = todo[0]
    todoCopy = {...todo};

    const body = req.body;
    /**
     * {
     *      key: value
     * }
     */
    try {
        Object.keys(body).forEach(item => todoCopy[item] = body[item])
        storage = storage.map(item => {
            if (item.title === todo.title)
                return todoCopy
            return item
        })
        fs.writeFileSync("storage.json", JSON.stringify(storage, null, 4))
        return res.status(201).json({
            success: 1,
            message: `${Object.keys(body).map(item => "chenged '" + item +" in storage to " + body[item]).join(" and ")}`
        })
    } catch(error) {
        return res.status(500).json({
            success: 0,
            message: error.message
        })
    }

}

const remove1 = (req , res) => {
    let title = req.body;
    let storage = require("../../storage.json");
    let itemToRemove = storage.find(item => item[title] === item.title)

    if(itemToRemove) return res.status(204).json({
        success: 0,
        message: "item deleted"
    })
}

const remove = (req, res) => {
    const title = req.params.title;

    if (!title) return res.status(400).json({
        success: 0,
        message: "missing required params"
    })

    try {
        let storage = require("../../storage.json");
        // const does_exist = storage.find(item => item[title] === title);

        // if (!does_exist) return res.status(404).json({
        //     success: 0,
        //     message: "not found"
        // })

        storage = storage.filter(item => item.title !== title)

        fs.writeFileSync("storage.json", JSON.stringify(storage, null, 4))
        return res.json({
            success: 1,
            message: "todo deleted successfully"
        })
    } catch(error) {
        return res.status(400).json({
            success: 0,
            message: error.message
        })
    }
}



module.exports = {
    add,
    get,
    modify,
    remove
}
