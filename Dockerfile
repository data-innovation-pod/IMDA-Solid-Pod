# Use the official Node.js image as the base  
FROM node:18-alpine

# create a user with permissions to run the app
# -S -> create a system user
# -G -> add the user to a group
# This is done to avoid running the app as root
# If the app is run as root, any vulnerability in the app can be exploited to gain access to the host system
# It is good practice to run the app as a non-root user
# RUN addgroup app && adduser -S -G app app

# set the user to run the app
# USER app

# Set the working directory inside the container  
WORKDIR /app  

# Copy package.json and package-lock.json to the container  
COPY package*.json ./  

#sometimes the ownership of the files in the working directory is changed to root
# and thus the app can't access the files and throws an error -> EACCES: permission denied
# to avoid this, change the ownership of the files to the root user
# USER root

# change the ownership of the /app directory to the app user
# chown -R <user>:<group> <directory>
# chown command changes the user and/or group ownership of for given file
# RUN chown -R app:app

# change the user back to the app user
# USER app

# Install dependencies  
RUN npm ci  

# Copy the app source code to the container  
COPY . .  

# Build the Next.js app  
RUN npm run build

# Pass SKIP_ENV_VALIDATION environment variable to skip environment validation
# RUN SKIP_ENV_VALIDATION=true npm run build

# Expose the port the app will run on  
EXPOSE 3001

# Start the app  
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- npx knex migrate:latest && npm start"]
