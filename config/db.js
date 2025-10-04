 const mongoose = require("mongoose")
 mongoose.connect('mongodb://127.0.0.1:27017/api')
 module.exports = mongoose.connection
 

/*🧠 Por que no models/ também tem const mongoose = require("mongoose")?
Porque são funções diferentes do mongoose!
📦 Em db.js:
Você usa mongoose.connect() para criar a conexão com o banco de dados.

O foco no db.js é conectar.

📦 Em models/:
Você usa o mongoose para criar Schemas e Models: */
