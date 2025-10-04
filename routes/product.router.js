const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const BlackList = require('../models/blackList.model')
//const authMiddleware = require('../middleware/auth');
const productController = require('../controllers/product.controller'); //É necessário definir quais endPoints vão ter o middleware
const middleware = (req,res,next)=>{ // middleware protege rotas através de acesso | Exemplo: depois que o usuário fizer Login, o backend cria um JWT. Este token será passado nas outras requisições de login e o middleware será uma barreira nestes 'endpoints' que exijam que o usuário esteja logado
  //console.log(req.headers)
 // next()
/*0*/  const authHeader = req.headers['authorization']; // Precisamos do token que vem no header Authorization, que é o padrão para autenticação via Bearer Token. Aqui, o 'authorization' precisa ter o 'a' minúsculo, pois é assim que o Express.js trata os headers HTTP.
/*1*/ const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401); // sem token = não autorizado

/*2*/jwt.verify(token, process.env.TOKEN_KEY || "12#2@_8**3456", async (err, user) => { // please use 256 bits or more for token key
    if (err) return res.sendStatus(403); // token inválido~
      const hasBlackListToken = await BlackList.find({token: req.headers['authorization'] }) //find está procurando no banco de dados se o token passado na requisição está na BlackList. Find é uma promise, então precisamos usar await para esperar a resposta do banco de dados. Se o token estiver na BlackList, significa que o usuário não tem acesso a esta rota.
      if(hasBlackListToken.length > 0) {
        return res.status(403).send({message: 'Invalid token'})
      }
    req.user = user; // salva dados do usuário no req
    next(); // continua
  });
}



router.get('/',middleware, productController.getProducts); // Antes da função getProducts ser executada, uma série de validações vão ser realizadas pela função middleware, como: verificar o token, se o usuário tem acesso..

router.get('/:id', productController.getProduct);

router.post('/', productController.createProduct);

//router.post('/logout', productController.logout);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

//router.post('/login', productController.login);


module.exports = router;


/*
 0. const authorization = req.headers['authorization']
 req.headers é um objeto que contém todos os cabeçalhos (headers) da requisição. 

 Exemplos de headers:
   'content-type': tipo do conteúdo (ex: application/json)
   'authorization': geralmente contém um token de autenticação
   'user-agent': navegador ou cliente que está fazendo a requisição

 Logo, req.headers['authorization] é uma forma de acessar o valor do header 'authorization'
  Esse valor geralmente tem este formato:
   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    ✅ Resumo rápido:
     Expressão	                      Significado
     req	                            Requisição HTTP
     req.headers	                    Cabeçalhos HTTP da requisição
     req.headers['authorization']	    Valor do cabeçalho Authorization (geralmente um token)

  🧪 Exemplo prático:
  Se o cliente enviar uma requisição assim:
   GET /rota-protegida
   Authorization: Bearer abc123xyz
 No seu middleware:
   const authHeader = req.headers['authorization'];
   console.log(authHeader); 
 // Saída: 'Bearer abc123xyz'


 🛠️ Quem cria os headers e seus valores?
🔹 1. O cliente pode definir headers ao enviar a requisição.
Exemplo: o front-end (ou Postman, curl etc.) pode enviar:
   Authorization: Bearer abc12345
   Content-Type: application/json
✅ Então sim: o cliente é quem envia os headers na requisição.

🔹 2. Mas o valor do token (ex: abc12345) geralmente é criado pelo backend.
Aqui está a separação clara:
    Responsável	                  O que faz
    Backend (servidor)	          Gera o token (ex: JWT) no momento do login/autenticação
    Cliente (frontend ou app)	    Armazena esse token (ex: no localStorage) e depois envia nas próximas requisições como header Authorization

🧱 Exemplo prático: fluxo de autenticação com JWT
🔐 Login
   1) Cliente envia e-mail e senha.
   2) Backend verifica.
   3) Se estiver correto, backend gera um token JWT:
      const token = jwt.sign({ userId: 123 }, 'segredo', { expiresIn: '1h' });
 Backend responde com:
   {
     "token": "abc12345..."
    }
📦 Cliente armazena o token
    Ex: localStorage ou em memória.
🔁 Requisições futuras
  Cliente envia:
    Authorization: Bearer abc12345...
Isso permite que o backend reconheça o usuário com base no token.

🔎 Resumindo:
    Pergunta	                          Resposta
    Quem cria o header?	                O cliente define quais headers enviar
Quem cria o token do Authorization?	    O backend cria, geralmente durante o login
O cliente pode inventar um token?	      Pode tentar, mas o backend vai rejeitar se não for válido




 1. Por que authHeader && authHeader.split(' ')[1] e não apenas authHeader.split(' ')[1]?
 Isso é uma verificação de segurança. Se authHeader for undefined (ou seja, o cliente não enviou o cabeçalho Authorization), fazer authHeader.split(...) causaria erro (TypeError: Cannot read properties of undefined).
 Com authHeader && authHeader.split(' ')[1], o token só será acessado se authHeader existir. Caso contrário, token será undefined, e a verificação if (!token) funcionará como esperado.





 2. Explicação detalhada do jwt.verify
    ✅ O que exatamente jwt.verify(...) faz?
      jwt.verify(token, chave_secreta, callback)
Essa função tem um papel específico e limitado:

👉 Ela valida a assinatura criptográfica do token e decodifica o payload.
 Ou seja, o que o verify verifica internamente é:
   1) O token tem uma assinatura válida com a chave (TOKEN_KEY)?
   2) O token não expirou (exp)?
   3) O token tem o formato certo (header.payload.signature)?

  A verificação da BlackList NÃO faz parte do jwt.verify.

Ela é uma verificação adicional que você implementou fora da função jwt.verify, no seu próprio código, dentro do callback que o verify chama apenas se o token for válido.

🔁 Vamos por etapas:
    1. jwt.verify(token, chave, callback)
 Primeiro, ele verifica só o token em si (assinatura + expiração).
 Se estiver inválido, ele chama o callback(err) (com err preenchido) e nada mais acontece.

2. Se o token estiver válido:
    O callback(null, user) é chamado.

A partir daqui, você pode:
 1) Fazer verificações personalizadas (ex: BlackList).
 2) Salvar dados no req.user.
 3) Chamar next() para continuar.

 A verificação do token em si (assinatura + expiração) ocorre internamente na chamada:
    jwt.verify(token, process.env.TOKEN_KEY, callback);
 Ou seja:
 Antes mesmo de o callback async (err, user) => { ... } ser executado, o JWT já:
✅ Verificou se a assinatura está correta.
✅ Verificou se o token ainda não expirou.
✅ Verificou se o token tem o formato correto.

 🔍 O que acontece internamente:
    jwt.verify(...) é chamado.
 Ele pega o token e:
 1) Divide em partes: header.payload.signature
 2) Usa a chave secreta (TOKEN_KEY) para validar a assinatura.
 3) Decodifica o payload e verifica se o tempo de expiração (exp) ainda é válido.
 4) Só então chama o callback com:
 5) err preenchido ❌ → se alguma dessas verificações falhar
 6) user preenchido ✅ → se o token for válido

✳️ Exemplo prático:
 jwt.verify(token, chave, (err, user) => {
  if (err) {
    console.log("Token inválido ou expirado");
    return;
  }
  console.log("Token válido!", user);
}); 
 
 Neste código acima:
 Se o token tiver problema, o err vem preenchido com algo como:
   JsonWebTokenError → assinatura inválida
   TokenExpiredError → expirado
 Se estiver tudo certo, o user é o payload decodificado, e você pode usar os dados normalmente.

✅ Conclusão final
📌 A validação técnica do token (assinatura + expiração) é feita antes do callback ser chamado.
📌 O callback só é executado depois da verificação interna do JWT — com err ou com user.
 Então sim, no momento em que o callback é chamado, você já sabe se o token é válido ou não.




*/
