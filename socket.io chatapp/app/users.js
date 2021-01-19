const users = [];

const addUser = (id, username, room) => {
  username = username.trim().toLowerCase();
  room  = room.trim().toLowerCase();

  if (!username || !room)
    return { error: "Username and Room must be provided!" };

  const user = users.find(
    (user) => user.username === username && user.room === room
  );

  if (user) return { error: "Username must be unique in each room" };

  const newUser = { id, username, room };
  users.push(newUser);

  return newUser;
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);

  return user;
};

module.exports = {
    addUser,
    getUser
}
