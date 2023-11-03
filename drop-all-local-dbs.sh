#!/bin/bash

mongosh --eval 'db.adminCommand("listDatabases").databases.
   map(d => d.name).
   filter(n => ["admin", "config", "local"].indexOf(n) == -1 ).
   map(n => db.getSiblingDB(n).dropDatabase())'
