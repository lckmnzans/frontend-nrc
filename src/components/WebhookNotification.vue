<template>
    <div>
        <h2>Webhook notifications (Socket.io)</h2>
        <input v-model="userId" placeholder="Enter User ID" />
        <button @click="registerUser">Register</button>

        <ul>
            <li v-for="(notification, index) in notifications" :key="index">
                <div class="alert" :class="index == 0 ? 'alert-primary' : 'alert-secondary'" >{{ notification.message }} - {{ notification.payload }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
    data() {
        return {
            userId: "",
            socket: null,
            notifications: [],
        };
    },
    methods: {
        registerUser() {
            const url = window.location.origin;

            if (this.userId) {
                this.socket = io(url, {
                    transports:["websocket"]
                });
                
                this.socket.emit("register", this.userId);
                console.log(`Registered as ${this.userId}`);

                this.socket.on("webhook_event", (data) => {
                    this.notifications.push(data);
                });
            }
        },
    }
}
</script>