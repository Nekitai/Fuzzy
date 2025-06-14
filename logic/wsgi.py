# logic/wsgi.py
from app import app # Impor instance aplikasi Flask Anda dari app.py

# Ini penting: Vercel akan mencari 'app' sebagai callable WSGI
# Jika aplikasi Flask Anda diberi nama lain, pastikan untuk mengimpornya dan memberikan nama 'app'.