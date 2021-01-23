const users = [];

class User {
  constructor(username, room, id) {
    this.username = username;
    this.room = room;
    this.id = id;
  }

  deleteUser = () => {
    const disconnectedUserIndex = users.findIndex((user) => {
      return user.id === this.id;
    });

    const disconnectedUsers = users.splice(disconnectedUserIndex, 1);

    const disconnectedUser = disconnectedUsers[0];

    return disconnectedUser;
  };
}

const addUser = (id, username, room) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room)
    return { error: "Username and Room must be provided!" };

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );

  if (existingUser) return { error: "Username must be unique in each room" };

  const user = new User(username, room, id);
  users.push(user);

  return { user };
};

// const getUser = (id) => {
//   const user = users.find((user) =>{
//     return user.id === id
//   } );
//   console.log(users, user)
//   return user;
// };

module.exports = {
  addUser,
};
