## channel

### login  
get login/:42id ({id:string | ""})  
토큰-쿠키  


### 게임하다 나갔다가 다시 로그인하면 lobby 말고 바로 게임화면으로  

### Lobby    
get Lobby/chatList ({id:string, num:number, owner_id:string, isPWD:boolean})  
get Lobby/gameList ({p1:string, p2:string, mode:string})  
get Lobby/:id/myChatList ({{id:string, num:number})  
get Lobby/:id/userList ({id:string, icon:string, state:string, isFriend:boolean})    

//입장하기  
post Lobby/enter/:chatroomid    
    return type : "connect" | "fail" //비밀번호 틀렸을때  

delete Lobby/:chatID  withcredentials: true  토큰  

//방 만들기  
post Lobby/chatCreate/:chatRoomID  
    body ({pwd:string})  

//게임방만들기  
post Lobby/gameCreate/

### admin    
post admin/:42id  
body: icon, id    


### profile  
get profile/:id  withcredentials: true  
    return ({win:num, lose:num, friend:boolean, block:boolean} | {win, lose})    
get profile/:id/match ({id:sting, result:boolean})  
get profile/:id/friend   withcredentials: true
get profile/:id/block  withcredentials: true

매치메이킹 중이면 state = matching(db에서만 표시)  
//dm, 퐁 게임 버튼 추가  


### chat  
get chat/chatLog ({id, timeStamp, content})  


### chat/setting(owner만)  
get chat/:chatRoomID/setting (pwd:string)  
post chat/:chatRoomID/setting  
    body(pwd:string)  
    return ({success:boolean})  


### chat/:id  
get chat/:chatroomid/user/:id withcredentials: true  
    return ({id:string, mute:boolean, ban:boolean, privilage:string})  
    
//kick:시간x ban:3일 mute:3일      
(owner + administrator)  
get chat/:chatroomid/mute/:id  withcredentials: true  
    return ({success:boolean})  
get chat/:chatroomid/ban/:id  withcredentials: true  
    return ({success:boolean})   
get chat/:chatroomid/kick/:id  withcredentials: true   
    return ({success:boolean})  

(owner)  
get chat/:chatroomid/admin/:id  withcredentials: true  
    return ({success:boolean})  



### game  


server->client  
on.start (update + state) state = {left, right}  
on.finish (score 3:2)  
on.update (p1_pos, p1_dir, p2_pos, p2_dir, ball_pos, ball_dir, p1_score, p2_score, ball_speed)  

client->server  
on.up(true | false)  
on.down(true | fase)  