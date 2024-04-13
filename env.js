const { SECRET, DATABASE_URI, ROUNDS } = process.env;
module.exports = {
    jwtSecret: SECRET,
    mysqlUri: DATABASE_URI,
    rounds: +ROUNDS
}