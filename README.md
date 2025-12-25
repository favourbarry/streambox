StreamBox – Video Streaming Backend API
📌 Description

StreamBox is a backend-only video streaming platform designed to simulate systems like YouTube or Netflix. The goal of this project was to focus entirely on backend engineering concerns such as authentication, media handling, performance optimization, and relational data modeling.

Problem

Modern backend systems must:

Securely authenticate users

Handle large file uploads efficiently

Stream media without exhausting server memory

Track user activity and engagement

Maintain clean, scalable database schemas
The challenge was building a backend that could handle media streaming and high interaction data while remaining modular and scalable.
🛠 Solution

The solution is a RESTful API built with:

Node.js + Express for API handling

Knex.js + PostgreSQL for relational data modeling and migrations

JWT + bcrypt for authentication and authorization

Multer + Node Streams for video uploads and chunked streaming

Implemented features include:

User registration and login

Video upload and storage

HTTP range-based video streaming

Likes, comments, and watch history tracking

Modular architecture using controllers, routes, and middleware

Architecture

Authentication: JWT-based access control for protected routes

Database Layer: Knex migrations and relational tables

Media Handling: Chunked streaming using HTTP Range requests

API Design: RESTful endpoints with clear separation of concerns

Performance: Streaming prevents loading entire video files into memory

Database Tables

users

videos

likes

comments

watch_history

Each table is relationally linked to support analytics, auditing, and activity tracking. 

Key Learnings

Implemented real-world video streaming logic

Designed event-based activity tracking systems

Improved backend performance optimization skills

Built scalable APIs adaptable to other industries

Fintech Relevance

Although StreamBox is a media platform, the backend patterns translate directly to fintech use cases:

Watch history → transaction / activity logs

Video uploads → KYC document uploads

Likes & comments → user feedback or internal notes

Auth system → customer and merchant authentication
