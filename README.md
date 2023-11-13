# Storage App

[![CircleCI](https://img.shields.io/circleci/build/github/glayscore/storage-app/main)](https://circleci.com/gh/glayscore/storage-app/tree/main)
[![NPM Version](https://img.shields.io/npm/v/storage.svg)](https://www.npmjs.com/package/storage)
[![License](https://img.shields.io/npm/l/storage.svg)](https://github.com/glayscore/storage-app/blob/main/LICENSE)

A Node.js application built with NestJS and TypeORM.

## Installation

0. Clone the repository:

   ```bash
   git clone https://github.com/glayscore/storage-app.git

1. Install dependencies:
   cd storage-app
   npm install

2. Set up environment variables:

   Create a .env file in the root directory and configure the following variables:

    DATABASE_HOST=localhost
    DATABASE_USER=root
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=storage

## Running the App

  # Development mode
    npm run start:dev

  # Production mode
    npm run start:prod  

## Docker Support

    # Build and start the containers
    npm run start:docker

    # Stop the containers
    npm run stop:docker

## Database Migrations

    # Create a new migration
    npm run migration:create migration_name

    # Generate a migration from changes in the entities
    npm run migration:generate

    # Run migrations
    npm run migration:run

    # Rollback the last migration
    npm run migration:down

    # Drop all database tables (CAUTION)
    npm run migration:dropAll

## License
    This project is licensed under the MIT License - see the LICENSE file for details.

