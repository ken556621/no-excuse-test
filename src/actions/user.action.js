

export function updateUser(uid, name, email, photo, friends, cb) {
    return  {
        type: "UPDATE_USER",
        uid,
        name,
        email,
        photo,
        friends: friends || []
    };
}