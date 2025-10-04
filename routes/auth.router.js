const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); //Importa o módulo auth.controller.js, que contém as funções que executam a lógica por trás de cada rota

router.post('/login', authController.login); //Executa o processo de login (verifica email/senha, cria token, etc.)
router.post('/logout', authController.logout); //Executa o processo de logout (remove o token do usuário, etc.)

//router.get('/', authController.getAuthStatus);
//router.post('/Register', authController.register);
//router.post('/ForgotPassword', authController.forgotPassword);
//router.post('/ResetPassword', authController.resetPassword);
//router.post('/ChangePassword', authController.changePassword);
//router.post('/VerifyEmail', authController.verifyEmail);
//router.post('/ResendVerificationEmail', authController.resendVerificationEmail);
//router.post('/UpdateProfile', authController.updateProfil
// router.post('/UpdateProfile', authController.updateProfile);
//router.post('/DeleteAccount', authController.deleteAccount);
// router.post('/TwoFactorAuth', authController.twoFactorAuth);
// router.post('/DisableTwoFactorAuth', authController.disableTwoFactorAuth);
// router.post('/EnableTwoFactorAuth', authController.enableTwoFactorAuth);

module.exports = router;


/*
Existem várias formas de autenticação que podem ser implementadas, dependendo das necessidades do aplicativo. Algumas das mais comuns incluem:
   * JWT (JSON Web Tokens): Uma forma popular de autenticação baseada em tokens, onde o servidor gera um token assinado que é enviado ao cliente e usado para autenticar solicitações subsequentes.
   * OAuth: Um protocolo de autorização que permite que aplicativos de terceiros acessem recursos em nome do usuário, sem precisar compartilhar credenciais.

Quando um usuário faz login, o servidor  verifica se existe uma conta com o email fornecido e se a senha corresponde.
Se as credenciais do usuário (como email e senha) forem válidas, gera um token de autenticação. 
Esse token é então enviado ao cliente e deve ser incluído em todas as solicitações subsequentes para acessar recursos protegidos.

*/