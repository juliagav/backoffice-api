 const mongoose = require("mongoose")
 mongoose.connect(process.env.DB_URL)
 module.exports = mongoose.connection
 

/*🧠 Por que no models/ também tem const mongoose = require("mongoose")?
Porque são funções diferentes do mongoose!
📦 Em db.js:
Você usa mongoose.connect() para criar a conexão com o banco de dados.

O foco no db.js é conectar.

📦 Em models/:
Você usa o mongoose para criar Schemas e Models: */
