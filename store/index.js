export const state = () => ({
    userName: '',
    rooms:[],
    currentRoom: ''
})

export const mutations = {
    setUserName(state, text) {
        state.userName = text;
    },
    addRooms(state, room) {
        state.rooms.push(room);
    },
    setCurrentRoom(state, room) {
        state.currentRoom = room;
    }
}