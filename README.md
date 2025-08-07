Minimalist To-Do App 📝
Hey there! 👋 This is a simple and clean to-do list app I built to practice my HTML, CSS, and JavaScript skills. It's designed to be straightforward and helps you keep track of your tasks without any fuss. All your tasks are saved right in your browser.

Features
✏️ Add, Edit, and Delete Tasks: All the basics you'd expect. You can add new tasks, edit them directly in the list, and delete them when you're done.

✅ Mark as Complete: Click the checkbox to cross off a task and keep track of your progress.

💾 Saves Your Work: Your to-do list is automatically saved in your browser, so your tasks will still be there when you come back.

📱💻 Clean & Responsive: It's designed to look good and work well on any device, whether it's your phone or a desktop.

📊 Helpful Stats: See how many tasks you have in total, how many you've completed, and how many are left.


Challenges & Learnings 💡
This was a fun project, but it came with a few interesting challenges:

🧩 Inline Editing: Making the tasks editable directly in the list was a fun puzzle. I used the contentEditable attribute, but the real challenge was figuring out the best way to save the changes. I ended up using the blur event (when the user clicks away) and the keypress event for the "Enter" key to make it feel intuitive and seamless.

🔄 State Management: Keeping the UI perfectly in sync with the underlying data (the tasks array) was crucial. After any action—like adding, deleting, or completing a task—I made sure to call a single render() function. This function redraws the entire list based on the current state of the tasks array, which prevents bugs and ensures the display is always accurate.

💾 Persistent Storage: I wanted tasks to be there even after closing the browser. The challenge was correctly saving and retrieving the tasks array from localStorage. I learned to use JSON.stringify() to save the array as a string and JSON.parse() to load it back as an array, making sure to handle the initial case where no tasks have been saved yet.
