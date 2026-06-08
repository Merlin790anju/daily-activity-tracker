# Daily Activity Tracker 📝 

A simple browser-based app for tracking daily activities. You can add activities, set time and duration, organize them by category, mark them as complete, and review activities for different dates.

## Features

- Add daily activities with a name, time, duration, category, and notes
- Track activities date-wise
- Mark activities as complete or open
- Filter activities by all, open, or done
- View daily totals for activities, completed items, and minutes
- Progress bar for daily completion
- Saves data locally in the browser using `localStorage`
- Responsive layout for desktop and mobile screens

## Project Files

```text
daily-activity-tracker/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## How To Use

1. Open `index.html` in your browser.
2. Select the date you want to track.
3. Enter an activity name.
4. Optionally add time, minutes, category, and notes.
5. Click **Add Activity**.
6. Use the circular check button to mark an activity as done.
7. Use the delete button to remove an activity.
8. Use the filters to view all, open, or completed activities.

## Categories

The app includes these default categories:

- Health
- Work
- Study
- Home
- Personal

You can edit the categories inside `index.html` by changing the options in the category dropdown.

## Data Storage

This app stores activity data in your browser using `localStorage`.

That means:

- Your data stays on your own device
- No account or login is required
- No backend server is needed
- Data may be cleared if you clear browser storage

## Technologies Used

- HTML
- CSS
- JavaScript
- Browser `localStorage`

## Running Locally

You can open the app directly:

```text
index.html
```

Or run it with a local server:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173
```

## GitHub Pages Deployment

To publish this app using GitHub Pages:

1. Upload all project files to your GitHub repository.
2. Go to your repository settings.
3. Open **Pages** from the left menu.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch.
6. Select the root folder.
7. Click **Save**.

After a short time, GitHub will provide a live website link.

## Future Improvements

Possible future features:

- Weekly and monthly reports
- Export activities as CSV
- Custom categories
- Search activities
- Dark mode
- Streak tracking
- Cloud sync

## Author

Created by Merlin790anju.

## License

This project is open for learning and personal use.
