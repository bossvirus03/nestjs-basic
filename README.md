### tạo project nest
    $ npm i -g @nestjs/cli
    $ nest new project-name
### tao cac modules
    $nest 
### template view engine 
    step 1: intall npm ejs
        npm i ejs
    step 2: config on main.ts
    https://docs.nestjs.com/techniques/mvc

### Mô hình mvc 

### Nguyên lí hoạt động của refresh token
#### (mỗi một thiết bị sẽ chỉ lưu 1 cookie) 
    * trong mỗi lần login
        + server sẽ tạo ra một refresh token sau đó lưu vào database và cookie(refresh token này có thời gian sống lâu)
        + sau đó sẽ tạo thêm 1 token nữa ghi đè lên token cũ (token này có thời gian sống thấp)
    * như vậy thì sau mỗi lần refresh lại ứng trang web thì server sẽ chỉ cần check refresh token đã lưu trong database và trên cookie => nếu trùng khớp thì sẽ tạo ra 1 access token và refresh token mới (lặp lại như bước login)

###



    
