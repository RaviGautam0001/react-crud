import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import loadingGif from './loadingGif.gif';
import './App.css';
import ListItem from './ListItem';

class App extends Component {


  constructor(){
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    }

    this.apiUrl = 'https://5c56bdb5d293090014c0ee6c.mockapi.io';

    this.alert = this.alert.bind(this); 
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.generateTodoId = this.generateTodoId.bind(this);
  }

  generateTodoId(){
     const lastTodo = this.state.todos[this.state.todos.length - 1];
     if(lastTodo){
       return lastTodo.id + 1;
     } 

     return 1;
  }

  async componentDidMount(){
     const response = await axios.get(`${this.apiUrl}/todos`);
     this.setState({todos: response.data, loading: false});
  }

  async addTodo(e){
    // const newTodos = {
    //   name: this.state.newTodo,
    //   id: this.generateTodoId()
    // }

    const response = await axios.post(`${this.apiUrl}/todos`, { name: this.state.newTodo });

    const todos = this.state.todos;
    todos.push(response.data);

    this.setState({todos: todos, newTodo: ''});
    this.alert('Todo added successfully.'); 
  }

  alert(notification){
    this.setState({notification: notification});
    setTimeout(() => {
      this.setState({notification: ''})
    },2000)
  }

  
  editTodo(index){
    const todo = this.state.todos[index];
    this.setState({editing: true, newTodo: todo.name, editingIndex: index});
  }

  async updateTodo(){
    const todo = this.state.todos[this.state.editingIndex];
    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {name: this.state.newTodo});
    todo.name = this.state.newTodo;
    const todos = this.state.todos;
    // todos[this.state.editingIndex] = todo;
    todos[this.state.editingIndex] = response.data;
    this.setState({ todos: todos , editing: false, editingIndex: null, newTodo: ''});
    this.alert('Todo updated successfully.');
  }

  async deleteTodo(index){

    const todos = this.state.todos;
    const todo =  todos[index];
    const response = await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    delete todos[index];

    this.setState({todos: todos});
    this.alert('Todo deleted successfully.');
  }

  handleChange(event){
    this.setState({newTodo: event.target.value});
    console.log(event.target.name, event.target.value);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            CRUD REACT
          </p> 
        </header>

        <div className="container">
             
            {
              this.state.notification &&
              <div className="alert mt-3 alert-success">
                <p className="text-center">{this.state.notification}</p>
              </div>
            }

             <input 
              type="text"
              name="todo" 
              className="my-4 form-control"
              placeholder="Add a new Todo"
              onChange={this.handleChange}
              value={this.state.newTodo}
              />

              <button 
                 onClick={this.state.editing ? this.updateTodo : this.addTodo} 
                 className="btn-success mb-3 form-control"
                 disabled={this.state.newTodo.length < 5}
                 >
                 {this.state.editing ? 'Update Todo' : 'Add Todo'}
              </button>

              {
                this.state.loading && 
                <img src={loadingGif}  />
              }

             {
               (!this.state.editing || this.state.loading) && 
               <ul className="list-group">
               {this.state.todos.map((item,index) => {
 
                  return <ListItem 
                      key={item.id}
                      item={item}
                      editTodo={() => {this.editTodo(index)}}
                      deleteTodo={() => {this.deleteTodo(index)}}
                  />              
  
               })}
               </ul>
             }

        </div>
            
      </div>
    );
  }
}

export default App;
