# Debugging Docker Containers

This document provides instructions on how to use the debugging capabilities added to the Docker containers for the online shop application.

## Overview of Changes

The following changes have been made to enable debugging in the Docker containers:

### Frontend (React/Nginx)

1. **Dockerfile Changes**:
   - Enabled source map generation
   - Copied source code to the container for better debugging
   - Added debug logging to Nginx

2. **docker-compose.yml Changes**:
   - Set environment variables for development mode
   - Exposed LiveReload port (35729)
   - Mounted source code and Nginx logs directories as volumes

### Backend (Spring Boot/Java)

1. **Dockerfile Changes**:
   - Added verbose logging during Maven build
   - Copied source code to the container for better debugging
   - Exposed remote debugging port (5005)
   - Added JVM arguments for remote debugging and verbose logging

2. **docker-compose.yml Changes**:
   - Added environment variables for logging and debugging
   - Exposed remote debugging port (5005)
   - Mounted source code directory as a volume for live debugging

## How to Use Debugging Features

### Frontend Debugging

1. **Accessing Nginx Logs**:
   - Logs are available in the `frontend/nginx/logs` directory
   - You can also view logs directly from the container:
     ```bash
     docker logs online-shop-frontend
     ```

2. **Using Source Maps**:
   - Source maps are enabled in the build process
   - When viewing errors in the browser console, you'll see references to the original source files
   - The source code is mounted at `/usr/share/nginx/html/src` in the container

3. **LiveReload**:
   - Port 35729 is exposed for LiveReload
   - Changes to the source code will be reflected in the browser automatically

### Backend Debugging

1. **Remote Debugging with IDE**:
   - Connect your IDE to port 5005 on localhost
   - For IntelliJ IDEA:
     1. Go to Run > Edit Configurations
     2. Add a new Remote JVM Debug configuration
     3. Set the host to localhost and the port to 5005
     4. Start the debug session

2. **Viewing Logs**:
   - Logs are available in the container's stdout/stderr
   - You can view them with:
     ```bash
     docker logs online-shop-backend
     ```

3. **Heap Dumps**:
   - If the application runs out of memory, a heap dump will be generated in the `/tmp` directory of the container
   - You can copy it to your local machine with:
     ```bash
     docker cp online-shop-backend:/tmp/java_pid1.hprof ./
     ```

## Troubleshooting

### Frontend Issues

- If you don't see source maps in the browser console, make sure the browser's developer tools are configured to use source maps
- If LiveReload isn't working, check that port 35729 is not blocked by a firewall

### Backend Issues

- If you can't connect to the remote debugger, make sure port 5005 is not blocked by a firewall
- If the application seems to hang on startup, check if the debugger is set to suspend on startup (it shouldn't be with the current configuration)

## Additional Resources

- [Remote Debugging Java Applications](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html)
- [Debugging React Applications](https://reactjs.org/docs/debugging-tools.html)
- [Nginx Debugging](https://docs.nginx.com/nginx/admin-guide/monitoring/debugging/)