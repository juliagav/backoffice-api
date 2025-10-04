const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

exports.getUsers =  async (req, res)=>{
  try {
    if(req.query.name){
/*1*/const users = await User.find({ name: { '$regex': `.*${req.query.name}.*`, '$options': 'i' }}) 
      res.send(users)
    }else{
     const users = await User.find({})
      res.send(users)
    }
  
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}
/*2: entender a lógica do código*/
exports.getUser =  async (req, res)=>{
  try {
    const id = req.params.id
    const user = await User.findById(id)
    res.send(user)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.createUser =  async (req,res)=> {
  try {
    const data = req.body;
    data.password = await bcrypt.hashSync(data.password, 10);
    const user = await User.create(data)
    // users.push(req.body)
      res.send(user)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.updateUser =  async (req,res)=> {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndUpdate(id, req.body, {new: true}) 
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

exports.deleteUser =  async (req,res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndRemove(id)
    res.send(data)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

/*
EXPRESSÃO REGULAR:
const users = await User.find({ name: { '$regex': `.*${req.query.name}.*`, '$options': 'i' }}) 

🔁 Em termos simples:
User.find({
  name: {
    $regex: `.*${req.query.name}.*`,
    $options: 'i'
  }
})
Significa:
“Procure no banco de dados todos os usuários cujo campo name contenha a string vinda de req.query.name (ignorando letras maiúsculas ou minúsculas).”

📌 name → é o nome do campo nos documentos do MongoDB
📌 req.query.name → é o valor que o usuário passou na URL

📌 2. Por que $regex e $options têm um cifrão $ antes?
💡 Isso vem da sintaxe do MongoDB.
MongoDB usa operadores especiais com prefixo $ para indicar que não são simples valores literais, mas comandos ou instruções.


✅ O que é .*${req.query.name}.*?
Essa é uma string interpolada (template string do JavaScript), que está sendo usada para montar uma expressão regular dinamicamente, baseada no valor que o usuário envia pela URL.

💡 A função de .* em uma regex
. → significa "qualquer caractere" (exceto quebras de linha).
* → significa "zero ou mais vezes".
Juntos, .* → qualquer sequência de caracteres, inclusive nenhuma.

🔍 Por que tem dois .*?
A expressão:
`.*${req.query.name}.*`
Serve para encontrar qualquer valor que contenha a string fornecida, em qualquer posição do campo name.

Exemplo
Se o usuário envia:
GET /users?name=jo
A linha:
`.*${req.query.name}.*`
Vira:
.*jo.*
Ou seja, está procurando qualquer texto que tenha "jo" em qualquer parte.

Vai bater com:
"João"
"Marjory"
"Jorge"
"Sojo"

❓ E se não usasse .*?
Se usasse só:
regex: `${req.query.name}`
Você estaria buscando apenas nomes que sejam exatamente iguais a "jo".
Ou seja, não encontraria "João" nem "Marjory".

Se usasse:
regex: `^${req.query.name}`
O ^ significa "começa com".

Isso encontraria nomes que comecem com "jo":

"João" ✅
"Jorge" ✅
"Marjory" ❌

Se usasse:
regex: `${req.query.name}$`
O $ significa "termina com".
Isso encontraria nomes que terminam com "jo".

✅ Conclusão
A forma:
`.*${req.query.name}.*`
É usada porque é a maneira mais ampla de procurar:
“qualquer nome que contenha essa string em qualquer posição”.
Isso garante uma busca parecida com o comportamento de “pesquisa de substring” — que é o mais comum em sistemas de busca simples.

*/




/* 2. LÓGICA DO CÓDIGO:
📌 Primeiro, aqui está o trecho que estamos analisando:
 useEffect(() => {
   getUsers();
}, [search]);

✅ O que é useEffect?
 O useEffect é um Hook do React que permite executar efeitos colaterais no seu componente — como:
   - Fazer chamadas a APIs (como fetch)
   - Atualizar o título da página
   - Adicionar ou remover eventos

✅ Como funciona esse useEffect(() => { getUsers(); }, [search])?
Vamos quebrar isso em partes:
 📍 () => { getUsers(); }
   É uma função de efeito: o que você quer que o React execute quando algo acontecer.
   Neste caso, a função simplesmente chama getUsers() — ou seja, busca os dados do servidor.

📍 [search]
É o array de dependências. Ele diz ao React:
   “Execute essa função toda vez que search mudar”.
   Se você deixar o array vazio [], ele roda só uma vez (quando o componente monta).
   Se você colocar [search], ele roda toda vez que o search for atualizado (como quando você digita no input de busca).

🔁 Ciclo de funcionamento:
   1. O componente é carregado:
     search é "" (vazio)
     useEffect roda porque o componente montou
     getUsers() é chamado com filtro vazio (http://localhost:3000/api/users)

2. O usuário digita algo:
 Exemplo: "joão"
   O onChange do input dispara → setSearch("joão")
   O valor de search muda

3. Como search mudou:
 1) O React percebe que search mudou
 2) Ele executa novamente o useEffect
 3) O useEffect chama getUsers() de novo
   Agora a URL é:
     http://localhost:3000/api/users?name=joão

🧠 Conclusão
 O useEffect(() => { getUsers(); }, [search]) está dizendo ao React:

   "Sempre que o valor de search mudar, execute getUsers() para buscar os dados atualizados."
   Isso torna sua busca reativa e em tempo real, com base no que o usuário digita.


*/