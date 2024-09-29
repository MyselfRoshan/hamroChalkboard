package repository

import (
	"backend/db/models"
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
)

type RoomRepository interface {
	GetAllRooms() ([]*models.RoomResponse, error)
	GetRoomByID(id string) (*models.Room, error)
	GetRoomByCreatorID(uuid string) (*models.Room, error)
	CreateRoom(room *models.Room) error
	UpdateRoom(room *models.Room) error
	DeleteRoom(id string) error
}

// func (r *postgresDBRepo) GetAllRooms() ([]*models.Room, error) {
// 	query := ` SELECT r.id, r.name, r.creator_id, r.is_active, r.created_at, r.updated_at,
//                p.id AS participant_id, p.user_id AS participant_user_id, p.joined_at, p.left_at
//         	   FROM rooms r
//         	   LEFT JOIN participants p ON r.id = p.room_id
//         	   WHERE r.is_active = TRUE`
// 	rows, err := r.DB.Query(query)
// 	if err != nil {
// 		log.Println("Error fetching all rooms:", err)
// 		return nil, err
// 	}
// 	defer rows.Close()
// 	rooms := []*models.Room{}
// 	roomMap := make(map[uuid.UUID]*models.Room)

// 	for rows.Next() {
// 		var room models.Room
// 		var participant models.Participant

// 		err := rows.Scan(
// 			&room.ID,
// 			&room.Name,
// 			&room.CreatorID,
// 			&room.IsActive,
// 			&room.CreatedAt,
// 			&room.UpdatedAt,
// 			&participant.ID,
// 			&participant.UserID,
// 			&participant.JoinedAt,
// 			&participant.LeftAt,
// 		)
// 		if err != nil {
// 			log.Println("Error scanning room:", err)
// 			return nil, err
// 		}

// 		// Add participant to the room
// 		if existingRoom, ok := roomMap[room.ID]; ok {
// 			existingRoom.Participants = append(existingRoom.Participants, participant)
// 		} else {
// 			room.Participants = append(room.Participants, participant)
// 			roomMap[room.ID] = &room
// 		}
// 	}

// 	for _, room := range roomMap {
// 		rooms = append(rooms, room)
// 	}

//		return rooms, nil
//	}

/*
New
*/
// func (r *postgresDBRepo) GetAllRooms() ([]*models.RoomResponse, error) {
// 	rows, err := r.DB.Query(`
//         SELECT r.id, r.name, r.creator_id, u.username, r.is_active, r.created_at,
//                p.id AS participant_id, p.user_id AS participant_user_id, pu.username AS participant_username
//         FROM rooms r
//         LEFT JOIN users u ON r.creator_id = u.id
//         LEFT JOIN participants p ON r.id = p.room_id
//         LEFT JOIN users pu ON p.user_id = pu.id
//         WHERE r.is_active = TRUE
//     `)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	roomMap := make(map[uuid.UUID]*models.RoomResponse)

// 	for rows.Next() {
// 		var roomID uuid.UUID
// 		var roomName string
// 		var creatorID uuid.UUID
// 		var creatorUsername string
// 		var createdAt time.Time
// 		var participantID uuid.UUID
// 		var participantUsername string

// 		err := rows.Scan(
// 			&roomID,
// 			&roomName,
// 			&creatorID,
// 			&creatorUsername,
// 			&createdAt,
// 			&participantID,
// 			&participantUsername,
// 		)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// Create or update room in the map
// 		if roomResp, ok := roomMap[roomID]; ok {
// 			roomResp.Participants = append(roomResp.Participants, models.ParticipantResponse{
// 				ID:     participantID,
// 				Name:   participantUsername,
// 				Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
// 			})
// 		} else {
// 			roomResp := &models.RoomResponse{
// 				ID:        roomID,
// 				Name:      roomName,
// 				CreatedAt: createdAt,
// 				Creator: models.CreatorResponse{
// 					ID:     creatorID,
// 					Name:   creatorUsername,
// 					Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
// 				},
// 				Participants: []models.ParticipantResponse{
// 					{
// 						ID:     participantID,
// 						Name:   participantUsername,
// 						Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
// 					},
// 				},
// 			}
// 			roomMap[roomID] = roomResp
// 		}
// 	}

// 	// Convert the map to a slice
// 	var rooms []*models.RoomResponse
// 	for _, roomResp := range roomMap {
// 		rooms = append(rooms, roomResp)
// 	}

// 	return rooms, nil
// }

func (r *postgresDBRepo) GetAllRooms() ([]*models.RoomResponse, error) {
	rows, err := r.DB.Query(`
        SELECT r.id, r.name, r.creator_id, u.username, r.created_at,
               p.id AS participant_id, pu.username AS participant_username
        FROM rooms r
        LEFT JOIN users u ON r.creator_id = u.id
        LEFT JOIN participants p ON r.id = p.room_id
        LEFT JOIN users pu ON p.user_id = pu.id
        WHERE r.is_active = TRUE
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	roomMap := make(map[uuid.UUID]*models.RoomResponse)

	for rows.Next() {
		var roomID uuid.UUID
		var roomName string
		var creatorID uuid.UUID
		var creatorUsername string
		var createdAt time.Time
		var participantID uuid.UUID
		var participantUsername string

		err := rows.Scan(
			&roomID,
			&roomName,
			&creatorID,
			&creatorUsername,
			&createdAt,
			&participantID,
			&participantUsername,
		)
		if err != nil {
			return nil, err
		}

		// Create or update room in the map
		// 6a81bf2e-85c2-4e35-a696-15447895093a
		if roomResp, ok := roomMap[roomID]; ok {
			roomResp.Participants = append(roomResp.Participants, models.ParticipantResponse{
				ID:     participantID,
				Name:   participantUsername,
				Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
			})
		} else {
			roomResp := &models.RoomResponse{
				ID:        roomID,
				Name:      roomName,
				CreatedAt: createdAt,
				Creator: models.CreatorResponse{
					ID:     creatorID,
					Name:   creatorUsername,
					Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
				},
				Participants: []models.ParticipantResponse{
					{
						ID:     participantID,
						Name:   participantUsername,
						Avatar: "/placeholder.svg?height=32&width=32", // Placeholder
					},
				},
			}
			roomMap[roomID] = roomResp
		}
	}

	// Convert the map to a slice
	var rooms []*models.RoomResponse
	for _, roomResp := range roomMap {
		rooms = append(rooms, roomResp)
	}

	return rooms, nil
}

func (r *postgresDBRepo) GetRoomByID(id string) (*models.Room, error) {
	query := `SELECT id, name, is_active, creator_id, created_at, updated_at
			  FROM rooms WHERE id=$1`
	room := &models.Room{}
	err := r.DB.QueryRow(query, id).Scan(&room.ID, &room.Name, &room.IsActive, &room.CreatorID, &room.CreatedAt, &room.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil

	} else if err != nil {
		log.Println("Error fetching room by ID:", err)
		return nil, err
	}
	return room, nil
}
func (r *postgresDBRepo) GetRoomByCreatorID(uuid string) (*models.Room, error) {
	query := `SELECT id, name, is_active, creator_id, created_at, updated_at
			  FROM rooms WHERE creator_id=$1`
	room := &models.Room{}
	err := r.DB.QueryRow(query, uuid).Scan(&room.ID, &room.Name, &room.IsActive, &room.CreatorID, &room.CreatedAt, &room.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		log.Println("Error fetching room by creator ID:", err)
		return nil, err
	}
	return room, nil
}
func (r *postgresDBRepo) CreateRoom(room *models.Room) error {
	query := `INSERT INTO rooms (name, is_active, creator_id, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5)`

	_, err := r.DB.Exec(query, room.Name, room.IsActive, room.CreatorID, room.CreatedAt, room.UpdatedAt)
	if err != nil {
		log.Println("Error creating room:", err)
	}
	return err
}
func (r *postgresDBRepo) UpdateRoom(room *models.Room) error {
	query := `UPDATE rooms SET name=$1, is_active=$2, updated_at=$3 WHERE id=$4`

	_, err := r.DB.Exec(query, room.Name, room.IsActive, room.UpdatedAt, room.ID)
	if err != nil {
		log.Println("Error updating room:", err)
	}
	return err
}
func (r *postgresDBRepo) DeleteRoom(id string) error {
	query := `DELETE FROM rooms WHERE id=$1`

	_, err := r.DB.Exec(query, id)
	if err != nil {
		log.Println("Error deleting room:", err)
	}
	return err
}
