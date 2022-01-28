<template>
  <div class="h-screen">
    <div class="bg-gray-900" style="height: 6%"></div>
    <div class="bg-gray-500 flex" style="height: 88%">
      <div class="bg-gray-500 w-2/6 h-full overflow-auto">
        <div>
          <input type="text" v-model="newMember" class="type-name" />
          <button @click="addMember" :disabled="newMember===''" class="send-msg">Add</button>
        </div>
         <div v-for="member in members" :key="member._id" style="margin-left:1vw;">
          <p style="color:white;">{{member.name}}</p>
        </div>
      </div>
      <div class="bg-gray-400 w-4/6 h-full overflow-auto">
        <div v-for="item of msgs" :key="item._id">
          <div
            v-if="item.sender !== $store.state.userName && item.sender !== 'NA'"
            class="bg-yellow-100 h-auto rounded-md left-msg"
          >
            {{ item.sender }}->{{ item.text }}
          </div>
          <div
            v-if="item.sender === 'NA'"
            class="bg-green-50 h-auto rounded-md all-msg"
          >
            {{ item.text }}
          </div>
          <div v-if="item.sender === $store.state.userName" class="bg-green-100 h-auto rounded-md right-msg">
            {{ item.sender }}->{{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-900" style="height: 6%">
      <input type="text" v-model="msg" class="type-msg" />
      <button @click="sendMessage($store.state.userName)" :disabled="msg===''" class="send-msg">SEND</button>
    </div>
  </div>
</template>

<script>
import openSocket from "socket.io-client";
export default {
  beforeMount() {
    this.getRoomDetails();
    const socket = openSocket("http://localhost:8080/");
    socket.on("connection", data => {
      this.msgs.push(data);
    })
    socket.on("addMember", data => {
      this.members.push(data);
    })
  },
  data() {
    return {
      msg: "",
      msgs: [],
      members: [],
      roomDetails: {},
      newMember: '',
    };
  },
  computed: {},
  methods: {
    async sendMessage(sentBy) {
      const payload = {
        text: this.msg,
        time: new Date(),
        sender: sentBy,
      };
      this.msg = "";
      const res = await fetch(
        `http://localhost:8080/api/message/${this.$store.state.currentRoom}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
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
        console.log(data);
      }
    },
    async getRoomDetails() {
      const res = await fetch(
        `http://localhost:8080/api/room/${this.$store.state.currentRoom}`
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
        console.log(this.$store.state.currentRoom);
        const data = await res.json();
        this.roomDetails = data[0];
        this.msgs = this.roomDetails.messages;
        this.members= this.roomDetails.members;
        console.log(this.members);
      }
    },
    async addMember() {
      const res = await fetch(
        `http://localhost:8080/api/addUser/${this.newMember}/${this.$store.state.currentRoom}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
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
        console.log(data);
      }
      this.msg=this.newMember+' was added by '+this.$store.state.userName;
      this.sendMessage('NA');
      this.newMember='';
      this.msg='';
    },
  },
};
</script>

<style>
.left-msg {
  padding: 0 1% 0 5%;
  margin: 2% 45% 2% 1%;
}
.right-msg {
  padding: 0 5% 0 1%;
  margin: 2% 1% 2% 45%;
}
.all-msg {
  padding: 0 5% 0 1%;
  margin: 2% 1% 2% 1%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.type-msg {
  height: 70%;
  width: 57%;
  margin: 1vh 5px 0 34%;
  padding: 0 5px 0 5px;
}
.type-name {
  height: 70%;
  width: 80%;
  margin: 1vh 5px 0 1vw;
  padding: 0 5px 0 5px;
}
.send-msg {
  width: 6%;
  color:white;
}
</style>