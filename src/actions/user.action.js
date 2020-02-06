

export function updateUser(name, email, photo, friends, cb) {
    return  {
        type: "UPDATE_USER",
        name,
        email,
        photo,
        friends: friends || []
    };
}