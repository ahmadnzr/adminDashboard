class UserHistoryView {
  constructor({ id, username, role, Rooms }) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.Rooms = Rooms;
  }

  #mapRooms(rooms) {
    return rooms.map((room) => {
      return {
        room_id: room.id,
        name: room.name,
        isActive: room.isActive,
        player_type: room.UserRooms.playerType,
        is_winner: room.UserRooms.isWinner,
        score: room.UserRooms.playerPoint,
      };
    });
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      histories: this.#mapRooms(this.Rooms),
    };
  }
}

module.exports = UserHistoryView;
