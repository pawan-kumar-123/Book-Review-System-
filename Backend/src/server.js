const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World! i am alive')
})





app.listen(port, () => {
    console.log(`Example app listening this url http://localhost:${port}`)
});
