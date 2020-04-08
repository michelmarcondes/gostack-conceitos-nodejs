const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//global constants
//better use on exclusive file
//keeping it simple for now
const ERR_REPOSITORY_NOT_FOUND = "Repository not found."

function getRepositoryIndexById(id) {
  return repositories.findIndex(repo => repo.id === id)
}

function getRepositoryById(id) {
  let index = -1
  //looking up for repo
  index = getRepositoryIndexById(id)

  if (index < 0) {
    return {index}
  }

  const repo = repositories[index]
  if (repo) {
    return {index, repo}
  }
  return index
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)
  
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  let {index, repo} = getRepositoryById(id)

  if (index >= 0 && repo != null) {
    //update object
    const { title, url, techs } = request.body

    try {
      repo.title  = title
      repo.url    = url
      repo.techs  = techs

      repositories[index] = repo
    } catch (error) {
      return response.status(500).json(error)
    }

    return response.json(repo)

  } else {
    return response.status(400).json({error: ERR_REPOSITORY_NOT_FOUND})
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = getRepositoryIndexById(id)
  
  //check result
  if ( repoIndex < 0 ) {
    return response.status(400).json({ error: ERR_REPOSITORY_NOT_FOUND })
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  let {index, repo} = getRepositoryById(id)

  if (index >= 0 && repo != null) {
    //update object
    try {
      repo.likes  = ++repo.likes

      repositories[index] = repo
    } catch (error) {
      return response.status(500).json(error)
    }

    return response.json(repo)

  } else {
    return response.status(400).json({error: ERR_REPOSITORY_NOT_FOUND})
  }
});

module.exports = app;
