# Social-Media-Application-with-Firebase

This project is a simple social media platform built using ASP.NET MVC for the backend and Firebase for authentication, real-time database, and file storage. The frontend utilizes Razor Pages with HTML, CSS, and JavaScript.

## Features
- **User Registration and Authentication**: Users can register, log in, and log out using Firebase Authentication.
- **Profile Management**: Users can view and update their profiles, including uploading profile images, using Firebase Storage.
- **Post Creation and Feed**: Users can create posts with optional images and view a feed of posts.
- **Commenting**: Users can comment on posts.
- **Follow System**: Users can follow or unfollow other users.
- **Real-time Updates**: Data like posts and comments are updated in real-time using Firebase Realtime Database or Firestore.

## Technologies Used
- **ASP.NET MVC**: Backend framework to handle routing, controllers, and views.
- **Firebase**:
  - **Authentication**: For user registration and authentication.
  - **Realtime Database**: For storing posts, comments, and user data.
  - **Storage**: For managing profile pictures and post images.
- **Razor Pages**: To generate dynamic HTML content in the frontend.
- **HTML/CSS/JavaScript**: For the frontend structure and interactivity.
- **BootStrap**: Used for form components and UI enhancements.

## Installation
1. Clone the repository:

```
git clone https://github.com/aqizzz/Social-Media-Application-with-Firebase.git
cd Social-Media-Application-with-Firebase
```

2. Setup Firebase:

  - Go to **Firebase Console** and create a new project.
  - Enable **Authentication** with email/password.
  - Enable **Realtime Database** and **Storage**.

3. Add Firebase Configuration:

  - Add a '.env' file with your Firebase config to the project's root directory:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

4. Run the Application

```
dotnet run
```
