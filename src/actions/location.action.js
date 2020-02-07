
export function storeCourts(id, name, placeLat, placeLng, cb) {
    return  {
        type: "STORE_COURTS",
        id,
        name,
        placeLat,
        placeLng
    };
}