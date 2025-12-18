FROM node:22-alpine

WORKDIR /app

# this copying the package.json file help to used the cached npm i memory insted of re-building in docker file --> which reduce build time of the docker file 
# This is the Optimal solution for the docker file --> containerization 

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json    

RUN npm install

# after the all the dependacy cached --> then all source code get copied by using below cmd 
COPY . .


EXPOSE 3000

CMD ["npm", "run", "dev"]
