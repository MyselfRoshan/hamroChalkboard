package repository

import (
	"backend/db/models"
	"database/sql"
	"log"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type RoomRepository interface {
	GetAllRooms() ([]*models.RoomResponse, error)
	GetRoomsByCreatorID(uuid uuid.UUID) ([]*models.RoomResponse, error)
	GetRoomByID(id string) (*models.Room, error)
	GetRoomByCreatorID(uuid string) (*models.Room, error)
	CreateRoom(room *models.Room) error
	UpdateRoom(room *models.Room) error
	DeleteRoom(id string) error
}

const defaultAvatar = "https://example.com/default-avatar.png" // Replace with your default avatar URL

func (r *postgresDBRepo) GetAllRooms() ([]*models.RoomResponse, error) {
	query := `
    SELECT
        r.id AS room_id,
        r.name AS room_name,
		r.created_at AS room_created_at
        u_creator.id AS creator_id,
        u_creator.username AS creator_username,
        COALESCE(ARRAY_AGG(u_participant.id) FILTER (WHERE u_participant.id IS NOT NULL), '{}') AS participant_ids,
        COALESCE(ARRAY_AGG(u_participant.username) FILTER (WHERE u_participant.username IS NOT NULL), '{}') AS participant_usernames
    FROM
        rooms r
    JOIN
        users u_creator ON r.creator_id = u_creator.id
    LEFT JOIN
        participants p ON r.id = p.room_id
    LEFT JOIN
        users u_participant ON p.user_id = u_participant.id
    WHERE
        r.is_active = TRUE
    GROUP BY
        r.id, u_creator.id
    ORDER BY
        r.created_at DESC;
    `

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []*models.RoomResponse
	for rows.Next() {
		r := new(models.RoomResponse)
		var participantIDs pq.StringArray
		var participantUsernames pq.StringArray

		err := rows.Scan(&r.ID, &r.Name, &r.CreatedAt, &r.Creator.ID, &r.Creator.Name, &participantIDs, &participantUsernames)
		if err != nil {
			return nil, err
		}

		// Set default avatar for the creator
		r.Creator.Avatar = defaultAvatar

		// Populate participants
		for i := range participantIDs {
			participant := models.ParticipantResponse{
				ID:     uuid.MustParse(participantIDs[i]), // Convert string to UUID
				Name:   participantUsernames[i],
				Avatar: defaultAvatar, // Use default avatar for all participants
			}
			r.Participants = append(r.Participants, participant)
		}

		rooms = append(rooms, r)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return rooms, nil
}

// func (r *postgresDBRepo) GetRoomsByCreatorID(creatorID uuid.UUID) ([]*models.RoomResponse, error) {
// 	query := `
//     SELECT
//         r.id AS room_id,
//         r.name AS room_name,
//         u_creator.id AS creator_id,
//         u_creator.username AS creator_username,
//         COALESCE(ARRAY_AGG(u_participant.id) FILTER (WHERE u_participant.id IS NOT NULL), '{}') AS participant_ids,
//         COALESCE(ARRAY_AGG(u_participant.username) FILTER (WHERE u_participant.username IS NOT NULL), '{}') AS participant_usernames
//     FROM
//         rooms r
//     JOIN
//         users u_creator ON r.creator_id = u_creator.id
//     LEFT JOIN
//         participants p ON r.id = p.room_id
//     LEFT JOIN
//         users u_participant ON p.user_id = u_participant.id
//     WHERE
//         r.is_active = TRUE AND r.creator_id = $1
//     GROUP BY
//         r.id, u_creator.id
//     ORDER BY
//         r.created_at DESC;
//     `

// 	rows, err := r.DB.Query(query, creatorID)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var rooms []*models.RoomResponse
// 	for rows.Next() {
// 		r := new(models.RoomResponse)
// 		var participantIDs pq.StringArray
// 		var participantUsernames pq.StringArray

// 		err := rows.Scan(&r.ID, &r.Name, &r.Creator.ID, &r.Creator.Name, &participantIDs, &participantUsernames)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// Set default avatar for the creator
// 		r.Creator.Avatar = defaultAvatar

// 		// Populate participants
// 		for i := range participantIDs {
// 			participant := models.ParticipantResponse{
// 				ID:     uuid.MustParse(participantIDs[i]), // Convert string to UUID
// 				Name:   participantUsernames[i],
// 				Avatar: defaultAvatar, // Use default avatar for all participants
// 			}
// 			r.Participants = append(r.Participants, participant)
// 		}

// 		rooms = append(rooms, r)
// 	}

// 	if err := rows.Err(); err != nil {
// 		return nil, err
// 	}
// 	return rooms, nil
// }

func (r *postgresDBRepo) GetRoomsByCreatorID(creatorID uuid.UUID) ([]*models.RoomResponse, error) {
	query := `
    SELECT
        r.id AS room_id,
        r.name AS room_name,
		r.created_at AS room_created_at,
        u_creator.id AS creator_id,
        u_creator.username AS creator_username,
        COALESCE(ARRAY_AGG(u_participant.id) FILTER (WHERE u_participant.id IS NOT NULL), '{}') AS participant_ids,
        COALESCE(ARRAY_AGG(u_participant.username) FILTER (WHERE u_participant.username IS NOT NULL), '{}') AS participant_usernames
    FROM
        rooms r
    JOIN
        users u_creator ON r.creator_id = u_creator.id
    LEFT JOIN
        participants p ON r.id = p.room_id
    LEFT JOIN
        users u_participant ON p.user_id = u_participant.id
    WHERE
        r.is_active = TRUE AND r.creator_id = $1
    GROUP BY
        r.id, u_creator.id
    ORDER BY
        r.created_at DESC;
    `

	rows, err := r.DB.Query(query, creatorID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []*models.RoomResponse
	for rows.Next() {
		r := new(models.RoomResponse)
		var participantIDs pq.StringArray
		var participantUsernames pq.StringArray
		err := rows.Scan(&r.ID, &r.Name, &r.CreatedAt, &r.Creator.ID, &r.Creator.Name, &participantIDs, &participantUsernames)
		if err != nil {
			return nil, err
		}
		// Set default avatar for the creator
		r.Creator.Avatar = defaultAvatar

		// Populate participants
		for i := range participantIDs {
			participant := models.ParticipantResponse{
				ID:     uuid.MustParse(participantIDs[i]), // Convert string to UUID
				Name:   participantUsernames[i],
				Avatar: defaultAvatar, // Use default avatar for all participants
			}
			r.Participants = append(r.Participants, participant)
		}

		rooms = append(rooms, r)
	}

	if err := rows.Err(); err != nil {
		return nil, err
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
	idTmp, err := uuid.Parse(id)
	if err != nil {
		log.Println("Error parsing room ID:", err)
		return err
	}
	query := `DELETE FROM rooms WHERE id=$1`
	_, err = r.DB.Exec(query, idTmp)
	if err != nil {
		log.Println("Error deleting room:", err)
	}
	return err
}
