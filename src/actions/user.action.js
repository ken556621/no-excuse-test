

export function updateUser(uid, name, email, photo, cb) {
    return  {
        type: "UPDATE_USER",
        uid,
        name,
        email,
        photo
    };
}