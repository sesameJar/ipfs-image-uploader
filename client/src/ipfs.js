const IPFS = require('ipfs-http-client')
const ipfs = IPFS({
    host:'ifps.infura.io',
    port : 5001,
    protocol : 'http'
})

export default ipfs