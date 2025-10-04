const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/blackList.model')

function generateToken(params = {}) {
    return jwt.sign({ params }, process.env.TOKEN_KEY || "12#2@_8**3456", {
        expiresIn: process.env.TOKEN_EXPIRATION || '1h',
        algorithm:process.env.TOKEN_ALGORITHM || 'HS256'
    });
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
/*1*/ const user = await User.findOne({email}).select('+password');
    if (!user) {
      return res.status(404).send({message: 'User not found'});
    }
    if(!await bcrypt.compare(password, user.password)) {
      return res.status(401).send({message: 'Invalid password'});
    }
    user.password = undefined; // Remove password from response
    return res.send({
      message: 'Welcome' + user.email, 
      data: user, 
      token: generateToken({id: user.id})
    });
  } catch(err){
    return res.status(500).send({message: 'Server error'});
  }
}

exports.logout = async (req, res) => {
    const token = req.headers.authorization;

    if (!token)
        return res.status(400).json({ message: "Nenhum token fornecido!" });

    if (!await TokenBlacklist.findOne({ token: token })) { //Se o token não está na blackList, isso significa que o logout já foi realizado. Então, se: (!await TokenBlackList.findOne({token:token}))) estiver errado, ou seja, se o Token estiver na blackList, ele entra dentro do else e retorna 'logout já realizado com sucesso'
        await TokenBlacklist.create({ token });
        return res.status(201).json({ message: "Logout realizado!" });
    } else {
        return res.status(403).json({ message: "Logout já realizado!" });
    }
};
 
/*
✅ O que está acontecendo aqui:
   Auth.findOne({ email }):
 Está consultando o banco de dados (provavelmente MongoDB, usando Mongoose). 
 Vai procurar um usuário cujo campo email seja igual ao email enviado na requisição (req.body.email).

   .select('+password'):
 Por padrão, o campo password provavelmente está excluído do schema do Mongoose com { select: false }.

 O .select('+password') força o Mongoose a incluir o campo password nessa consulta, mesmo que normalmente ele não venha.
 Isso é necessário porque, no passo seguinte, você vai comparar as senhas com o bcrypt.

     await:
   Como findOne().select(...) retorna uma Promise (porque está lidando com o banco), usamos await para esperar o resultado da consulta.

❗ Importante:
 Essa linha não está comparando o e-mail e senha ao mesmo tempo.
 Ela só faz a busca pelo e-mail. A senha vem junto no resultado apenas porque você forçou com .select('+password').



✅ Etapas e ordem de execução:
Recebe o email e password do corpo da requisição:
   const { email, password } = req.body;
Busca o usuário no banco de dados pelo e-mail:

   const user = await Auth.findOne({ email }).select('+password');
Se não achar, retorna erro 404.

Compara a senha fornecida com o hash da senha no banco:
   if (!await bcrypt.compare(password, user.password)) {
Se a senha estiver errada, retorna erro 401.

✅ Se o e-mail existir e a senha estiver correta:
Remove o campo password para não enviá-lo na resposta:
   user.password = undefined;

   Gera um token JWT:
     token: generateToken({ id: user.id })
 Isso normalmente usa a função jwt.sign(...) por trás dos panos.
 O token pode incluir o ID do usuário e outras informações, e é usado para autenticar futuras requisições.

Envia a resposta ao cliente com: 
 Uma mensagem de boas-vindas
 Os dados do usuário (sem a senha)
 O token JWT




 📌 Função completa:
function generateToken(params = { }) { 
  return jwt.sign({ params }, config.secret, {
    expiresIn: config.timer
  });
};
🔍 Linha por linha:
function generateToken(params = { }) {
Cria uma função chamada generateToken.
   Ela recebe um argumento params, que por padrão é um objeto vazio {} se nenhum parâmetro for passado.

Exemplo de uso::
   generateToken({ id: user.id })
   return jwt.sign({ params }, config.secret, { expiresIn: config.timer });
Aqui está a geração do token JWT usando a biblioteca jsonwebtoken.

Vamos detalhar os 3 argumentos de jwt.sign(...):
✅ jwt.sign(payload, secret, options)
   1. payload: { params }
Esse é o conteúdo que vai dentro do token.
   Aqui, você está colocando params como uma propriedade chamada params no token.

Exemplo: se params = { id: 123 }, o token vai conter:
{
  "params": { "id": 123 },
  "iat": ...,
  "exp": ...
}
2. config.secret
Esse é o segredo (chave privada) usado para assinar o token.
   É como a "senha" que garante que o token seja válido e não tenha sido alterado.
   Geralmente isso vem de um arquivo config.js:
     module.exports = {
     secret: 'sua-chave-secreta-aqui',
     timer: '1d'
};
   3. { expiresIn: config.timer }
Define o tempo de expiração do token.

expiresIn pode ser:
 '1h' → 1 hora
 '2d' → 2 dias
 60 → 60 segundos
Isso define por quanto tempo o token será válido.

🧠 Exemplo prático
Se você chamar:
   generateToken({ id: 123 })
E o config.secret = 'abc123'
E o config.timer = '2h'

Então ele retorna um token JWT que:
 Contém { params: { id: 123 } } no corpo
 Está assinado com a chave 'abc123'
 Expira em 2 horas

🔐 Para que serve esse token?
Esse token é usado para autenticação baseada em tokens (JWT):

Ele é enviado ao cliente (navegador, app, etc.)
O cliente usa esse token nas próximas requisições (normalmente no header: Authorization: Bearer <token>)
No backend, você pode verificar o token e recuperar os dados do usuário sem precisar consultar o banco toda hora.

✅ Em resumo:
A função generateToken(params):
 Cria um token JWT
 Com os dados passados (ex: id, email)
 Assinado com uma chave secreta
 E com tempo de validade definido


 ✅ O que é "usar o token nas próximas requisições"?
Quando você faz login em um sistema e recebe um token JWT, esse token funciona como uma credencial de acesso. Ele prova que você está autenticado.

"Usar o token nas próximas requisições" significa que o cliente (navegador, app, etc.) envia esse token junto com cada requisição para rotas protegidas, como se fosse uma identidade.




🧠 Exemplo simples:
1. 🔐 Login
O cliente (navegador ou aplicativo) envia um POST para /login com e-mail e senha.
Se os dados estiverem corretos, o servidor responde com um token JWT:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
2. 📦 Cliente guarda o token
Esse token pode ser armazenado em:
   localStorage ou sessionStorage (em apps web)
   memória do app (em apps móveis)
   cookies (com cuidado para segurança)

3. 📥 Próxima requisição com o token
 Agora, digamos que o cliente quer acessar uma rota protegida:
   GET /profile (rota que mostra os dados do usuário)
➡️ O cliente envia o token no cabeçalho da requisição:
    GET /profile HTTP/1.1
   Host: api.seusite.com
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
O servidor lê esse header Authorization, verifica se o token é válido (com jwt.verify), e se for, permite o acesso.

✅ Por que isso é útil?
 O usuário não precisa enviar e-mail e senha a cada requisição.
 O servidor não precisa guardar sessão em memória — ele apenas verifica o token.
 Escalável e leve: ideal para APIs REST.

🛡️ E se o token estiver ausente ou inválido?
 O servidor responde com erro 401 (não autorizado), porque não pode confirmar a identidade do usuário.

✨ Em resumo:
"Usar o token nas próximas requisições" quer dizer que o cliente anexa o token JWT no cabeçalho das requisições HTTP para acessar rotas protegidas, e o servidor usa esse token para verificar se o usuário está autenticado.


*/