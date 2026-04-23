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
async function giveMembership(userId) {
    await db.query(
        `UPDATE users
        SET status='member'
        WHERE users.id=$1`,
        [userId],
    );
}
async function createPost({ title, description, authorId }) {
    await db.query(
        `INSERT INTO posts(title,description,createdAt,authorId) VALUES($1,$2,NOW(),$3)`,
        [title, description, authorId],
    );
}
async function getAllPosts() {
    const { rows } =
        await db.query(`SELECT posts.id,posts.title,posts.description,posts.createdat,CONCAT(users.firstname,' ', users.lastname) AS fullname FROM posts
        JOIN users ON users.id=posts.authorid
        `);
    return rows;
}
async function deletePost(postId) {
    await db.query(`DELETE FROM posts WHERE posts.id=$1`, [postId]);
}
async function createUser({ lastName, firstName, email, password, isAdmin }) {
    const { rows } = await db.query(
        `INSERT INTO users(firstName,lastName,email,password,status,isAdmin) VALUES($1,$2,$3,$4,'user',$5) RETURNING id, firstName, lastName, email, status`,
        [firstName, lastName, email, password, isAdmin],
    );
    return rows[0];
}
module.exports = {
    getUserById,
    createUser,
    findUserByEmail,
    createPost,
    giveMembership,
    getAllPosts,
    deletePost,
};
