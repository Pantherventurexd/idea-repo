const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDlRbE7MZUgXqO65A74buZHZFb0CDWJSU0";
const GEMINI_API_URL = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/startup-idea-generator";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://likhithreddy150:12jVCeYLJ0TmeTw1@cluster0.3fmhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ozxwhlvwkqfibqaxcfht.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96eHdobHZ3a3FmaWJxYXhjZmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NTczMjgsImV4cCI6MjA1NzUzMzMyOH0.xhc26awjkhS5zaSzRhA7iXWzLI4FGBi7cCcGseBgjBI";
export { GEMINI_API_KEY, GEMINI_API_URL, PORT, MONGODB_URI, MONGO_URI, SUPABASE_URL, SUPABASE_KEY };
