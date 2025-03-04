import { useState } from "react";
import { Button, TextField, Avatar } from "@mui/material";

export default function Instructor_Profile() {
  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Ferguson",
    email: "",
    profession: "",
    bio: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-white text-[#161931] px-6 md:px-16 lg:px-28">
      <aside className="hidden md:block w-1/3 lg:w-1/4 py-4 border-r border-indigo-100">
        <div className="sticky top-12 flex flex-col gap-4 p-4 text-sm">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <Button variant="text">Public Profile</Button>
          <Button variant="text">Account Settings</Button>
          <Button variant="text">Notifications</Button>
          <Button variant="text">PRO Account</Button>
        </div>
      </aside>
      <main className="w-full md:w-2/3 lg:w-3/4 py-6">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Public Profile</h2>
          <div className="flex flex-col items-center sm:flex-row sm:space-x-8">
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnEsDu7JPmVt1jag8XfY49-XarWr0G0AgSa3P5aTGIfDkGaN6Ow5YipNo&s"
              sx={{ width: 100, height: 100 }}
            />
            <div className="flex flex-col gap-3 mt-4 sm:mt-0">
              <Button variant="contained" className="bg-indigo-900 text-white">Change Picture</Button>
              <Button variant="outlined">Delete Picture</Button>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <TextField
              label="First Name"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Profession"
              name="profession"
              value={profile.profession}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <div className="flex justify-end">
              <Button variant="contained" className="bg-indigo-700 text-white">Save</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
