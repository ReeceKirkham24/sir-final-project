const Comment = require('../models/Comments')

async function index(req, res) {
    try {
        const comments = await Comment.getAll()
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


async function showId(req, res) {
    try {
        let id = parseInt(req.params.id)
        const comment = await Comment.getOneByID(id)
        res.status(200).json(comment)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const newComment = await Comment.create(data)
        res.status(201).json(newComment)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const comment = await Comment.getOneByID(id)
        const result = await comment.update(data)
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({ error: err.message })
    }
}

async function destroy(req, res) {
    try {
        const id = parseInt(req.params.id)
        const comment = await Comment.getOneByID(id)
        await comment.destroy()
        res.status(204).end()
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

module.exports = {
    index,
    showId,
    create,
    update,
    destroy
}