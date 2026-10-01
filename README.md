# Vyuastra Robotics (MERN)

vyuastra/
  frontend/    public website (React)      -> http://localhost:5173
  adminpanel/  admin panel (React)         -> http://localhost:5174
  backend/     API (Express, JWT, uploads) -> http://localhost:5000
  database/    MongoDB models, connection, seed script

## Run
1. `cp backend/.env.example backend/.env`   (Windows: copy) then edit values
2. `npm install`      (once, in this root folder; installs all 4 folders)
3. `npm run dev`      (starts backend + website + admin panel together)
4. Optional sample content: `npm run seed`

Admin login = ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env
Uploaded images are saved in backend/uploads/
