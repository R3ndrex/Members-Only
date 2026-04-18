const db = require("./pool");
async function getUserById(id) {
    const { rows } = await db.query(`SELECT * FROM users WHERE users.id=$1`, [
        id,
    ]);
    return rows[0];
}
async function findUserByEmail(email) {
    const { rows } = await db.query(
        `SELECT * FROM users WHERE users.email=$1`,
        [email],
    );
    return rows[0];
}

async function createUser({ lastName, firstName, email, password }) {
    const { rows } = await db.query(
        `INSERT INTO users(firstName,lastName,email,password,status) VALUES($1,$2,$3,$4,'member') RETURNING id, firstName, lastName, email, status`,
        [firstName, lastName, email, password],
    );
    return rows[0];
}
module.exports = {
    getUserById,
    createUser,
    findUserByEmail,
};
