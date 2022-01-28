<template>
  <div class="h-screen bg-gray-500">
    <div class="bg-gray-300 w-2/6 container">
      <p class="text-2xl m-6 ml-24 pt-8 mt-0">Fill details to proceed</p>
      <form>
        <div class="mt-3 ml-10">
          <label class="m-8 mr-11" for="name">Username</label>
          <input
            class="p-1 w-48"
            type="text"
            name="name"
            id="name"
            placeholder="username"
            v-model="userName"
            :disabled="submitted"
          />
        </div>
        <div class="mt-4 ml-8">
          <button
            @click="checkUser"
            type="button"
            class="bg-gray-200 w-32 p-2 ml-28 mb-6"
            :disabled="submitted"
          >
            Sumbit
          </button>
        </div>
        <div>
          <p class="ml-40 pt-2" v-if="submitted">Select OR Create</p>
        </div>
        <div class="mt-3 ml-10" v-if="submitted">
          <label class="m-8" for="chatname">Create a Room</label>
          <input
            class="p-1 w-48"
            type="text"
            name="chatname"
            id="chatname"
            placeholder="name"
            :disabled="selectedRoom !== 'NA'"
            v-model="newRoom"
          />
        </div>
        <div class="mt-3 ml-10" v-if="submitted">
          <label class="m-8 mr-9" for="chatroomCreate">Select a Room</label>
          <select
            class="p-1 w-48"
            name="charroom"
            id="chatroomCreate"
            v-model="selectedRoom"
            :disabled="newRoom !== ''"
          >
            <option selected>NA</option>
            <option v-for="room in rooms" :key="room">{{ room }}</option>
          </select>
        </div>
        <div class="mt-5" v-if="submitted">
          <button @click="goToChat" type="button" class="bg-gray-200 w-32 p-2 ml-36 mb-8">
            Start
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      userName: "",
      submitted: false,
      rooms: [],
      selectedRoom: "NA",
      newRoom: "",
    };
  },
  methods: {
    async checkUser() {
      this.submitted = true;
      this.$store.commit("setUserName",this.userName);
      const res = await fetch(
        `http://localhost:8080/api/user/${this.userName}`
      );
      if (!res.ok) {
        console.log("error: ");
        const error = await res.json();
        console.log(error);
        throw new Error(
          "Error in submitting data, error code: " +
            error.message +
            ", " +
            res.status
        );
      } else {
        console.log("success: ");
        const data = await res.json();
        for (let i = 0; i < data.length; i++) {
          this.rooms.push(data[i].name);
          this.$store.commit("addRooms",data[i]);
        }
      }
    },
    async goToChat() {
      let url = "";
      let res = "";
      if (this.newRoom !== "") {
        url = `http://localhost:8080/api/createRoom/`;
        this.$store.commit("setCurrentRoom",this.newRoom);
        res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            profilePic: "NA",
            name: this.newRoom,
            noOfMembers: 1,
            private: true,
            members: [
              {
                name: this.userName,
              },
            ],
            messages: [],
          }),
        });
      } else if (this.selectedRoom !== "NA") {
        url = `http://localhost:8080/api/room/${this.selectedRoom}`;
        this.$store.commit("setCurrentRoom",this.selectedRoom);
        res = await fetch(url);
      }
      if (!res.ok) {
        console.log("error: ");
        const error = await res.json();
        console.log(error);
        throw new Error(
          "Error in submitting data, error code: " +
            error.message +
            ", " +
            res.status
        );
      } else {
        console.log("success: ");
        const data = await res.json();
        console.log(data);
      }
      this.$router.push("/room");
    },
  },
};
</script>

<style>
.container {
  position: fixed;
  top: 22%;
  left: 32%;
  height: auto;
}
input,
select {
  padding: 2px 5px;
  margin: 2px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>