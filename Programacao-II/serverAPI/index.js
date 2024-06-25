const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const pgp = require("pg-promise")({});
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();



//String de conexao com o banco de dados


//Configuracoes do servidor express
app.use(express.json());
app.use(cors(
    {
        origin: '*'
    }
));

const usuario = process.env.DB_USER;
const senha = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const porta = process.env.DB_PORT;
const banco_de_dados = process.env.DB_NAME

const db = pgp(`postgres://${usuario}:${senha}@${host}:${porta}/${banco_de_dados}`);

app.use(
  session({
    secret: "isso_e_uma_frase_grande_para_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);


app.use(passport.initialize());
app.use(passport.session());

//Estrategia local recebe credencials, busca o usuario no banco de dados, verifica senha, se a autenticacao for valida autentica o usuario se nao retorna um erro
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        console.log("CHEGUEI AQUI");
        //Aqui busca o usuario no banco de dados
        const usuario = await db.oneOrNone(
          "SELECT * FROM tusers WHERE ncpf = $1;",
          [username]
        ); //Retorno dessa query deve ser apenas 1 ou nenhum valor do banco, contem o user que estamos buscando, lmebrando pk=ncpf
        //Verificacao para ver se o usuario foi encontrado
        if (!usuario) {
          return done(null, false, { message: "Usuario esta incorreto!" });
        }
        //Aqui deve se verificar se a senha com hash bate com a senha do banco
        const passwordIsEqual = await bcrypt.compare(password, usuario.passwd);

        if (passwordIsEqual) {
          console.log("success");
          return done(null, usuario);
        } else {
          return done(null, false, { message: "A senha esta incorreta!" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Estrategia para autorizar o usuario logado a acessar as rotas protegidas com seu jwtoken gerado na autenticacao
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "user-secret-key",
    },
    async (payload, done) => {
      try {
        const user = await db.oneOrNone(
          "SELECT * FROM tusers where ncpf = $1;",
          [payload.username]
        );

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Essas funcoes definem como as informacaoes do usuario sao armazenadas e recuperadas durante a sessao
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			ncpf: user.ncpf,
            name: user.uname,
		});
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.listen(3301, () => console.log("Servidor Rodando na porta 3301"));
//Inicio da construcao das rotas
app.get("/teste", (req, res) => {
  res.sendStatus(200);
});

//Rota para Adicionar um novo usuario no banco

app.post("/Signin", (req, res) => {
  const saltRounds = 10;
  //Cuidar com os nomes dos campos dque vao vir da requisicao n sei se vou fazer tela de login
  //Vou definir os nomes dos campos como email, senha, cpf, numtell, ativity, name
  try {
    const CPF = req.body.cpf;
    const EMAIL = req.body.email;
    const SENHA = req.body.senha;
    const NUMTELL = req.body.numtell || null;
    const NAME = req.body.name;
    const ACTIVITY = req.body.activity || null;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPasswd = bcrypt.hashSync(SENHA, salt);

    db.none(
      "INSERT INTO tusers (ncpf, uname, passwd, numtel, email, pativity) values ($1, $2, $3, $4, $5, $6);",
      [CPF, NAME, hashedPasswd, NUMTELL, EMAIL, ACTIVITY]
    );

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

app.post(
  "/Login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    //Aqui criamos o token jwt
    const token = jwt.sign({ username: req.body.username }, "user-secret-key", {
      expiresIn: "45m",
    });
    res.json({ message: "Login bem sucedido!", token: token });
  }
);

app.post("/Logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/Login");
  });
});

//Rota para pegar os animais cadastrados no banco
app.get("/Animais", async (req, res) => {
  try {
    const animais = await db.many(
      "SELECT * FROM tanimal;"
    );
    res.json(animais).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
  
  
});

//Rota para retornar os medicamentos cadastrados
app.get("/Medicamentos", (req, res) => {});

//Rota para retornar os eventos cadastrados
app.get("/Eventos", (req, res) => {});

//Rota para pegar os dados de peso dos animais
app.get("/Mediapesos", (req, res) => {});

//Rota para adicionar animais 

app.post("/Addanimal", (req, res)=> {
  try {
    const araca = req.body.raca;
    const apeso = req.body.peso;
    const acolor = req.body.cor;
    const healt_problem = req.body.problema_saude;
    const b_number = req.body.num_brinco || null;
    const prodstate = req.body.estado_producao;
    const apelido = req.body.apelido || null;
    const data_added = req.body.data_adicao ;
    db.none(
      "INSERT INTO tanimal (araca, apeso, acolor, health_problem, b_number, prodstate, apelido, data_added) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ araca, apeso, acolor, healt_problem, b_number, prodstate, apelido, data_added ]
    );
    res.sendStatus(200);
    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.send(400).json( {erro: error} );
  };
});