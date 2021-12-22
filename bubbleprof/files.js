import http from 'http'
import fs from 'fs'

http.createServer(function f1 (req, res) {
  fs.readFile(__filename, function f2 (err, buf1) {
    if (err) throw err
    fs.readFile(__filename, function f3 (err, buf2) {
      if (err) throw err
      fs.readFile(__filename, function f4 (err, buf3) {
        if (err) throw err
        res.end(Buffer.concat([buf1, buf2, buf3]))
      })
    })
  })
}).listen(3000)
