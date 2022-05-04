const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")
const errorHandler = require("./middleware/error")
const connectDB = require("./config/db")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// Connect to database
connectDB()



const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

console.log("=====I am coming here======");

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
  //   res.setHeader('Access-Control-Allow-Origin', 'https://zksurvey-frontend.vercel.app');
  //   res.setHeader('Access-Control-Allow-Origin', 'https://test-anonyvote.vercel.app');
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, UPDATE, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    // Pass to next layer of middleware
    // intercept OPTIONS method
    console.log("-------setting header------")
    next();
  });

// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// cors
// app.use(cors());
console.log("=====I am coming here======");

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 1000
})
// app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// app.options('*', cors())

// Enable CORS
// app.use(
//     cors({
//         origin: "*",
//         methods: ['GET','POST','DELETE','UPDATE','OPTIONS','PUT','PATCH'],
//       })
// )




// Set static folder
app.use(express.static(path.join(__dirname, "public")))


// Route files
const polls = require("./routes/polls")
const votes = require("./routes/votes")
const semaphore = require("./routes/semaphore")

// Mount routers
app.use("/api/v1/polls", polls)
app.use("/api/v1/votes", votes)
app.use("/api/v1/semaphore", semaphore)

app.use(errorHandler)

const PORT = process.env.PORT || 8000

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
)

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server & exit process
    // server.close(() => process.exit(1));
})
