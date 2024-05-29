import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { serverOf } from '../src/server'
import * as TodoRepo from '../src/repo/todo'
import * as TodoService from '../src/services/todo'
import { TodoBody, Todo } from '../src/types/todo'
import { ModifyResult } from 'mongoose'
import mongoose from 'mongoose';

describe('Todo API Testing', () => {
  const server = serverOf()

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('Given an empty array return from repo function, When send a GET request to /api/v1/todos, Then it should response an empty array', async () => {
    // assert: stub the repo function to return an empty array
    vi.spyOn(TodoRepo, 'findAllTodos').mockImplementation(async () => [])

    // act: send a GET request to /api/v1/todos
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/todos'
    })

    // assert: response should be an empty array
    const todos = JSON.parse(response.body)['todos']
    expect(todos).toStrictEqual([])
  })

  test('Given an mocked todo item, when send POST request to /api/v1/todos, \
        then should response HTTP status code 201 and todo item which successfully added to DB', async () => {

    const todoBody: TodoBody = {
      name: 'Test Todo',
      description: 'This is a test todo',
      status: false,
    };

    const createdTodo: Todo = {
      id: '1',
      ...todoBody,
    };

    vi.spyOn(TodoRepo, 'createTodo').mockImplementation(async () => Promise.resolve(createdTodo));

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/todos',
      payload: todoBody,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().todo).toEqual(createdTodo);
  });


  test('Given an mocked todo item and throw out error, when send POST request to /api/v1/todos, \
        then should response 500 HTTP status code and correct error message', async () => {
    // Mocked todo body
    const todoBody: TodoBody = {
      name: 'Test Todo',
      description: 'This is a test todo',
      status: false,
    };

    const errorMessage = 'Database error';
    vi.spyOn(TodoRepo, 'createTodo').mockImplementation(async () => {
      throw errorMessage;
    });;

    // Making the POST request to the server
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/todos',
      payload: todoBody,
    });

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.payload).toBe(`[Server Error]: ${errorMessage}`);
  });


  test('Given a todo item want to delete, when send DELETE request to /api/v1/todos/:id \
        then response 204 HTTP status code and empty reponse', async () => {

    const todoId = '660fa2174a711070428ed00c';

    const deletedTodo: Todo & { _id: mongoose.Types.ObjectId } = {
      _id: new mongoose.Types.ObjectId(),
      id: todoId,
      name: 'Test Todo',
      description: 'This is a test todo',
      status: false,
    };

    const modifyResult: ModifyResult<Todo> = {
      value: deletedTodo,
      ok: 1,
    };
    vi.spyOn(TodoRepo, 'deleteTodoById').mockResolvedValue(modifyResult);

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/todos/${todoId}`,
    });

    // Assertions
    expect(response.statusCode).toBe(204);
    expect(response.payload).toBe('');
  });


  test('Given a todo item which not exist to delete, when send DELETE request to /api/v1/todos\
        then should response HTTP status code 404 and not exist text', async () => {
    const todoId = '660fa2174a711070428ed00c';

    const modifyResult: ModifyResult<Todo & { _id: mongoose.Types.ObjectId }> =                                    {
      value: null,
      ok: 1,
    };
    vi.spyOn(TodoRepo, 'deleteTodoById').mockResolvedValue(null);

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/todos/${todoId}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ msg: `Not Found Todo:${todoId}` });
  });

  test('Given a error to throw out when send DELETE request to /api/v1/todos, \
        then should catch error and return error message in Error handling', async () => {
    const todoId = '12660fa2174a711070428ed00c3'; 
    const errorMessage = 'Database error';

    vi.spyOn(TodoRepo, 'deleteTodoById').mockImplementation(async () => {
      throw errorMessage;
    });

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/todos/${todoId}`,
    });

    expect(response.statusCode).toBe(500);
    expect(response.payload).toBe(`[Server Error]: ${errorMessage}`);
  });
})
