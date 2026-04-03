# Quiz Feature Setup Guide

## Overview
I've created a complete quiz system for your music learning app with:
- ✅ Quiz model for MongoDB
- ✅ Quiz API endpoints 
- ✅ Quiz page UI with filtering
- ✅ Navigation link in sidebar
- ✅ Sample quiz data JSON file

---

## File Locations

1. **Quiz Model**: `d:\virtuoso-app\app\models\Quiz.ts`
2. **API Endpoints**: 
   - `d:\virtuoso-app\app\api\quizzes\route.ts` (list quizzes)
   - `d:\virtuoso-app\app\api\quizzes\[id]\route.ts` (get single quiz)
3. **Quiz Page**: `d:\virtuoso-app\app\dashboard\student\quiz\page.tsx`
4. **Quiz Data**: `d:\virtuoso-app\quiz-data.json`

---

## How to Import Quiz Data to MongoDB

### Option 1: Using MongoDB Atlas Web Interface (Easiest)

1. **Open MongoDB Atlas**
   - Go to https://cloud.mongodb.com/
   - Sign in to your account
   - Select your cluster

2. **Navigate to Collections**
   - Click "Collections" tab
   - Select your database (e.g., "virtuoso")
   - Click "Create Collection" if needed, name it "quizzes"

3. **Import JSON Data**
   - In the "quizzes" collection, click the "+" button to add documents
   - Click "Insert Multiple Documents"
   - Open `quiz-data.json` and copy all the content
   - Paste into the import dialog
   - Click "Insert"

### Option 2: Using MongoDB Compass (Desktop Application)

1. **Install MongoDB Compass**
   - Download from: https://www.mongodb.com/products/compass
   - Install and launch

2. **Connect to Your MongoDB**
   - Click "New Connection"
   - Paste your MongoDB connection string (from MongoDB Atlas)
   - Click "Connect"

3. **Import the JSON File**
   - Select your database → click on it
   - Right-click in the collection list → "Create Collection" → name it "quizzes"
   - Right-click "quizzes" collection → "Import Data"
   - Select "JSON" as file type
   - Browse and select `quiz-data.json`
   - Click "Import"

### Option 3: Using MongoDB Shell (Command Line)

1. **Find Your Connection String**
   - In MongoDB Atlas: Cluster → Connect → Shell
   - Copy the connection string

2. **Run Import Command**
   ```bash
   mongoimport --uri "mongodb+srv://<username>:<password>@cluster.mongodb.net/virtuoso" \
     --collection quizzes \
     --file quiz-data.json \
     --jsonArray
   ```
   Replace `<username>`, `<password>`, and `cluster` with your actual values

### Option 4: Using MongoDB Shell in Windows PowerShell

```powershell
# After installing MongoDB Shell, run:
mongoimport --uri "mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/virtuoso?retryWrites=true&w=majority" `
  --collection quizzes `
  --file "D:\virtuoso-app\quiz-data.json" `
  --jsonArray
```

---

## Verify Import Success

1. **In MongoDB Atlas:**
   - Navigate to Collections
   - Check "virtuoso" → "quizzes"
   - You should see 7 quiz documents

2. **In Your App:**
   - Navigate to /dashboard/student/quiz
   - You should see quiz cards for Guitar, Piano, Drums, and Violin

---

## Quiz Data Structure

Each quiz contains:

```typescript
{
  quizId: string           // Unique identifier
  instrument: string       // Guitar, Piano, Drums, Violin, etc.
  level: string           // Beginner, Intermediate, Advanced
  title: string           // Quiz title
  description: string     // Quiz description
  questions: [
    {
      questionId: string
      question: string
      type: string        // 'multiple-choice', 'true-false', 'fill-blank'
      options: string[]
      correctAnswer: string
      explanation: string
    }
  ]
  passingScore: number    // Default 70%
}
```

---

## Adding More Quizzes

To add more quizzes:

1. **Edit `quiz-data.json`**:
   - Copy a quiz object
   - Change the quizId, title, description, and questions
   - Save the file

2. **Re-import**:
   - Use one of the methods above to import the new quizzes
   - The system will add them without duplicating existing ones (thanks to unique quizId)

3. **Or Add Via API** (optional):
   - You can add an API endpoint to create quizzes programmatically

---

## Features Included

✅ **Quiz Listing Page** - Displays all quizzes with filters
✅ **Instrument Filter** - Filter by Guitar, Piano, Drums, Violin, etc.
✅ **Level Filter** - Filter by Beginner, Intermediate, Advanced
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Quiz Cards** - Shows question count, level, and instrument
✅ **Navigation Integration** - Quiz icon in sidebar (BarChart3)

---

## Next Steps (Optional)

To complete the quiz feature, you can add:

1. **Quiz Taking Page** (`/dashboard/student/quiz/[id]/page.tsx`)
   - Display questions one by one
   - Handle user answers
   - Calculate score

2. **Quiz Results Page**
   - Show final score
   - Show which questions were correct/wrong
   - Provide explanations

3. **Quiz Scores Model**
   - Store user quiz attempts in database
   - Track score history
   - Show progress over time

4. **Certificate System**
   - Award badges/certificates for completing quizzes
   - Display earned certificates on profile

---

## Troubleshooting

**Problem**: Quizzes not appearing in the app
- Solution: Verify the collection name is exactly "quizzes" (lowercase)
- Check MongoDB connection string is correct
- Restart your Next.js dev server

**Problem**: Import fails with duplicate key error
- Solution: The quizId already exists in the database
- Delete the collection and re-import, OR use different quizIds

**Problem**: Questions not loading
- Solution: Ensure the quiz JSON structure matches the schema
- Check for missing required fields

---

## Support

The quiz system is now integrated with your app!
- Sidebar shows the quiz icon (BarChart3) in position 3
- Quiz page is at `/dashboard/student/quiz`
- Individual quizzes at `/dashboard/student/quiz/{quizId}`
