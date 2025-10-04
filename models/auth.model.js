const mongoose = require('mongoose'); //Biblioteca para modelar objetos e trabalhar com MongoDB
const bcrypt = require('bcryptjs'); //Biblioteca para criptografar senhas

const authSchema = new mongoose.Schema({
  email: { // deve ser do tipo String, obrigatório, único e em letras minúsculas
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { // deve ser do tipo String, obrigatório
    type: String,
    required: true
  },
    role: {  // define o papel do usuário, que pode ser 'user' ou 'admin', com valor padrão 'user'
      type: String, // o campo 'role' é do tipo String
/*1*/ enum: ['user', 'admin'], // só pode ser 'user' ou 'admin' 
      default: 'user'  // se não for especificado, o valor padrão será 'user'
    }
  }, {
/*2*/ timestamps:true // adiciona campos de data de criação e atualização automaticamente
});

//hash a senha antes de salvar
/*3*/authSchema.pre('save',async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth


/*1: O enum é usado para restringir o valor do campo 'role' a apenas dois valores possíveis: 
   'user'
   'admin'.
      Isso garante que o papel do usuário seja sempre um desses dois valores, 
      evitando erros de digitação ou valores inesperados.

✅ Exemplo válido:
{
  email: 'joao@email.com',
  password: 'senha123',
  role: 'admin' // válido
}

❌ Exemplo inválido:
{
  email: 'maria@email.com',
  password: 'senha123',
  role: 'moderator' // inválido — não está no enum
}
Resultado: O Mongoose vai gerar um erro de validação e não vai salvar no banco.
*/




/* 
2: O timestamps:true adiciona automaticamente dois campos ao esquema: createdAt e updatedAt.
  Campo	Significado:
   createdAt	Data e hora em que o documento foi criado
   updatedAt	Data e hora em que o documento foi modificado pela última vez

✅ Exemplo prático:
  Se você salvar um novo usuário no banco:
   {
     email: "teste@email.com",
     password: "123456",
     role: "user"
  }
O Mongoose automaticamente adicionará:
{
    email: "teste@email.com",
    password: "hashed...",
    role: "user",
    createdAt: "2025-06-06T15:20:30.123Z",
    updatedAt: "2025-06-06T15:20:30.123Z"
}
Se esse usuário for atualizado depois, por exemplo mudando o role para "admin", o campo updatedAt será atualizado para a nova data/hora, mas o createdAt permanece o mesmo.

🔒 Por que isso é útil?
📅 Saber quando um usuário foi criado.
🔄 Rastrear atualizações (ex: logs de auditoria).
🧹 Filtrar dados antigos ou recentes (ex: “mostrar os últimos usuários registrados”).

💡 Resumo:
timestamps: true no Mongoose automatiza o controle de datas de criação e modificação dos documentos
*/




/*3
✅ O que é authSchema.pre('save', ...)?
   É um middleware do Mongoose.
   Mais precisamente, é um “pre-save hook”, ou seja:
É uma função que será executada automaticamente antes de um documento ser salvo no banco de dados MongoDB.

📘 Tradução da sintaxe:
      authSchema.pre('save', async function (next) { ... });
   authSchema: é o schema do Mongoose, por exemplo, do modelo de usuário ou autenticação.
   .pre(...): define um middleware que roda antes de uma ação específica. 
   'save': indica que o middleware será executado antes do .save() ser chamado no documento.
   function(next) → função que será executada antes de salvar.

    Quando você faz:
      authSchema.pre('save', async function (next) {...});
    Você está dizendo ao Mongoose:
    "Antes de executar a operação 'save' em qualquer documento baseado nesse schema (authSchema), rode essa função aqui."

    📌 Então, qual é o middleware?
   O middleware é exatamente essa função que você passou:
      async function (next) {...}
   Esse é chamado de middleware do tipo "pre" (antes da operação).
   A operação sendo interceptada é o 'save'.

 ✅ Exemplo simplificado:
    authSchema.pre('save', function (next) {
    console.log('Antes de salvar o usuário!');
    next(); 
  });

  Se você rodar:
    const user = new User({ email: 'x@x.com', password: '123' });
    await user.save();
 Esse middleware é automaticamente chamado antes de salvar.


 🧠 Linha por linha explicada:
 ✅ if (!this.isModified('password')) return next();
    this → representa o documento do usuário que está sendo salvo.
   .isModified('password') → Mongoose verifica se o campo password foi modificado.

👉 Então, a lógica é:
 “Se a senha não foi modificada, então não precisamos recriptografá-la. Apenas siga em frente com o save().”
 return next(); → Sai da função do middleware e continua com o salvamento do documento.
 Evita recriptografar senhas que já estão seguras.


 ✅ const salt = await bcrypt.genSalt(10);
 Gera um salt (sal criptográfico) usando o bcrypt.
 O número 10 é o custo de processamento (salt rounds) — quanto maior, mais seguro, mas mais lento.
 O await faz o código esperar até o salt ser gerado antes de continuar.


✅ this.password = await bcrypt.hash(this.password, salt);
 Usa o bcrypt.hash para criptografar a senha original (this.password) com o salt gerado.
 O resultado é uma senha segura (hash) que será salva no banco.
 Também usa await porque bcrypt.hash é assíncrona.


✅ next();
 Finaliza o middleware e diz ao Mongoose:
 “Pronto! Pode continuar com o salvamento agora.”


🔄 Fluxo completo da função:
 1) Verifica se o campo password foi modificado:
 2) Se não, apenas chama next() e sai da função.
Se sim:
 3) Gera o salt (await bcrypt.genSalt(10))
 4) Criptografa a senha (await bcrypt.hash(...))
 5) Substitui a senha no documento
 6) Chama next() para continuar


✅ Resumo visual
 Se senha não foi modificada
    → Pula a criptografia e segue (next)

Se senha foi modificada
    → Gera salt
    → Criptografa senha com salt
    → Atualiza o campo `password`
    → Chama next para continuar salvamento



*/