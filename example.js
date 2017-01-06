const debug = require('debug')('server');
const app = require('./lib/app');

// app.engine('haml', app.renderEngine.haml);

/** middlewares **/
/*
app.use(timeout('30s'));

app.use(helmet());

app.use(compression());

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(limes.verifyTokenMiddlewareExpress({
  payloadWhenAnonymous: {
    foo: 'bar',
  },
}));

if (fs.existsSync(`${__dirname}/public/favicon.ico`)) { // sync version not deprecated
  app.use(favicon(`${__dirname}/public/favicon.ico`));
}

app.use(express.static('public'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500).send('Something broke!');
});
*/
/** middlewares **/

/** routes **/
app.get('/', (req, res) => {
  res.send('Hello World!');
});
/** routes **/

app.listen(3000, () => {
  debug('Example app listening on port 3000!');
});
