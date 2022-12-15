// Required packages
const http = require('http');
const proxy = require('http-proxy');
// Create proxy server
const proxyServer = proxy.createProxyServer()
const targets = [
'http://localhost:3001',
'http://localhost:3002',
'http://localhost:3003'
]
http.createServer((req, res) => {
// Add any needed fields to 
proxyServer.web(req, res, { target: targets[(Math.floor(Math.random() * 3))] })
}).listen(3000, () => {
console.log('Proxy server is running in port 3000')
})



app.use((req,res)=>{
    console.log("=========321321321321")
    http.createServer((req, res) => {
      // Add any needed fields to 
      console.log("================================")
      console.log(proxyServer.web(req, res, { target: targets[(Math.floor(Math.random() * 3))] }))
      console.log("================================")
    
      })
  });
   