async function testAPI() {
    const res = await fetch("/api/books")
    const data = await res.json()
    console.log(data.message)
}
testAPI();