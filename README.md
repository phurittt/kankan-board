# Kanban Board

โปรเจกต์ Kanban Board สร้างด้วย **Vue 3 + Nuxt 4 + TypeScript + Tailwind CSS v4**

เป็นแอปแบบ **frontend-only**: ไม่มี backend/API/ฐานข้อมูลจริง ข้อมูลทั้งหมด (ผู้ใช้, บอร์ด, คอลัมน์, task, แท็ก, การแจ้งเตือน) เก็บอยู่ใน **LocalStorage** ของเบราว์เซอร์

## ลิงก์ที่เกี่ยวข้อง

- **GitHub**: https://github.com/phurittt/kanban-board.git
- **Vercel**: https://kanban-board-two-virid.vercel.app
- **Figma**: https://www.figma.com/design/xXj3qgecsKXaLG5nwYQkAL/Kanban-Board?node-id=0-1&t=MGZYiFDRNfjNFtUs-1

## วิธีรัน

ต้องมี [Node.js](https://nodejs.org/) ติดตั้งไว้ (แนะนำเวอร์ชันตาม `.nvmrc` คือ `22.23.2` แต่ Node LTS เวอร์ชันใกล้เคียงก็ใช้ได้)

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000` (หรือ port อื่นที่ terminal แจ้ง ถ้า 3000 ถูกใช้งานอยู่)

สำหรับ build แบบ production:

```bash
npm run build
npm run preview
```

## Login สำหรับทดสอบ

แอปนี้ใช้ **mock user** มี user ทดสอบให้พร้อมใช้ตั้งแต่เปิดแอปครั้งแรก:

| Username | Password |
| -------- | -------- |
| `alice`  | `1234`   |
| `bob`    | `1234`   |
| `carol`  | `1234`   |

หรือจะกด "สมัครสมาชิก" เพื่อสร้าง user ใหม่เองก็ได้ (ข้อมูลจะถูกเพิ่มเข้าไปใน pool เดียวกัน เก็บใน LocalStorage)

## ฟีเจอร์ที่ทำ

- **Register / Login** — mock authentication เก็บ session ใน LocalStorage
- **Board**: สร้าง / ลบ / แก้ชื่อ / เปลี่ยนสี / เรียงลำดับ (ล่าสุดที่แก้ไข, สร้างล่าสุด, สร้างเก่าสุด)
- **Invite สมาชิก**: เพิ่ม/ลบสมาชิกเข้าบอร์ดผ่าน username
- **Column**: สร้าง / ลบ / แก้ชื่อ (inline) / เปลี่ยนสี / ย้ายตำแหน่ง
- **Task**: สร้าง / ลบ / แก้ชื่อ / แก้คำอธิบาย / ติ๊กเสร็จ
  - ย้าย task ข้ามคอลัมน์ได้ทั้งแบบ **ลาก-วางด้วยเมาส์** และแบบเลือกคอลัมน์+ตำแหน่งจากเมนู
  - เพิ่ม **แท็ก** (ป้ายสี ตั้งชื่อ/สีเองได้) ให้ task
  - เพิ่ม **รูปภาพ** ให้ task ได้ (เก็บเป็น base64 ใน LocalStorage)
  - ตั้ง **วันครบกำหนด + เวลา**
- **มอบหมายสมาชิกรับผิดชอบ task** — เลือกจากสมาชิกในบอร์ดเท่านั้น
  - เมื่อถูกมอบหมาย จะได้รับ **การแจ้งเตือนในระบบ** (กระดิ่งที่ top bar)

## ข้อจำกัด / Design decisions ที่ตั้งใจไว้

- Password เก็บเป็น plaintext ใน LocalStorage
- Invite สมาชิกเข้าบอร์ด/มอบหมาย task ทำผ่านการเลือกจาก username ที่มีอยู่ในระบบ ไม่ใช่การส่งอีเมลเชิญจริง
- รูปภาพเก็บเป็น base64 ใน LocalStorage โดยตรง
