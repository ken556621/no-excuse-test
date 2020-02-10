export function storeGroups(name, people, time, intensity, cb) {
    return  {
        type: "STORE_GROUPS",
        name,
        people,
        time,
        intensity
    };
} 