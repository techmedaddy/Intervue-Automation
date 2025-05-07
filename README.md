# 📌 Project Introduction

This project automates the company login workflow on [Intervue.io](https://www.intervue.io) using Selenium and Node.js inside Docker. It simulates real user behavior—logging in, searching on the dashboard, capturing a screenshot, and logging out—all in a headless browser environment.

  
  
  ## 📁 Project Structure
```bash
intervue-automation/
├── Dockerfile
├── docker-compose.yml
├── test.js
├── .env
├── package.json
└── README.md
```
This project runs Selenium tests inside a Docker environment to automate login and logout on [intervue.io](https://www.intervue.io).
## 🚀 Getting Started

Follow these steps to clone and run this project locally using Docker.
## 📦 Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
# 🔁 Clone the Repository

```bash
git clone https://github.com/your-username/intervue-automation.git
```
```bash
cd intervue-automation
```

---

### 🔐 Environment Setup

Create a `.env` file in the root directory:

```env
INTERVUE_EMAIL=your-email@example.com
INTERVUE_PASSWORD=your-password
```


---

### 📦 Install Dependencies (Optional)

If you want to run the test manually without Docker:

```bash
npm install
```


---

### 🐳 Run with Docker


Build and run the containers using Docker Compose:

```bash
docker-compose up --build
```


---

### 📷 Screenshots


The screenshot from the test will be saved as:
```env
screenshot-YYYY-MM-DD-HH-MM-SS.png
```


in the project root.

# 🧪 What the Test Does

1. Navigates to [https://www.intervue.io](https://www.intervue.io)
2. Clicks the **Login** button
3. Selects **For Companies**
4. Logs in with credentials from `.env`
5. Waits for dashboard and searches
6. Takes a screenshot
7. Logs out
# 🧹 Cleanup

To stop and remove containers:

```bash
docker-compose down
```

---

### ❓ Troubleshooting


- Ensure Docker is running
- Check if the credentials in `.env` are correct
- Increase Selenium timeouts in `test.js` if the test fails on slow internet
- Logs are printed in the terminal for each step

