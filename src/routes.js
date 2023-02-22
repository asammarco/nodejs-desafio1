import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from './database.js'
import { formatDate } from "./utils/dateTime.js";

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path:buildRoutePath('/tasks'),
    handler: (req,res) => {

      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  }, 
  {
    method: 'POST',
    path:buildRoutePath('/tasks'),
    handler: (req,res) => {

      const {
        title,
        description
      } = req.body

      if(!title){
        return res.writeHead(400).end(
          JSON.stringify({message:"Title is required"})
        )
      }

      if(!description){
        return res.writeHead(400).end(
          JSON.stringify({message:"Description is required"})
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: formatDate(Date.now()),
        updated_at: formatDate(Date.now())
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', {id})

      if(!task){
        return res.writeHead(404).end()
      }

      const { title, description } = req.body

      if(!title || !description){
        return res.writeHead(404).end(
          JSON.stringify({message:"Title and Description are required"})
        )
      }

      database.update('tasks',
        id, {
          title,
          description,
          updated_at: formatDate(Date.now())
        })

        return res.writeHead(204).end()
    }
  }, 
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      const { id } = req.params
  
      const [task] = database.select('tasks', {id})

      if(!task){
        res.writeHead(404).end()
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req,res) => {
      const { id } = req.params
      
      const [task] = database.select('tasks', {id})

      if(!task){
        res.writeHead(404).end()
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : formatDate(Date.now())

      database.update('tasks', id, {
        completed_at
      })

      return res.writeHead(204).end()
    }
  },
  
]