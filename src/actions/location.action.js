
export function storeCourts(id, name, address, photo, cb) {
    return  {
        type: "STORE_COURTS",
        id,
        name,
        address,
        photo
    };
} 