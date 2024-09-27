CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- Foreign key to rooms
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMPTZ
);

CREATE TABLE drawings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- Foreign key to rooms
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    data JSONB NOT NULL, -- Storing drawing data in JSON format
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- Foreign key to rooms
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to sender (user)
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to recipient (user)
    status SMALLINT DEFAULT 0, -- 0: Pending, 1: Accepted, 2: Rejected
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- Foreign key to rooms
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- Foreign key to rooms
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    event_type VARCHAR(255) NOT NULL, -- e.g., "draw", "erase", "undo"
    event_data JSONB NOT NULL, -- Store specific event data, like coordinates, color, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
