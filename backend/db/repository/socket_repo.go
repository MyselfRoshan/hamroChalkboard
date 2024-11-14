package repository

// import (
// 	"backend/db/models"
// 	"database/sql"
// 	"log"

// 	"github.com/google/uuid"
// )

// type SocketRepository interface {
// 	GetSocketByID(id uuid.UUID) (*models.Socket, error)
// 	GetAllSockets() ([]*models.Socket, error)
// }

// func (r *postgresDBRepo) GetSocketByID(id uuid.UUID) (*models.Socket, error) {
// 	query := `SELECT id, user_id, username, avatar, room_id
// 			  FROM sockets WHERE id=$1`
// 	socket := &models.Socket{}
// 	err := r.DB.QueryRow(query, id).Scan(&socket.UserID, &socket.UserID, &socket.Username, &socket.Avatar, &socket.RoomID)
// 	if err == sql.ErrNoRows {
// 		return nil, nil
// 	} else if err != nil {
// 		log.Println("Error fetching socket by ID:", err)
// 		return nil, err
// 	}
// 	return socket, nil
// }

// func (r *postgresDBRepo) GetAllSockets() ([]*models.Socket, error) {
// 	query := `SELECT id, user_id, username, avatar, room_id
// 			  FROM sockets`
// 	rows, err := r.DB.Query(query)
// 	if err != nil {
// 		log.Println("Error fetching all sockets:", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var sockets []*models.Socket
// 	for rows.Next() {
// 		socket := &models.Socket{}
// 		if err := rows.Scan(&socket.UserID, &socket.UserID, &socket.Username, &socket.Avatar, &socket.RoomID); err != nil {
// 			log.Println("Error scanning socket:", err)
// 			return nil, err
// 		}
// 		sockets = append(sockets, socket)
// 	}
// 	return sockets, nil
// }
