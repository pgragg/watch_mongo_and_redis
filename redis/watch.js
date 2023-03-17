require('events').defaultMaxListeners = 0;

const redis = require('redis')
const subscriber = redis.createClient()
const client = redis.createClient()
const difflet = require('difflet')
const { Table } = require('console-table-printer');

const inMem = {}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const view = new Table();

const main = async () => {
    console.log('Attempting connections to redis')
    await subscriber.connect()
    console.log('Connected subscriber')
    await client.connect()
    console.log('Connected client')

    // __keyspace@0__
    let index = 0
    await subscriber.pSubscribe('__keyspace@0__*', async (message, channel) => {
        console.log('Subscribed to redis, listening for changes')
        // Mute noisy channel
        if (channel.includes('user-rate-limit')) { return }
        const key = channel.slice(15, channel.length)
        const action = message
        index += 1;
        const previousValue = inMem[key]
        let verb;
        let color;
        const type = await client.type(key)
        console.log({ type, key })
        const method = {
            none: client.get,
            string: client.get,
            hash: client.hGet,
            lists: client.lrange,
            sets: client.sMembers
        }
        let callable = method[type].bind(client)
        await callable(key)
            .then((newValue) => {
                let diff = difflet.compare(previousValue, newValue)
                inMem[key] = newValue;

                if (isJsonString(previousValue) && isJsonString(newValue)) {
                    diff = difflet.compare(JSON.parse(previousValue), JSON.parse(newValue))
                }

                if (previousValue) { verb = "UPDATE"; color = "blue" }
                if (!previousValue && ['hset', 'set'].includes(action)) { verb = "CREATE"; color = "green" }
                if (action === 'del') { verb = "DELETE"; color = "red" }
                if (action === 'expire') { verb = "EXPIRED"; color = "grey" }
                if (action === 'incrby') { verb = "INCRBY"; color = 'yellow' }
                color = color
                view.addRow({ index, action, key }, { color });
                view.printTable();
            })
        // .catch((err) => {
        //     console.log({ err: err.message, key, action })
        //     color = 'orange'
        //     view.addRow({ index, action, key }, { color });
        //     view.printTable();
        // })
        // .finally(() => {

        // })
    });
}


main()
