# CHALLENGE 06

## DATABASAE SCHEMA

- [download](./file-pendukung/1-digram.png)<br>
  ![diagram](./file-pendukung/1-digram.png) <br>

- [download databasae](./file-pendukung/2-challenge_ch06_development.sql)<br>

  ```sql
  ....
  CREATE TABLE public."Biodatas" (
      id integer NOT NULL,
      fullname character varying(255),
      email character varying(255),
      age integer,
      gender character varying(255),
      "imgUrl" character varying(255),
      "createdAt" timestamp with time zone NOT NULL,
      "updatedAt" timestamp with time zone NOT NULL
  );
  ....
  ```

## ADMIN DASHBOARD

| no  | url                                  | body                                                 | ket                                                                                     |
| --- | ------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | http://localhost:8080/user/login     | `{username,password}`                                | username: **admin** <br> password: **admin**                                            |
| 2   | http://localhost:8080/dashboard      | `-`                                                  | login required !, total users, total game played                                        |
| 3   | http://localhost:8080/users/view     | `-`                                                  | list of users                                                                           |
| 4   | http://localhost:8080/users/create   | `username,password,fullname,email,imgUrl,age,gender` | `username, password` are required!                                                      |
| 5   | http://localhost:8080/users/view/:id | `id`                                                 | `id` or userId is required!, <br> edit button, delete user, delete biodata user is here |
| 6   | http://localhost:8080/users/edit/:id | `id`                                                 | `id` or userId is required!                                                             |

<br>

!['dashboard'](.assets/dashboard.png)

## REST CLIENT

- Postman Collection: [download](./file-pendukung/challenge-ch06.postman_collection.json)

- Postman Env: [download](./file-pendukung/ch-06-env.postman_environment.json)
