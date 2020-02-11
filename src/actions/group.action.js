export function storeGroups(hoster, name, people, time, intensity, cb) {
    return  {
        type: "STORE_GROUPS",
        hoster,
        name,
        people,
        time, 
        intensity
    };
} 