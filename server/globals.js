const env = process.env.NODE_ENV;

global.__env = env;
global.__serverRoot = __dirname;
global.__projectRoot = `${__serverRoot}/..`;
