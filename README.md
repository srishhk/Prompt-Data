# PromptData ✨

> **Describe your dataset. Get it instantly.**

PromptData is an AI-powered dataset generator. Just describe what data you need in plain English, and get a clean, downloadable dataset in seconds — no coding required.

---

## 🚀 Features

- **Natural language prompts** — describe any dataset and it gets generated instantly
- **Quick templates** — Students, Hospital, Stocks, E-commerce, HR, Cricket and more
- **Regional locales** — All India, North India, South India, Maharashtra, Gujarat, East India
- **Multiple export formats** — Excel, JSON, CSV, SQL, XML
- **Data preview table** — sort, search, and paginate through results
- **Numeric stats** — min, max, avg auto-calculated for numeric columns
- **Generation history** — revisit and re-run previous prompts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | OpenAI API |
| Data | Pandas, NumPy, Faker |
| Export | XLSX, JSON, CSV, SQL, XML |

---

## 📁 Project Structure

```
PromptData/
├── frontend/               # Next.js app
│   └── app/
│       └── generate/
│           └── page.tsx    # Main generate page
├── backend/                # FastAPI app
│   ├── main.py             # Entry point
│   ├── routes/
│   │   ├── generate.py     # Dataset generation route
│   │   ├── export.py       # Export route
│   │   └── library.py      # Library route
│   └── requirements.txt
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/promptdata.git
cd promptdata
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 Deployment

### Backend → [Railway](https://railway.app)

1. Push your code to GitHub
2. Go to Railway → New Project → Deploy from GitHub
3. Select your `backend/` folder
4. Add environment variable: `OPENAI_API_KEY`
5. Railway gives you a public URL like `https://promptdata-api.up.railway.app`

### Frontend → [Vercel](https://vercel.com)

1. Go to Vercel → New Project → Import GitHub repo
2. Set root directory to `frontend/`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
   ```
4. Click Deploy — your app is live at `https://promptdata.vercel.app`

> ⚠️ **Important:** Deploy the backend first, then use its URL in the frontend environment variables.

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/generate` | Generate a dataset from a prompt |
| POST | `/api/export` | Export dataset in a specific format |
| GET | `/api/library` | Get saved datasets |

---

## 🧑‍💻 Usage Example

1. Open the app
2. Select a quick template (e.g. 🎓 Students) or write your own prompt:
   ```
   500 rows of Indian hospital patient records with patient_name, age, disease, ward, bill_amount
   ```
3. Choose number of rows and locale
4. Click **✨ Generate Dataset**
5. Preview, search, sort the data
6. Download as Excel / CSV / JSON / SQL / XML

---

## 📄 License

MIT License — feel free to use, modify, and deploy.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
