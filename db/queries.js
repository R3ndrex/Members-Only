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
async function createPost({ title, description, authorId }) {
    await db.query(
        `INSERT INTO posts(title,description,createdAt,authorId) VALUES($1,$2,NOW(),$3)`,
        [title, description, authorId],
    );
}
async function getAllPosts() {
    const { rows } = await db.query(`SELECT * FROM posts`);
    const result = await Promise.all(
        rows.map(async (row) => {
            const author = await getUserById(row.authorid);
            const fullname = `${author.firstname} ${author.lastname}`;
            return { ...row, fullname: fullname };
        }),
    );
    return result;
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
    createPost,
    getAllPosts,
};
