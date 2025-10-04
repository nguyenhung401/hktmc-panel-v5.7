hktmc Panel Manager v5.7 Final Cloud Edition

# 🧩 hktmc Panel Manager v5.7 – Final Cloud Edition

> Phiên bản hoàn chỉnh của hệ thống quản lý Minecraft Server bằng web (NodeJS + React).  
> Tích hợp Auto Restart, Auto Backup, Restore, Plugin Manager, Player Manager, File Manager, và nhiều tính năng cao cấp khác.

---

## 🚀 Giới thiệu

**hktmc Panel Manager** là một web panel điều khiển Minecraft Server trực tiếp từ trình duyệt.  
Chạy được trên **Windows**, **Linux VPS**, hoặc **Replit**, chỉ cần có NodeJS ≥ 18.

Phiên bản **v5.7 Final Cloud Edition** bao gồm:
- ✅ Start / Stop / Restart / Kill server  
- ✅ Auto-Restart khi server crash  
- ✅ Auto-Backup mỗi 1h (giữ 5 bản gần nhất)  
- ✅ Manual Backup (bấm tạo thủ công)  
- ✅ Restore Backup (upload file .zip khôi phục thế giới)  
- ✅ Download Backup trực tiếp  
- ✅ Tất cả người dùng đều có quyền điều khiển  
- ✅ Realtime console log  
- ✅ Giao diện Light (sáng, thân thiện, dễ nhìn)
- ## ⚙️ Cấu hình `.env`

Tạo file `.env` trong thư mục `server/`:

```env
WORK_DIR=./sandbox_server
EGGS_DIR=./eggs
RCON_HOST=127.0.0.1
RCON_PORT=25575
RCON_PASSWORD=yourpw
STARTUP_CMD=java -Xmx2G -jar server.jar nogui
AUTO_RESTART=true
AUTO_BACKUP=true
BACKUP_INTERVAL=3600000
BACKUP_MAX_COUNT=5
ALLOW_DOWNLOAD_BACKUP=true
ALLOW_RESTORE_BACKUP=true


---

🧱 Cách cài đặt & chạy

1️⃣ Cài Backend (server)

cd server
npm install
cp .env.example .env
npm run dev

2️⃣ Cài Frontend (web)

cd ../web
npm install
npm run dev

3️⃣ Truy cập trình duyệt

http://localhost:5173

Mặc định backend chạy cổng 5174, frontend cổng 5173.
Có thể đổi trong file vite.config.js hoặc index.js.


---

🔐 Tài khoản mặc định

Loại	Tên đăng nhập	Mật khẩu

Admin	admin	admin123


Tất cả user (bao gồm user phụ) đều có quyền:

Start / Stop / Restart / Kill server

Backup / Restore / Download backup



---

💾 Backup & Restore

🕒 Tự động backup

Panel tự zip thư mục:

./sandbox_server/world
./sandbox_server/plugins
./sandbox_server/config

→ lưu tại ./backups/, giữ tối đa 5 bản gần nhất.

💾 Tạo backup thủ công

Trong web panel → Backup Settings → Run Backup Now.

📥 Tải file backup

Trong danh sách backup → bấm Download.

⬆️ Khôi phục backup

Trong tab Backup Settings:

1. Bấm “Upload Backup”


2. Chọn file .zip từ máy bạn


3. Panel sẽ tự giải nén và ghi đè vào WORK_DIR




---

🔄 Auto Restart

Nếu Minecraft server bị crash (exit code ≠ 0),
panel sẽ tự khởi động lại server sau 10 giây.
🧩 Phụ lục

NodeJS yêu cầu: ≥ 18.x

Java yêu cầu: ≥ 17

Minecraft hỗ trợ: Paper / Spigot / Fabric

Cổng mặc định:

Web (Frontend): 5173

API (Backend): 5174


Thư mục dữ liệu:

sandbox_server/ – chứa server.jar, world, plugins

backups/ – chứa bản sao lưu .zip




---

❤️ Ghi chú

> Phiên bản v5.7 là bản “Final Cloud Edition” —
tích hợp toàn bộ tính năng quản lý, điều khiển, backup, và khôi phục server Minecraft
chỉ bằng một giao diện web duy nhất.




---

Tác giả: Nguyen Hung
Tên dự án: hktmc Panel Manager
Phiên bản: v5.7 Final Cloud Edition
Ngày build: $(04/10/2025)
