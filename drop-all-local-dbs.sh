#!/bin/bash

mongosh --eval 'db.getSiblingDB("blog-as-as-service-development").dropDatabase()'
