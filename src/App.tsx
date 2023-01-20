import { useEffect, useState } from 'react'


const LOCAL_STORAGE_TODOS = 'todos'

function App() {
  const [todo, setTodo] = useState<Todo>(new Todo())
  const [todos, setTodos] = useState<Todo[]>([])
  const completedTodos = todos.filter((todo) => todo.completed)
  const pendingTodos = todos.filter((todo) => !todo.completed)

  useEffect(() => localStorage.setItem(LOCAL_STORAGE_TODOS, JSON.stringify(todos)), [todos])
  useEffect(() => {
    const localStorageTodos = localStorage.getItem(LOCAL_STORAGE_TODOS)
    if (localStorageTodos === null) return
    setTodos(JSON.parse(localStorageTodos))
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (todo.title === '') return

    const id = todos[todos.length - 1]?.id + 1 || 0
    setTodos([...todos, { ...todo, id }])
    setTodo(new Todo())
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTodo({ ...todo, title: e.target.value })
  const handleDelete = (id: number) => setTodos(todos.filter((todo) => todo.id !== id))
  const handleComplete = (id: number) => setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))

  return (
    <div className='w-80 mx-auto py-20'>
      <form onSubmit={handleSubmit} className='mb-10'>
        <input
          type='text'
          placeholder='todo'
          className='border px-5 py-2 w-full rounded-lg mb-2'
          value={todo.title}
          onChange={handleTitleChange}
        />
        <button
          type='submit'
          className='px-5 py-2 bg-blue-600 w-full text-white rounded-lg hover:bg-blue-900'
        >
          Add new todo
        </button>
      </form>
      <TodosList
        title='To do'
        todos={pendingTodos}
        handleComplete={handleComplete}
        handleDelete={handleDelete}
      />

      <TodosList
        title='Done'
        todos={completedTodos}
        handleComplete={handleComplete}
        handleDelete={handleDelete}
      />
    </div>
  )
}

type TodosProps = {
  title: string
  todos: Todo[]
  handleComplete: (id: number) => void
  handleDelete: (id: number) => void
}

function TodosList({ title, todos, handleComplete, handleDelete }: TodosProps) {
  return (
    <>
      {todos.length > 0 &&
        <div className='mb-10'>
          <h1 className='text-3xl font-bold mb-2'>{title}</h1>
          <ol className='list-decimal'>
            {todos.map(todo => (
              <li key={todo.id} className='flex items-center py-1'>
                <span className={todo.completed ? 'line-through opacity-25' : ''}>{todo.title}</span>
                <button
                  type='button'
                  className='w-10 h-10 bg-green-700 hover:bg-green-900 text-white rounded-lg ml-auto mr-1'
                  onClick={() => handleComplete(todo.id)}
                >
                  &#10003;
                </button>
                <button
                  type='button'
                  className='w-10 h-10 bg-red-700 hover:bg-red-900 text-white rounded-lg'
                  onClick={() => handleDelete(todo.id)}
                >
                  &#10007;
                </button>
              </li>
            ))}
          </ol>
        </div>
      }
    </>
  )
}

class Todo {
  id: number
  title: string
  completed: boolean

  public constructor(id: number = 0, title: string = '', completed: boolean = false) {
    this.id = id
    this.title = title
    this.completed = completed
  }
}

export default App
