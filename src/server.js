require('dotenv').config()
const sequelize = require('./config/database')
const app = require('./app')

const port = process.env.PORT||8001


const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database conected");
        await sequelize.sync()

        app.listen(port, (req, res) => {
            console.log(`Server run on ${port}`);

        })

    } catch (error) {
        console.log(error);

    }
}
startServer()
