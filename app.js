import express from 'express';
import exphbs from 'express-handlebars'
import morgan from 'morgan'

//#region Create __dirname variable
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
//#endregion

const app = express()

app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'))

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('home')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server started listening on ${PORT}`)
})