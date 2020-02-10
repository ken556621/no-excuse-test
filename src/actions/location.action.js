
export function storeCourts(id, name, address, photo, rooms, cb) {
    return  {
        type: "STORE_COURTS",
        id,
        name,
        address,
        photo,
        rooms
    };
} 
