# DB design
login -> 


### PLAYER  
id  
token  
nickname  
win num  
loss num  
isOwner  
state   : online, offline, searching, gaming

### FRIEND_INFO  
id  
friend_id

### CHAT_ROOM  
id  
password  
owner_id  


### ADMIN_INFO
room_id  만약 0이면 사이트의 관리자, 0이상이면 채팅방관리자  
admin_id


### CHAT_MEMBER
room_id  
member_id  
state

### CHAT_BLOCK_INFO
room_id 만약 0이면 글로벌블락, 이상이면 채팅방블락  
player_id    
target_id

### MESSAGES
room_id  
message  

.  
.  
.  

# API DESIGN
/api/login/:token
/api/logout/:token
api/:roomid/admin