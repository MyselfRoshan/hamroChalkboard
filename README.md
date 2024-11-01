## Make file help command

| Target        | Description                                        |
| ------------- | -------------------------------------------------- |
| make build    | Build Docker containers                            |
| make frontend | Start Frontend                                     |
| make stop     | Stop Docker containers                             |
| make restartf | Restart Frontend and Database                      |
| make logs     | View Docker container logs                         |
| make clean    | Remove Docker containers and volumes               |
| make dbstart  | Start Database and pgAdmin containers              |
| make api      | Run API (assuming 'air' command in backend folder) |
| make backend  | Start Database and Run API                         |

## TO DO

-   Homepage
-   Account admin / user
-   Wireframe
-   Important Tools on the side bar or circular tools at the bottom
-   Figma clone: https://www.youtube.com/watch?v=oKIThIihv60
-   Drawing App references (Next js Project): https://www.youtube.com/watch?v=ADJKbuayubE

-   [x] Make tailwind css to work

-   [ ] JWT Authentication and Authorization
    > -   [x] Token Generation
    > -   [x] Token Validation
    > -   [x] Token Refresh
    > -   [Youtube ](https://www.youtube.com/watch?v=AcYF18oGn6Y)
-   [ ] Create a room for real time socket communication to show the same drawing
    > -   [ ] [Tutorial](https://ably.com/blog/websockets-react-tutorial)
