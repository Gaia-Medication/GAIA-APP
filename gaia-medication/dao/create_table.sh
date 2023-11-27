#!/bin/bash

# Define the SQLite database file
DATABASE="database.db"

# SQL command to create a table
SQL="CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT,
      lastname TEXT,
      birthdate TEXT,
      gender TEXT,
      preference TEXT
    );"

# Execute the SQL command against the SQLite database
sqlite3 $DATABASE "$SQL"
