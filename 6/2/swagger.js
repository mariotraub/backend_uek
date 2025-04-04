import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Library',
    description: 'This is my Library'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./main.js'];

swaggerAutogen()(outputFile, routes, doc);
