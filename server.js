const pkg = require('./config/dependencies');
const config = require('./config/config');

const port = config.port
const app = pkg.express();

app.use(pkg.morgan('dev'));
app.use(pkg.bodyParser.json({extended: true}));
app.use(pkg.bodyParser.urlencoded({extended: true}));

/** API Routes **/
require('./config/routes/costOfLiving')(app, pkg.axios); //Cost of Living Calculator

app.listen(port);
console.log("The smugglers are on port " + port);