# View spot finder - Serverless 

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies

### Using Yarn

- Run `yarn` to install the project dependencies

## Local testing
Run `npx serverless offline start`, the api is reachable under `http://localhost:3000/dev/find_views`

### Testing
Test with `curl -X POST -H "Content-Type: application/json" -d @example.json http://localhost:3000/dev/find_views?n=3`

## Api
The endpoint is accessable trough a `POST` request, where the body is expected to be the json mesh format.
Optionaly the query parameter 'n' can be specified on the required amount of view spots, if left empty it will return all suitable view points.

### Json Mesh Format
```ts
{
    nodes: [
        {id: <node_id>, x: <x_pos>, y: <y_pos>},
        ...
    ],
    elements: [
        {id: <element_id>, nodes: [<node_id_1>, <node_id_2>, <node_id_3>]},
        ...
    ],
    values: [
        {element_id: <element_id>, value: <height>},
        ...
    ]
}
```
