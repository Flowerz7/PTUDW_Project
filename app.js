import express from 'express';
import exphbs from 'express-handlebars'
import morgan from 'morgan'

const app = express()

//#region Set up the __dirname variable
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(`${__dirname}/public`));
//#endregion

//#region Set up the logger Morgan
app.use(morgan('dev'))
//#endregion

//#region Set up the view engine
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
//#endregion

app.get('/', (req, res) => {
    res.render('home')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server started listening on ${PORT}`)
})