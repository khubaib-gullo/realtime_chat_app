FROM node:22-alpine

WORKDIR /server

COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript build)
RUN npm install

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 4000

# Run compiled output
CMD ["node", "dist/index.js"]