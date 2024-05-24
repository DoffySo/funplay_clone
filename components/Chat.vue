<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import * as timeago from 'timeago.js';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  chat: {
    type: Object,
    required: true,
  }
});

const { user, chat } = props;
const usersData = ref({});
const socket = ref(null);
const chatMessages = ref([]);
const userchat = ref()
const chatMessage = ref('');

const fetchUserData = async (uid) => {
  try {
    const response = await fetch(`/api/users/id/${uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    usersData.value[uid] = userData[0];
  } catch (error) {
    console.error(`Failed to fetch data for user ${uid}:`, error);
  }
};

const fetchAllUsersData = async () => {
  if (chat && chat.users) {
    await Promise.all(chat.users.map(uid => fetchUserData(uid)));
  }
};

const fetchChat = async () => {
  try {
    const userStore = useUserStore();
    if (!userStore || !userStore.user || !userStore.user.uid) {
      throw new Error('User information is not available');
    }
    
    const response = await fetch(`/api/chats/find?uid=${userStore.user.uid}&ruid=${user.uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat data');
    }
    const chatData = await response.json();
    chatMessages.value = chatData.messages;
    userchat.value = chatData

    await fetchAllUsersData(); // Fetch user data after fetching chat data
  } catch (error) {
    console.error('Failed to fetch chat:', error);
  }
};

const updateChatMessages = (newMessage) => {
  chatMessages.value.push(newMessage);
};

const sendMessage = async (message) => {
  try {

    // const t = [usersData._value];
    // const receiver = userchat._value.users.find(x => x != useUserStore().user.uid)

    const result = await $fetch("/api/chats/new/message", {
        method: "post",
        body: {
            chatid: userchat.value.chatid,
            senderuid: useUserStore().user.uid,
            message: chatMessage.value
        }
    })

    console.log(result);
    chatMessage.value = ""

    await fetchChat();
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

onMounted(async () => {
  await fetchChat();
  socket.value = io('http://localhost:3001', {
    auth: {
        id: useUserStore().user.uid
    }
  });

  socket.value.on('newMessage', updateChatMessages);

  socket.value.on('connect', () => {
    console.log('Connected to server!');
  });

  socket.value.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

const groupedMessages = computed(() => {
  const grouped = [];
  let lastMessageDate = null;
  let lastMessage = null;

  chatMessages.value.forEach(message => {
    const messageDate = new Date(message.date);
    const formattedDate = messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Проверяем, если дата текущего сообщения отличается от предыдущего
    if (lastMessageDate !== formattedDate) {
      // Добавляем новый объект в массив grouped для новой даты
      grouped.push({ date: formattedDate, messages: [] });
      lastMessageDate = formattedDate; // Обновляем lastMessageDate
      lastMessage = null; // Сбрасываем lastMessage, чтобы не объединять с предыдущим отправителем
    }

    // Проверяем, если последнее сообщение было отправлено тем же отправителем
    if (lastMessage && lastMessage.senderuid === message.senderuid) {
      lastMessage.messages.push(message); // Добавляем сообщение к предыдущему отправителю
    } else {
      // Создаем новый объект сообщения для нового отправителя
      lastMessage = {
        senderuid: message.senderuid,
        username: usersData.value[message.senderuid]?.username || 'Unknown',
        messages: [message],
      };
      // Добавляем его к grouped
      grouped.push(lastMessage);
    }
  });

  console.log(grouped);

  return grouped;
});


</script>


<template>
  <div class="chat">
    <div class="chat-container">
      <BListGroup style="height: 500px;">
        <BListGroupItem>
          <div class="media d-flex">
            <div class="media-left">
              <NuxtLink :to="'/users/' + user.uid" class="avatar">
                <img style="width: 50px; height: 50px;" class="avatar-photo rounded-circle" :src="'/avatars/' + user.avatarName" />
              </NuxtLink>
            </div>
            <div class="media-body ms-2 d-flex flex-column justify-content-between">
              <div class="media-user-name">
                <NuxtLink class="link-dark chat-username" :to="'/users/' + user.uid">
                  {{ user.username }}
                </NuxtLink>
              </div>
              <div class="media-user-info">
                <span class="fs-6 text-secondary fw-normal" style="font-family: sans-serif!important; font-size: 14px!important;">Was 0 minutes ago</span>
              </div>
            </div>
          </div>
        </BListGroupItem>
        <BListGroupItem style="height: 90%; overflow-y: auto;">
          <div class="chat-messages d-flex flex-column">
            <div v-for="(group, index) in groupedMessages" :key="index" class="message container-fluid mb-2">
              <template v-if="group.messages.length > 0">
                <div class="message-header d-flex justify-content-between align-items-center">
                  <div class="message-user-name d-flex align-items-center gap-2" v-if="group.senderuid == -1">
                    FunPay <BBadge variant="primary" style="font-family: 'Helvetica Neue', helvetica, sans-serif!important; font-weight: 500!important; font-size: 12px; letter-spacing: .2px;">notification</BBadge>
                  </div>
                  <div class="message-user-name" v-else>
                    {{ group.username }}
                  </div>
                  <div class="message-time fw-normal display-6 fs-6 text-secondary" style="font-family: sans-serif!important; font-size: 13px!important;">
                    {{ timeago.format(group.messages[0].date) }}
                  </div>
                </div>
                <div class="message-body mt-1" v-if="group.senderuid == -1">
                  <p v-for="(msg, idx) in group.messages" :key="idx" class="mt-1 bg-light px-2 py-4 d-flex align-items-center gap-3 text-wrap" style="font-family: sans-serif!important; font-size: 16px!important;">
                    <svg class="text-primary" mlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                      <path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-10 5.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75M12 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" clip-rule="evenodd" />
                    </svg>

                    <span style="font-family: sans-serif!important; font-weight: 300!important; font-size: 15px;" v-html="msg.message"></span>
                  </p>
                </div>
                <div class="message-body mt-1" v-else>
                  <p v-for="(msg, idx) in group.messages" :key="idx" class="mt-1" style="font-family: sans-serif!important; font-size: 16px!important;">
                    {{ msg.message }}
                  </p>
                </div>
              </template>
              <template v-else>
                <h1 class="text-center mt-2 mb-2 text-secondary fw-normal" style="font-family: sans-serif!important; font-size: 14px;">{{ group.date }}</h1>
              </template>
            </div>
          </div>
        </BListGroupItem>
        <BListGroupItem class="chat-form container-fluid">
          <BForm @submit="sendMessage()" class="d-flex align-items-center justify-content-between">
            <div class="chat-form-input">
              <BFormGroup>
                <BFormTextarea
                  id="textarea"
                  v-model="chatMessage"
                  placeholder="Message..."
                  rows="1"
                  cols="30"
                  no-resize
                  class="border-0 fw-normal"
                  style="box-shadow: none; outline: none; font-family: sans-serif!important;"
                />
              </BFormGroup>
            </div>
            <div class="chat-form-attach d-none">
              <div class="btn btn-default">
                <svg class="text-secondary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0c43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998c-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292c4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798c-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313c34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 
                  60.216-214.77-.485" />
                   </svg>
                 </div>
               </div>
               <div class="chat-form-btn">
                 <BButton type="submit" variant="light">
                   <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                     <path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z" />
                   </svg>
                 </BButton>
               </div>
             </BForm>
           </BListGroupItem>
         </BListGroup>
       </div>
     </div>
   </template>


<style lang="scss" scoped>
</style>