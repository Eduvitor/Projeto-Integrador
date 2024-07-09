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
  app.get("/Animais", requireJWTAuth, async (req, res) => {
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

app.get("/animalId:id", requireJWTAuth, async (req, res) => {
  try {
    const idA = req.params.id;
    const Animal = await db.one(
      "SELECT * FROM tanimal t JOIN tmedused m ON t.aid=m.aid JOIN tmedicine me ON m.idmed=me.idmed WHERE t.aid=$1", [idA]
    );
    res.json(Animal).status(200);
  } catch (error) {
    console.log("An error has ocurred!", error);
    res.send(500);
  }
});


app.delete("/Delanimal:id", requireJWTAuth, async (req, res) => {
  const animalId = req.params.id;
  console.log(animalId)
  
  try {
    await db.tx(async t => {
      //Exclui na tabela de registros de medicamentos usados 
      await t.none('DELETE FROM tmedused where aid = $1', [animalId]);
      await t.none('DELETE FROM tanimal WHERE aid = $1', [animalId]);
    });
    res.status(200).json({ message: "Animal excluido com sucesso!" });
  } catch (error) {
    res.status(500).json({error: "Erro ao excluir o animal!"});
  }
});

//Rota para atualizar um animal

app.put("/Attanimal:id", requireJWTAuth, async (req, res)=>{
  console.log("TESTE")
  try {
    const id = req.params.id;
    const {
      animalrace,
      pesoanimal,
      animal_color,
      animalhproblem,
      animal_brinco,
      prodstate,
      animal,
      idState,
      datamed,
      dosused,
      catmed
    } = req.body;
    console.log("Testando", animal_brinco, animal, pesoanimal);
    await db.tx(async t => {
      const animalPut = `UPDATE tanimal SET araca=$1, apeso=$2, acolor=$3, health_problem=$4, b_number=$5, prodstate=$6, apelido=$7 WHERE aid=$9 RETURNING aid`

      const animalAtt = [animalrace, pesoanimal, animal_color, animalhproblem, animal_brinco, prodstate, animal, idState, id];
      const animalResult = await t.one(animalPut, animalAtt); 

      if (datamed && catmed) {

        const MedUsed = [animalResult.aid, catmed, dosused];
        const testeTem =  `SELECT * FROM tmedused WHERE aid=$1 and idmed=$2`;

        const medexists = await t.oneOrNone(testeTem, [animalResult.aid, catmed]);

        if (medexists) {
          const updateMedQuery = `UPDATE tmedused SET dataMed=$1, dosagem=$2 WHERE aid=$3 and idmed=$4`;
          await t.none(updateMedQuery, [datamed, dosused, animalResult.aid, catmed]);
        } else {
          const insertMedQuery = `INSERT INTO tmedused (aid, idmed, dataMed, dosagem) VALUES ($1, $2, $3, $4)`;
          await t.none(insertMedQuery, [animalResult.aid, catmed, datamed, dosused]);
        }
      }
    });
    res.status(200).json({message: "Animal atualizado com sucesso!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Erro ao atualizar o animal!"});
  }
});

//Rota para pegar o id e nome dos medicamentos
app.get("/IdAndNameMEDS", requireJWTAuth, async (req, res) => {
  try {
    const resMed = await db.many(
      "SELECT idmed, name_med FROM tmedicine;"
    );
    res.json(resMed).status(200);
  } catch (error) {
    console.log("An error has ocurred", error);
    res.sendStatus(400);
  }
});

//Rota para pegar os medicamentos usados

app.get("/MedUsed:aid",  async (req, res) => {
  try {
    const id = req.params.aid;
    const dadosUsed = await db.many(
      "SELECT * FROM tmedused where aid = $1;"
    );
    console.log(dadosUsed);
    res.json(dadosUsed).status(200);
  } catch (error) {
    console.log("An error has ocurred", error);
    res.sendStatus(400);
  }
});


//Vai trazer todos os dados desde de medicamento até a categoria
app.get("/Medandcats:id", async (req, res) => {
  try {
    const idcat = req.params.id;
    console.log(idcat);
    const dadosMed = await db.many(
      "SELECT * FROM tmedicine t JOIN tcategorymed tc ON t.catid=tc.catid WHERE t.catid=$1", [idcat]
    );
    console.log(dadosMed);
    res.status(200).json(dadosMed);
  } catch (error) {
    console.log("An error has ocurred!", error);
    res.status(400).json({message: "Não foi possivel coletar os dados!"});
  }
});

//Rota para pegar as categorias

app.get("/categorias", requireJWTAuth, async (req, res) => {
  try {
    console.log("porra");
    const  cat = await db.many(
      "SELECT catid, typemed FROM tcategorymed;"
    );
    console.log(cat);
    res.json(cat).status(200);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

//Rota para pegar os estados dos animais

app.get("/States", requireJWTAuth, async (req, res) => {
  try {
    const states = await db.many(
      "SELECT estado, idSaude FROM tstateSaude;"
    );
    res.json(states).status(200);
  } catch (error) {
    res.json(error).status(400);
  }
});


//Rota para pegar os dados do grafico

app.get("/Grafico1", requireJWTAuth, async (req, res) => {
  try {
    const dados = await db.many(
      "SELECT data_added, COUNT(*) AS num_animal FROM tanimal GROUP BY data_added ORDER BY data_added;" //Seleciona e conta os animais cadastrados no sistema
    );
    res.json(dados).status(200);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});


//Rota para retornar os medicamentos cadastrados
app.get("/Medicamentos", requireJWTAuth, async (req, res) => {
  try {
    const dados = await db.many(
      "SELECT * FROM tmedicine t JOIN tcategorymed cat ON t.catid=cat.catid;"
    );
    console.log(dados);
    res.json(dados).status(200);
  } catch (error) {
    console.log("An error has ocurred:", error);
    res.status(400);
  }
});

app.delete("/Delmedicine:id", requireJWTAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const isAssociated = await db.any(
      "SELECT * FROM tmedused WHERE idmed=$1", [id]
    );

    if (isAssociated.length > 0) {
      console.log("Está associado")
      return res.status(400).json({message: "Não foi possivel excluir pois o medicamento está associado a um ou mais animais!"});
    }
    
    await db.none("DELETE FROM tmedicine WHERE idmed = $1", [id]);
    res.status(200).json({message: "Medicamento foi excluido com sucesso!"});
  } catch (error) {
    console.log("An error has ocurred:", error);
    res.status(400).json({message: "Ocorreu um erro ao excluir o medicamento!"});
  }
});

//Rota para atualizar os dados de um medicamento
app.put("/Attmedicine:id", requireJWTAuth, async (req, res) => {
  try {
    const idmed = req.body.idmed;
    const name_med = req.body.name_med;
    const dose_kg = req.body.dose_kg;
    const data_venc = req.body.venc_day;
    const days_car = req.body.days_car;
    const type_car = req.body.type_car;
    const col_effect = req.body.col_effect;
    console.log("nomenovo", name_med);
    await db.none(
      "UPDATE tmedicine SET name_med=$1, dose_kg=$2, venc_day=$3, days_car=$4, type_car=$5, col_effect=$6 WHERE idmed=$7", [name_med, dose_kg, data_venc, days_car, type_car, col_effect, idmed]
    );
    res.status(200).json({message: "Medicamento atualizado com sucesso!"});
  } catch (error) {
    console.log("An error has ocurred!", error);
    res.status(500).json({message: "Não foi possivel atualizar os dados do medicamento"});
  }
});

//Rota para retornar os eventos cadastrados
app.get("/Eventos", requireJWTAuth, async (req, res) => {
  try {
    const eventoProx = await db.many(
      "SELECT event_id, ename, edate, elocal FROM tevent WHERE edate >= CURRENT_DATE ORDER BY edate ASC LIMIT 2;"
    );
    res.json(eventoProx).status(200);
  } catch (error) {
    console.log("An error has ocurred:", error);
    res.status(400).json({message: "Não foi possivel obter os eventos"});
  }
});

//Rota para pegar os dados de peso dos animais
app.get("/Mediapesos", requireJWTAuth, (req, res) => {});

//Rota para adicionar animais 

app.post("/Addanimal", requireJWTAuth, async (req, res)=> {
  try {
    const araca = req.body.animalrace;
    const apeso = req.body.pesoanimal;
    const acolor = req.body.animal_color;
    const healt_problem = req.body.animalhproblem;
    const b_number = req.body.num_brinco || null;
    const prodstate = req.body.prodstate || null;
    const idstate = req.body.idState;
   //onst data_added = "11-11-1928"; c
    const apelido = req.body.animal || null;
    const data_med = req.body.datamed || null;
    const dosgem = req.body.dosused || null;
    const idmed = req.body.catmed || null;

    console.log(idmed);

      await db.tx(async t => {
        const animalQuery = `INSERT INTO tanimal (araca, apeso, acolor, health_problem, b_number, prodstate, apelido, idstate) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING aid
        `;
        
        const animalValues = [araca, apeso, acolor, healt_problem, b_number, prodstate, apelido, idstate];
        const animalResult = await t.one(animalQuery, animalValues);

        if (data_med && idmed) {

          const medUsedQuery = `
            INSERT INTO tmedused (aid, idmed, dataMed, dosagem)
            VALUES ($1, $2, $3, $4)
          `;
          const medUsedValues = [animalResult.aid, idmed, data_med, dosgem ]
          await t.none(medUsedQuery, medUsedValues);
        }
      });
    res.status(200).json( { message: "Animal adicionado com success!" } );
    console.log(req.body);
  } catch (error) {
    //console.log(error);
    res.status(400).json( {erro: error} );
  };
});

//Rota de post para medicamentos

app.post("/Addmedicamento", requireJWTAuth, async (req, res) => {
  try {
    console.log(req.body);
    const catmed = req.body.catmed;
    const nomemed = req.body.nmed;
    const daycar = req.body.daycar || null;
    const col_effect = req.body.coleeffect || null;
    const dose = req.body.dos || null;
    const date = req.body.datavenc;
    const typec = req.body.typec || null;
    const qnt = req.body.qnt || null;

    await db.tx(async t => {
      const animalQuery = `INSERT INTO tmedicine (name_med, dose_kg, venc_day, days_car, type_car, col_effect, qnt, catID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

      const animalValues = [nomemed, dose, date, daycar, typec, col_effect, qnt, catmed];
      await t.none(animalQuery, animalValues);
    });
    res.status(200).json({message: "Medicamento cadastrado com sucesso!"});
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "Não foi possivel adicionar o Medicamento", erro: error});
  }
});