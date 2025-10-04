const Product = require('../models/product.model')

exports.getProducts =  async (req, res)=>{
  try {
    //const products = await Product.find({name:req.query.name})
    if (req.query.name){ //verifica se, na query da requisição, foi passado o parâmetro name
      const products = await Product.find({
            name: { '$regex': `.*${req.query.name}.*`, '$options': 'i' }
        }).populate( //1
          {
              path: "user",
              model: "User",
          }
      )
      res.send(products)
    } else {
        const products = await Product.find({}).populate(
            {
                path: "user",
                model: "User",
            }
        )
          res.send(products)
        }
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

exports.getProduct =  async (req, res)=>{
  try {
    const id = req.params.id
    const product = await Product.findById(id)
    res.send(product)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.createProduct =  async (req,res)=> {
  try {
    const data = req.body;
   // data.password = await bcrypt.hashSync(data.password, 10);
    const product = await Product.create(data)
    // users.push(req.body)
      res.send(product)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.updateProduct =  async (req,res)=> {
  try {
    const id = req.params.id;
    const data = await Product.findByIdAndUpdate(id, req.body, {new: true}) 
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.deleteProduct =  async (req,res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByIdAndRemove(id)
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

/*
//1: 🔍 O que é populate()?
  O populate() é um método do Mongoose usado para preencher campos de referência com os dados reais de outro documento.

  ✅ Exemplo prático:
 Imagine que você tem dois modelos no MongoDB:

📄 Modelo User
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
📦 Modelo Product
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
Aqui, o campo user no Product é um ObjectId que referencia um documento da coleção User.

🚫 Sem populate()
Se você fizer:
   const products = await Product.find();

   Você vai receber algo assim:
[
  {
    "name": "Notebook",
    "price": 3000,
    "user": "665730e2f45e4514d4c354a2" // apenas o ID
  }
]
✅ Com populate({ path: 'user', model: 'User' })
Se você fizer:
   const products = await Product.find().populate({
      path: 'user',
      model: 'User'
});

Você recebe isso:
[
  {
    "name": "Notebook",
    "price": 3000,
    "user": {
      "_id": "665730e2f45e4514d4c354a2",
      "name": "João",
      "email": "joao@email.com"
    }
  }
]
Ou seja: ele trocou o ID pelo objeto completo do usuário referenciado.

🧠 Resumo:
populate():	Substitui o ID de referência por dados completos do documento relacionado
path: "user"	Diz qual campo (do modelo atual) tem a referência
model: "User"	Diz qual é o modelo referenciado (nesse caso, o modelo User)

📌 Situação real no seu código:
const products = await Product.find({
  name: { '$regex': `.*${req.query.name}.*`, '$options': 'i' }
}).populate({
  path: "user",
  model: "User"
});
👉 Isso faz com que cada product retornado já venha com os dados completos do usuário que o criou, e não só com o _id do usuário.

*/